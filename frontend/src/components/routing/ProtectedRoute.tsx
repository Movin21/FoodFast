import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  // Debug the authentication check
  console.log("ProtectedRoute check - Path:", location.pathname);
  console.log("ProtectedRoute check - Token exists:", !!token);

  // If no token found, redirect to login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Token exists, allow access
  console.log("ProtectedRoute - Access granted to:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
