import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isTokenExpired = payload.exp * 1000 < Date.now();
    return !isTokenExpired;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
