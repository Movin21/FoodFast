import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import {
  Shield,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const navigate = useNavigate();

  const reduxOrder = useSelector((state) => state.order);

  const orderDetails = {
    amount: reduxOrder.amount,
    orderId: reduxOrder.orderId,
    customerName: reduxOrder.customerName,
    customerAddress: reduxOrder.customerAddress,
    customerPhone: reduxOrder.customerPhone,
    customerEmail: reduxOrder.customerEmail,
    restaurantName: reduxOrder.restaurantName,
    restaurantAddress: reduxOrder.restaurantAddress,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Check if card field is complete before proceeding
    if (!cardComplete) {
      setError("Please fill out the card information completely.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Send all order details directly instead of the orderDetails object
      const res = await axios.post("http://localhost:8000/api/payment/create", {
        amount: orderDetails.amount,
        orderId: orderDetails.orderId,
        customerName: orderDetails.customerName,
        customerAddress: orderDetails.customerAddress,
        customerPhone: orderDetails.customerPhone,
        customerEmail: orderDetails.customerEmail,
        restaurantName: orderDetails.restaurantName,
        restaurantAddress: orderDetails.restaurantAddress,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: orderDetails.customerName,
            address: { line1: orderDetails.customerAddress },
            phone: orderDetails.customerPhone,
            email: orderDetails.customerEmail,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed. Please try again.");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError("An unexpected error occurred. Please try again later.");
    }

    setLoading(false);
  };

  // Handle card field change event
  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: '"Inter", system-ui, sans-serif',
        color: "#334155",
        "::placeholder": {
          color: "#94a3b8",
        },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-8 shadow-lg rounded-lg bg-white animate-in fade-in slide-in-from-bottom-4 my-10">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Successful
          </h2>
          <p className="text-gray-600 mb-6">
            Order #{orderDetails.orderId} has been confirmed. Your confirmation
            will be sent.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-medium text-gray-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(orderDetails.amount / 100)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Restaurant</p>
                <p className="font-medium text-gray-900">
                  {orderDetails.restaurantName}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/delivery/${orderDetails.orderId}`)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Track My Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 shadow-lg rounded-lg bg-white my-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>
        <div className="flex items-center space-x-1 text-green-600">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order ID</span>
            <span className="font-medium text-gray-900">
              {orderDetails.orderId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Restaurant</span>
            <span className="font-medium text-gray-900">
              {orderDetails.restaurantName}
            </span>
          </div>
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Total Amount</span>
              <span className="text-lg font-semibold text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(orderDetails.amount / 100)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4" />
            <span>Card Information</span>
          </label>
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
          {error && (
            <div className="mt-2 flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Billing Details</h4>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">Name</span>
              <span className="font-medium text-gray-900">
                {orderDetails.customerName}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Address</span>
              <span className="font-medium text-gray-900">
                {orderDetails.customerAddress}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="font-medium text-gray-900">
                {orderDetails.customerPhone}
              </span>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <span>
              Pay{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(orderDetails.amount / 100)}
            </span>
          )}
        </button>
      </form>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
          <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium text-gray-900">
                Processing your payment...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
