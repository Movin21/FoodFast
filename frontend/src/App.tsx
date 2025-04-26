import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkout from "./pages/Checkout";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Login from "./components/auth/LoginForm";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import PaymentGateway from "./components/PaymentGateway";

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login isSignup={true} />} />
            <Route path="/payment" element={<PaymentGateway />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
      </CartProvider>
    </BrowserRouter>
  );
}
