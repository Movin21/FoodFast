import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import AuthModal from "../auth/AuthModal";
import {
  ShoppingBagIcon,
  MenuIcon,
  UserIcon,
  MapPinIcon,
  SearchIcon,
  XIcon,
  LogOutIcon,
} from "lucide-react";

const Header: React.FC = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Authentication state
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Get initials for avatar
  const getInitials = (): string => {
    if (!user) return "";

    if (user.restaurantName) {
      const words = user.restaurantName.split(" ");
      return words.map((word) => word[0]?.toUpperCase() || "").join("");
    }

    return user.username.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-600">FoodFast</span>
            </Link>

            {/* Location - hide for restaurant users */}
            {(!isAuthenticated || !user?.restaurantName) && (
              <div className="hidden md:flex items-center space-x-2 text-gray-700 cursor-pointer">
                <MapPinIcon size={20} />
                <span className="text-sm">Deliver to: 123 Main St</span>
              </div>
            )}

            {/* Search - hide for restaurant users */}
            {(!isAuthenticated || !user?.restaurantName) && (
              <div className="hidden md:flex flex-1 max-w-md mx-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for food, restaurants..."
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <SearchIcon
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                </div>
              </div>
            )}

            <nav className="hidden md:flex items-center space-x-6">
              {/* Cart - hide for restaurant users */}
              {(!isAuthenticated || !user?.restaurantName) && (
                <Link to="/checkout" className="relative">
                  <ShoppingBagIcon size={24} className="text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* User menu - different for authenticated vs non-authenticated */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center">
                      {getInitials()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.restaurantName || user?.username}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {user?.restaurantName ? (
                        <Link
                          to="/restaurant/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOutIcon size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-1 text-gray-700 cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <UserIcon size={24} />
                  <span className="text-sm font-medium">Sign in</span>
                </button>
              )}
            </nav>

            {/* Mobile navigation */}
            <div className="flex md:hidden items-center space-x-4">
              {(!isAuthenticated || !user?.restaurantName) && (
                <Link to="/checkout" className="relative">
                  <ShoppingBagIcon size={24} className="text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated && (
                <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center">
                  {getInitials()}
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-3 border-t border-gray-200">
              {(!isAuthenticated || !user?.restaurantName) && (
                <>
                  <div className="flex items-center space-x-2 text-gray-700 mb-4">
                    <MapPinIcon size={20} />
                    <span className="text-sm">Deliver to: 123 Main St</span>
                  </div>
                  <div className="relative w-full mb-4">
                    <input
                      type="text"
                      placeholder="Search for food, restaurants..."
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <SearchIcon
                      size={18}
                      className="absolute left-3 top-2.5 text-gray-400"
                    />
                  </div>
                </>
              )}

              {isAuthenticated ? (
                <div className="space-y-2">
                  {user?.restaurantName ? (
                    <Link
                      to="/restaurant/dashboard"
                      className="flex items-center space-x-2 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/orders"
                      className="flex items-center space-x-2 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">My Orders</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <LogOutIcon size={20} />
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 cursor-pointer"
                >
                  <UserIcon size={20} />
                  <span className="text-sm font-medium">Sign in</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Auth modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
