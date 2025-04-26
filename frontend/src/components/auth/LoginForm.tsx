import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";

interface LoginFormProps {
  onSuccess?: () => void;
  isSignup?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  isSignup = false,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isRestaurant: false, // Add toggle for restaurant/user login
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Determine which endpoint to call based on user type
    const endpoint = formData.isRestaurant ? "restaurantLogin" : "login";

    try {
      const response = await fetch(
        `http://localhost:8000/api/restaurant/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        }
      );

      console.log(`Login response status: ${response.status}`);

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

      // Redirect based on user type
      if (formData.isRestaurant) {
        console.log("Redirecting to restaurant dashboard");
        navigate("/restaurant/dashboard");
      } else {
        console.log("Redirecting to home page");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 p-3 rounded-md text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
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
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRestaurant"
          name="isRestaurant"
          checked={formData.isRestaurant}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 focus:ring-gray-500"
        />
        <label
          htmlFor="isRestaurant"
          className="ml-2 block text-sm text-gray-700"
        >
          Sign in as Restaurant
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
