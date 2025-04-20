import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckIcon,
  TruckIcon,
  InfoIcon,
} from "lucide-react";
import { RootState } from "../redux/store";
import CartItem from "../components/CartItem";
import Button from "../components/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { placeOrder } from "../services/orderService";
import { clearCart } from "../redux/slices/cartSlice";
import { setOrderDetails } from "../redux/slices/orderSlice";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.total);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [deliveryAddress, setDeliveryAddress] = useState("123 Main Street, Apt 4B, Anytown, CA 12345");
  const [contactNumber, setContactNumber] = useState("555-123-4567");
  const [specialInstructions, setSpecialInstructions] = useState("");

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

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsProcessing(true);
      setOrderError(null);

      // Get the first restaurant's ID since we currently support one restaurant per order
      const restaurantId = cartItems[0].restaurantId;

      // Create order request
      const orderData = {
        items: cartItems,
        restaurantId,
        totalAmount,
        deliveryAddress,
        contactNumber,
        paymentMethod,
        specialInstructions,
      };

      // Call the order service
      const response = await placeOrder(orderData);

      if (response.success) {
        // Store order details in Redux
        dispatch(setOrderDetails({
          orderId: response.order._id,
          amount: totalAmount * 100, // Convert to cents for Stripe
          customerName: "Customer Name", // In a real app, get from user profile
          customerAddress: deliveryAddress,
          customerPhone: contactNumber,
          restaurantName: cartItems[0].restaurantName,
          restaurantAddress: "Restaurant Address", // In a real app, get from restaurant data
        }));

        // Clear the cart
        dispatch(clearCart());
        
        setIsOrderComplete(true);

        // Redirect to home after a delay
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setOrderError("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderError("An error occurred while placing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
                  <p className="text-gray-600">{deliveryAddress}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">
                  Payment Method
                </h3>
              </div>
              <div className="space-y-3">
                <div 
                  className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                    paymentMethod === "Credit Card" ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("Credit Card")}
                >
                  <div className="h-5 w-5 rounded-full border mr-3 flex items-center justify-center">
                    {paymentMethod === "Credit Card" && (
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <CreditCardIcon size={20} className="text-gray-600 mr-3" />
                  <span className="font-medium">Credit Card</span>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                    paymentMethod === "Cash on Delivery" ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                >
                  <div className="h-5 w-5 rounded-full border mr-3 flex items-center justify-center">
                    {paymentMethod === "Cash on Delivery" && (
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <TruckIcon size={20} className="text-gray-600 mr-3" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
              </div>
            </div>
            
            {/* Special Instructions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <InfoIcon size={20} className="text-gray-600 mr-2" />
                <h3 className="font-bold text-lg text-gray-800">
                  Special Instructions
                </h3>
              </div>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows={3}
                placeholder="Add any special instructions for your order..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed pt-3 mt-3">
                  <div className="flex justify-between font-bold text-gray-900 text-base">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {orderError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {orderError}
                </div>
              )}

              <Button
                variant="primary"
                fullWidth
                className="mt-6"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  "Place Order"
                )}
              </Button>
              
              <p className="text-xs text-gray-600 text-center mt-4">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
