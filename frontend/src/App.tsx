import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Layout/Header";
import Layout from "./components/Layout/Layout";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkout from "./pages/Checkout";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Login from "./components/auth/LoginForm";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import CheckoutForm from "./components/CheckoutForm";
import PaymentGateway from "./components/PaymentGateway";

export function App() {
  console.log("App rendering");

  // Get current pathname
  const pathname = window.location.pathname;
  const hideFooterPaths = ["/restaurant/dashboard"];
  const shouldShowFooter = !hideFooterPaths.includes(pathname);

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Global Header for all routes */}
          <Header />

          <div className="flex-grow">
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login isSignup={true} />} />
                <Route path="/payment" element={<PaymentGateway />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/restaurant/dashboard"
                  element={<RestaurantDashboard />}
                />
                <Route path="/orders" element={<div>User Orders Page</div>} />
              </Route>
            </Routes>
          </div>

          {/* Only show footer on certain pages */}
          {shouldShowFooter && <Footer />}
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
