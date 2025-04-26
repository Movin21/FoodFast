import React, { useState } from "react";
import Button from "../Button";
import FullScreenAlert from "../common/FullScreenAlert"; // Import the new component

const RestaurantSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    contactNumber: "",
    email: "",
    location: "",
    deliveryRange: "",
    openTime: "",
    closeTime: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFullScreenAlert, setShowFullScreenAlert] = useState(false); // Changed from showAlert

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = "Restaurant name is required";
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.deliveryRange.trim()) {
      newErrors.deliveryRange = "Delivery range is required";
    }
    if (!formData.openTime.trim()) {
      newErrors.openTime = "Opening time is required";
    }
    if (!formData.closeTime.trim()) {
      newErrors.closeTime = "Closing time is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(
          "http://localhost:8000/api/restaurant/auth/restaurantRegister/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage(data.message || "Registration successful!");
          setErrorMessage(null);
          setShowFullScreenAlert(true);
          setFormData({
            username: "",
            password: "",
            confirmPassword: "",
            restaurantName: "",
            contactNumber: "",
            email: "",
            location: "",
            deliveryRange: "",
            openTime: "",
            closeTime: "",
          });
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "An error occurred");
          setSuccessMessage(null);
        }
      } catch (error) {
        setErrorMessage("Failed to connect to the server");
        setSuccessMessage(null);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <>
      {/* Full-Screen Alert */}
      {showFullScreenAlert && successMessage && (
        <FullScreenAlert
          type="success"
          title="Restaurant Registered Successfully!"
          message={successMessage}
          redirectPath="/" // Ensure this is your actual home page route
          redirectDelay={3000}
          onClose={() => setShowFullScreenAlert(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message - keep this for form errors */}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600">{errors.username}</p>
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
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="restaurantName"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant Name
          </label>
          <input
            type="text"
            id="restaurantName"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          />
          {errors.restaurantName && (
            <p className="mt-1 text-xs text-red-600">{errors.restaurantName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          />
          {errors.contactNumber && (
            <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p>
          )}
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
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location" // Must match the key in formData
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-600">{errors.location}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="deliveryRange"
            className="block text-sm font-medium text-gray-700"
          >
            Delivery Range (km)
          </label>
          <input
            type="number"
            id="deliveryRange"
            name="deliveryRange"
            value={formData.deliveryRange}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          />
          {errors.deliveryRange && (
            <p className="mt-1 text-xs text-red-600">{errors.deliveryRange}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="openTime"
              className="block text-sm font-medium text-gray-700"
            >
              Opening Time
            </label>
            <input
              type="time"
              id="openTime"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
            {errors.openTime && (
              <p className="mt-1 text-xs text-red-600">{errors.openTime}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="closeTime"
              className="block text-sm font-medium text-gray-700"
            >
              Closing Time
            </label>
            <input
              type="time"
              id="closeTime"
              name="closeTime"
              value={formData.closeTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
            {errors.closeTime && (
              <p className="mt-1 text-xs text-red-600">{errors.closeTime}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <Button type="submit" variant="primary" className="flex-1">
            Register Restaurant
          </Button>
        </div>
      </form>
    </>
  );
};

export default RestaurantSignup;
