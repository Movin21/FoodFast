import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FullScreenAlertProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  redirectPath?: string;
  redirectDelay?: number; // In milliseconds
  onClose?: () => void;
}

const FullScreenAlert: React.FC<FullScreenAlertProps> = ({
  type = "success",
  title,
  message,
  redirectPath = "/",
  redirectDelay = 3000, // Default 3 seconds
  onClose,
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(Math.floor(redirectDelay / 1000));

  // Handle automatic redirect after delay
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    // Set up countdown timer
    countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        const newCount = prev - 1;
        return newCount >= 0 ? newCount : 0;
      });
    }, 1000);

    // Set up redirect timer
    redirectTimer = setTimeout(() => {
      if (onClose) onClose();

      // Use a direct window location change - most reliable method
      window.location.href = redirectPath;
    }, redirectDelay);

    // Cleanup function
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [redirectPath, redirectDelay, onClose]);

  // Click handler for manual navigation - use direct method
  const handleContinueClick = () => {
    if (onClose) onClose();
    window.location.href = redirectPath;
  };

  // Get icon based on alert type
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="rounded-full bg-green-100 p-4 mx-auto mb-5">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 4L12 14.01l-3-3"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="rounded-full bg-red-100 p-4 mx-auto mb-5">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
              <path
                d="M15 9l-6 6M9 9l6 6"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl text-center">
        {getIcon()}

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>

        <p className="text-gray-500 text-sm mb-5">
          Redirecting to homepage in {countdown} seconds
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleContinueClick}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            Continue Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenAlert;
