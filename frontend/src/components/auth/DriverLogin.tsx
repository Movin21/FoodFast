import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDriver } from "../../redux/slices/driverSlice";

interface DriverLoginFormProps {
  onSuccess?: () => void;
}

const DriverLogin: React.FC<DriverLoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/drivers/login`,
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

      console.log(`Driver login response status: ${response.status}`);

      const data = await response.json();

      if (!response.ok) {
        console.log("Driver login failed:", data);
        dispatch(setDriver(true));

        if (onSuccess) {
          onSuccess();
        }

        navigate("/");
        setIsLoading(false);
        return;
      }

      console.log("Driver login successful, data:", data);

      // Set isDriver to true on successful login
      dispatch({ type: "driver/setIsDriver", payload: true });

      if (onSuccess) {
        onSuccess();
      }

      navigate("/driver/dashboard");
    } catch (error) {
      console.error("Driver login error:", error);
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Driver Login</h2>

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
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 focus:ring-gray-500"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-sm text-center mt-4">
            <a
              href="/driver/register"
              className="font-medium text-black hover:text-gray-800"
            >
              Register as a driver
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;
