import React, { useState } from "react";
import Modal from "../Modal";
import CustomerSignup from "./CustomerSignup";
import RestaurantSignup from "./RestaurantSignup";
import LoginForm from "./LoginForm";
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
type AuthView = "login" | "customerSignup" | "restaurantSignup";
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<AuthView>("login");
  const getTitle = () => {
    switch (view) {
      case "login":
        return "Sign In";
      case "customerSignup":
        return "Create Customer Account";
      case "restaurantSignup":
        return "Register Restaurant";
      default:
        return "Authentication";
    }
  };

  const handleBackClick = () => {
    setView("login");
  };

  console.log("Current view:", view);
  console.log("Show back button?", view !== "login");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      showBackButton={view !== "login"}
      onBackClick={handleBackClick}
    >
      {view === "login" && (
        <div>
          <LoginForm onSuccess={onClose} />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => setView("customerSignup")}
                className="block w-full px-4 py-2 text-sm font-medium text-gray-600 border border-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                Sign up as Customer
              </button>
              <button
                onClick={() => setView("restaurantSignup")}
                className="block w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                Register your Restaurant
              </button>

              {/* New Admin login button */}
              <a
                href="/admin/login"
                onClick={onClose}
                className="block w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors text-center"
              >
                Sign in as Admin
              </a>
            </div>
          </div>
        </div>
      )}
      {view === "customerSignup" && (
        <div>
          <CustomerSignup />
          <div className="mt-6 text-center">
            <button
              onClick={() => setView("login")}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      )}
      {view === "restaurantSignup" && (
        <div>
          <RestaurantSignup />
          <div className="mt-6 text-center">
            <button
              onClick={() => setView("login")}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
export default AuthModal;
