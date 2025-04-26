const Stripe = require("stripe");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/Transaction.js");

const createPaymentIntent = async (req, res) => {
  console.log("Received body:", req.body);

  try {
    // Extract all required fields from the request body
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

    // Validate required fields
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
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body,
        missing: {
          amount: !amount,
          orderId: !orderId,
          customerName: !customerName,
          customerAddress: !customerAddress,
          customerPhone: !customerPhone,
          customerEmail: !customerEmail,
          restaurantName: !restaurantName,
          restaurantAddress: !restaurantAddress,
        },
      });
    }

    // Create payment intent first
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId,
        customerName,
        customerAddress,
        customerPhone,
        customerEmail,
        restaurantName,
        restaurantAddress,
        amount: amount.toString(), // Convert to string for metadata
      },
    });

    // Save transaction record
    const transaction = new Transaction({
      orderId,
      amount,
      paymentStatus: "pending",
      paymentIntentId: paymentIntent.id,
      customerName,
      customerAddress,
      customerPhone,
      customerEmail,
      restaurantName,
      restaurantAddress,
    });
    await transaction.save();

    // Separate try/catch for delivery creation
    try {
      // Create delivery record
      await axios.post(`${process.env.DELIVERY_SERVICE_URL}/delivery`, {
        orderId,
        customerName,
        customerPhone,
        customerEmail,
        pickupAddress: restaurantAddress,
        dropAddress: customerAddress,
        restaurantName,
        amount,
      });

      console.log(`Delivery created successfully for order: ${orderId}`);
    } catch (deliveryError) {
      console.error(
        "Delivery creation failed:",
        deliveryError.response?.data || deliveryError.message,
        "Status:",
        deliveryError.response?.status
      );

      // Continue processing - we'll try again in the webhook
    }

    // Return client secret to the frontend
    res.status(200).json({
      message: "Payment intent created",
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id,
    });
  } catch (err) {
    console.error("Payment creation failed:", err.message);
    res
      .status(500)
      .json({ error: "Payment creation failed", message: err.message });
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
      customerEmail,
      customerAddress,
      restaurantName,
      restaurantAddress,
      amount,
    } = paymentIntent.metadata || {};

    try {
      // Update transaction status
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

      // Try to create delivery again as a fallback
      try {
        await axios.post(`${process.env.DELIVERY_SERVICE_URL}/delivery`, {
          orderId,
          customerName,
          customerPhone,
          customerEmail,
          pickupAddress: restaurantAddress,
          dropAddress: customerAddress,
          restaurantName,
          amount: parseInt(amount, 10),
        });
      } catch (deliveryError) {
        console.error(
          "Webhook delivery creation failed:",
          deliveryError.response?.data || deliveryError.message
        );
      }
    } catch (err) {
      console.error("Webhook processing failed:", err.message);
    }
  }

  res.json({ received: true });
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found"
      });
    }
    
    await Transaction.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message
    });
  }
};

module.exports = {
  createPaymentIntent,
  handleStripeWebhook,
  getAllTransactions,
  deleteTransaction
};
