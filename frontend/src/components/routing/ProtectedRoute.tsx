import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { isAuthenticated } from "../../services/authService";
import { logout } from "../../redux/slices/authSlice";

const ProtectedRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if token is valid
  useEffect(() => {
    if (user && !isAuthenticated()) {
      // Token expired, log the user out
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate, user]);

  // If not authenticated at all, redirect to login
  if (!user || !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
