import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckIcon,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import Button from "../components/Button";
const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  // Group cart items by restaurant
  const itemsByRestaurant = cartItems.reduce(
    (acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = {
          restaurantName: item.restaurantName,
          items: [],
        };
      }
      acc[item.restaurantId].items.push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        restaurantName: string;
        items: typeof cartItems;
      }
    >
  );
  // Calculate fees
  const deliveryFee = 2.99;
  const serviceFee = cartTotal * 0.05; // 5% service fee
  const tax = cartTotal * 0.08; // 8% tax
  const totalAmount = cartTotal + deliveryFee + serviceFee + tax;
  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrderComplete(true);
      clearCart();
      // Redirect to home after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 2000);
  };
  if (cartItems.length === 0 && !isOrderComplete) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add items from restaurants to start an order.
            </p>
            <Link to="/">
              <Button variant="primary">Browse Restaurants</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (isOrderComplete) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Order placed successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You'll receive a confirmation email
              shortly.
            </p>
            <p className="text-gray-600 mb-6">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeftIcon size={18} className="mr-2" />
          <span>Continue Shopping</span>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Order
              </h2>
              {Object.entries(itemsByRestaurant).map(
                ([restaurantId, { restaurantName, items }]) => (
                  <div key={restaurantId} className="mb-8">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">
                      {restaurantName}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          price={item.price}
                          quantity={item.quantity}
                          imageUrl={item.imageUrl}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">
                  Delivery Address
                </h3>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Change
                </button>
              </div>
              <div className="flex items-start">
                <MapPinIcon
                  size={20}
                  className="text-gray-500 mt-1 mr-3 flex-shrink-0"
                />
                <div>
                  <p className="text-gray-800 font-medium">Home</p>
                  <p className="text-gray-600">123 Main Street, Apt 4B</p>
                  <p className="text-gray-600">Anytown, CA 12345</p>
                </div>
              </div>
            </div>
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">
                  Payment Method
                </h3>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Change
                </button>
              </div>
              <div className="flex items-center">
                <CreditCardIcon size={20} className="text-gray-500 mr-3" />
                <div>
                  <p className="text-gray-800 font-medium">
                    Visa ending in 1234
                  </p>
                  <p className="text-gray-600 text-sm">Expires 12/25</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
