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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
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
    
    if (isSignup) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      }
      if (!formData.address) {
        newErrors.address = "Address is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      dispatch(loginStart());
      
      try {
        // Determine the correct endpoint based on user type and action (login/signup)
        let endpoint = formData.userType === "customer" ? "auth" : "driver";
        endpoint = `${endpoint}/${isSignup ? "register" : "login"}`;
        
        // Create the request body based on whether it's signup or login
        const requestBody = isSignup 
          ? {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              address: formData.address
            }
          : {
              email: formData.email,
              password: formData.password
            };
        
        console.log(`Making request to: http://localhost:8000/api/${endpoint}`);
        
        const response = await fetch(
          `http://localhost:5001/customers/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();
        console.log("Response data:", data);
        if (!response.ok) {
          console.log("Authentication failed:", data);
          dispatch(loginFailure(data.message || "Authentication failed"));
          setErrors((prev) => ({
            ...prev,
            form: data.message || "Authentication failed"
          }));
          setIsSubmitting(false);
          return;
        }

        console.log("Authentication successful:", data);
        
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", formData.userType);
        
        if (formData.userType === "driver") {
          localStorage.setItem("driver", JSON.stringify(data.driver));
          dispatch(loginSuccess({ token: data.token, user: data.driver }));
        } else {
          // For customers, add a username field that displays their name
          const customerData = data.customer || {};
          const customerWithUsername = {
            ...customerData,
            username: `${customerData.firstName} ${customerData.lastName}`.trim()
          };
          localStorage.setItem("customer", JSON.stringify(customerWithUsername));
          dispatch(loginSuccess({ token: data.token, user: customerWithUsername }));
        }
        
        // Success callback will trigger the redirect in the useEffect
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Authentication error:", error);
        dispatch(loginFailure("Connection error. Please try again later."));
        setErrors((prev) => ({
          ...prev,
          form: "Failed to connect to the server. Please check your internet connection and try again."
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
      
      {isSignup && (
        <>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>
          
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>
        </>
      )}
      
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
        {isSubmitting ? (isSignup ? "Signing up..." : "Logging in...") : (isSignup ? "Sign Up" : "Log In")}
      </Button>
    </form>
  );
};

export default LoginForm;
