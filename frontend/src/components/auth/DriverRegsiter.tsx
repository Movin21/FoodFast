// DriverRegister.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DriverRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    licensePlate: "",
    bikeType: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data according to backend expectations
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        licensePlate: formData.licensePlate,
        bikeType: formData.bikeType,
        phone: formData.phone,
        available: true,
        location: { lat: 0, lng: 0 },
      };

      console.log("Sending registration data:", registrationData);

      const response = await fetch(
        `http://localhost:8000/api/auth/drivers/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
      );

      // Handle different error status codes
      if (!response.ok) {
        let errorData;

        try {
          // Try to parse the error response as JSON
          errorData = await response.json();
          console.error("Registration error:", errorData);
          setErrorMessage(
            errorData.msg || `Registration failed (${response.status})`
          );
        } catch (jsonError) {
          // If the response is not valid JSON
          console.error(
            "Non-JSON error response:",
            response.status,
            response.statusText
          );

          if (response.status === 504) {
            setErrorMessage("Server timeout. Please try again later.");
          } else {
            setErrorMessage(
              `Server error (${response.status}). Please try again later.`
            );
          }
        }

        setIsLoading(false);
        return;
      }

      // If we get here, the request was successful
      let data;
      try {
        data = await response.json();
        console.log("Registration successful:", data);

        // Store the token if provided by backend
        if (data.token) {
          localStorage.setItem("driver-token", data.token);
        }

        // Show success message before redirect
        setErrorMessage("");
        alert("Registration successful! Please log in with your credentials.");

        // Redirect to login page on successful registration
        navigate("/driver/login");
      } catch (jsonError) {
        console.log("Response not JSON but status was OK");
        // If response is not JSON but status was OK, still consider it a success
        navigate("/driver/login");
      }
    } catch (error: any) {
      console.error("Driver registration error:", error);

      // Handle network errors and aborted requests
      if (error.name === "AbortError") {
        setErrorMessage(
          "Request timed out. Please check your connection and try again."
        );
      } else if (
        error.name === "TypeError" &&
        error.message.includes("NetworkError")
      ) {
        setErrorMessage(
          "Network error. Please check if the server is running."
        );
      } else {
        setErrorMessage(
          "Error connecting to the server. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
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
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 pt-16">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register as a Driver
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="bg-red-50 p-3 rounded-md text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
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
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
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
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="licensePlate"
              className="block text-sm font-medium text-gray-700"
            >
              License Plate
            </label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="bikeType"
              className="block text-sm font-medium text-gray-700"
            >
              Bike Type
            </label>
            <select
              id="bikeType"
              name="bikeType"
              value={formData.bikeType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            >
              <option value="">Select bike type</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Scooter">Scooter</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Electric Bike">Electric Bike</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <div className="text-sm text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <a
              href="/driver/login"
              className="font-medium text-black hover:text-gray-800"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverRegister;
