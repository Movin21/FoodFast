import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderSearch() {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOrderId(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }

    // Navigate to the delivery tracking page with the order ID
    navigate(`/delivery/${orderId}`);
  };

  return (
    <div className="mt-20 mb-20 max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Track Your Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="orderSearch"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Order ID
          </label>

          <div className="relative">
            <input
              type="text"
              id="orderSearch"
              value={orderId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your order number"
            />

            <button
              type="submit"
              className="mt-3 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Track Order
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Enter your order ID to check the current status and location of your
        delivery in real-time.
      </p>
    </div>
  );
}

export default OrderSearch;
