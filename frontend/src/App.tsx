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
import DeliveryTrackingPage from "./components/DeliveryTracking";
import DriverLogin from "./components/auth/DriverLogin";
import DriverRegister from "./components/auth/DriverRegsiter";
import OrderSearch from "./components/OrderSearch";
import Header from "./components/Layout/Header";
export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Global Header for all routes */}

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
                <Route path="/order-status" element={<OrderSearch />} />
                <Route
                  path="/delivery/:orderId"
                  element={<DeliveryTrackingPage />}
                />
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route path="/driver/register" element={<DriverRegister />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Restaurant Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<RestaurantDashboardLayout />}>
                  <Route
                    path="/restaurant/dashboard"
                    element={<RestaurantDashboard />}
                  />
                </Route>
              </Route>
            </Routes>
          </div>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
