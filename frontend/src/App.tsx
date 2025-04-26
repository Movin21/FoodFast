import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout/Layout";
import RestaurantDashboardLayout from "./components/Layout/RestaurantDashboardLayout";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkout from "./pages/Checkout";
import Login from "./components/auth/LoginForm";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
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

          {/* Restaurant Dashboard Route */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RestaurantDashboardLayout />}>
              <Route
                path="/restaurant/dashboard"
                element={<RestaurantDashboard />}
              />
            </Route>
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
