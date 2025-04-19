const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/Transaction");
const axios = require("axios");

const createPaymentIntent = async (req, res) => {
  const {
    amount,
    orderId,
    customerName,
    customerAddress,
    customerPhone,
    customerEmail,
    restaurantName,
    restaurantAddress,
  } = req.body;

  if (
    !amount ||
    !orderId ||
    !customerName ||
    !customerAddress ||
    !customerPhone ||
   !customerEmail ||
    !restaurantName ||
    !restaurantAddress
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId,
        customerName,
        customerAddress,
        customerPhone,
        restaurantName,
        restaurantAddress,
        amount,
      },
    });

    const transaction = new Transaction({
      orderId,
      amount,
      paymentStatus: "pending",
      paymentIntentId: paymentIntent.id,
      customerName,
      customerAddress,
      customerPhone,
      restaurantName,
      restaurantAddress,
    });

    await transaction.save();

    // Immediately create delivery (optional fallback: add flag to mark as "created")
    await axios.post("http://localhost:8000/api/delivery", {
      orderId,
      customerName,
      customerPhone,
     customerEmail,
      pickupAddress: restaurantAddress,
      dropAddress: customerAddress,
      restaurantName,
      amount,
    });

    res.status(200).json({
      message: "Payment intent created and delivery initiated",
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id,
    });
  } catch (err) {
    console.error("Payment or delivery creation failed:", err.message);
    res.status(500).json({ error: "Payment or delivery creation failed" });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const {
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      restaurantName,
      restaurantAddress,
      amount,
    } = paymentIntent.metadata || {};

    try {
      await Transaction.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        {
          paymentStatus: "succeeded",
          customerName,
          customerPhone,
          customerAddress,
          restaurantName,
          restaurantAddress,
          amount: paymentIntent.amount,
        },
        { new: true }
      );

      // Fallback: create delivery again in case it wasn't already created
      await axios.post("http://localhost:8000/api/delivery", {
        orderId,
        customerName,
        customerPhone,
        pickupAddress: restaurantAddress,
        dropAddress: customerAddress,
        restaurantName,
        amount: paymentIntent.amount,
      });
    } catch (err) {
      console.error("Webhook processing failed:", err.message);
    }
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  handleStripeWebhook,
};
