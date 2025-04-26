import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import Button from "../Button";

interface LoginFormProps {
  onSuccess?: () => void;
  isSignup?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  isSignup = false,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer", // Default to customer
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Immediate redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // First call onSuccess to close the modal
      if (onSuccess) {
        onSuccess();
      }

      // Redirect based on user type
      if (user?.restaurantName) {
        console.log("Redirecting to restaurant dashboard");
        navigate("/restaurant/dashboard");
      } else {
        console.log("Redirecting to home page");
        navigate("/"); // Regular users go to homepage
      }
    }
  }, [isAuthenticated, navigate, onSuccess, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/restaurant/auth/${endpoint}`,
        {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

      if (!response.ok) {
        console.log("Login failed:", data);

        // Handle admin approval needed error
        if (
          response.status === 403 &&
          data.message === "Admin approval needed."
        ) {
          setErrorMessage(
            "Your account is pending admin approval. Please wait for approval."
          );
        } else {
          setErrorMessage(data.message || "Login failed");
        }

        setIsLoading(false);
        return;
      }

      console.log("Login successful, data:", data);

      // Store token
      localStorage.setItem("token", data.token);

      // Dispatch login success with the correct user data
      dispatch(
        loginSuccess({
          token: data.token,
          user: formData.isRestaurant ? data.restaurant : data.user,
        })
      );

      // Call onSuccess callback (e.g., to close modal)
      if (onSuccess) {
        onSuccess();
      }


        console.log("Login successful:", data);
        
        // Store token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", formData.userType);
        
        if (formData.userType === "driver") {
          localStorage.setItem("driver", JSON.stringify(data.driver));
        } else {
          localStorage.setItem("customer", JSON.stringify(data.customer));
        }
        
        // Redirect based on user type
        window.location.href = formData.userType === "driver" 
          ? "/driver-dashboard" 
          : "/";
      } catch (error) {
        console.error("Login error:", error);
        setErrors((prev) => ({
          ...prev,
          form: error instanceof Error ? error.message : "Login failed",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="userType"
          className="block text-sm font-medium text-gray-700"
        >
          I am a
        </label>
        <select
          id="userType"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        >
          <option value="customer">Customer</option>
          <option value="driver">Delivery Driver</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password}</p>
        )}
      </div>
      {errors.form && (
        <div className="rounded-md bg-red-50 p-2">
          <p className="text-sm text-red-700">{errors.form}</p>
        </div>
      )}
      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
};

export default LoginForm;
