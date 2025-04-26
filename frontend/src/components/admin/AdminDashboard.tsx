import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [restaurantToTerminate, setRestaurantToTerminate] = useState<
    string | null
  >(null);

  interface Restaurant {
    _id: string;
    restaurantName: string;
    location: string;
    email: string;
    contactNumber: string;
    isApproved: boolean;
  }

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [unapprovedRestaurants, setUnapprovedRestaurants] = useState<
    Restaurant[]
  >([]);
  const navigate = useNavigate();

  // Hardcoded admin data
  const users = [
    { id: 1, username: "john_doe", email: "john@example.com" },
    { id: 2, username: "jane_doe", email: "jane@example.com" },
  ];

  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const response = await fetch(
          "http://localhost:8000/api/restaurant/admin/restaurants",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid
          alert("Session expired. Please log in again.");
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
          setRestaurantCount(data.length); // Set the restaurant count
        } else {
          console.error("Failed to fetch restaurants");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, [navigate]);

  // Fetch unapproved restaurants
  useEffect(() => {
    if (activeTab === "unapprovedRestaurants") {
      const fetchUnapprovedRestaurants = async () => {
        const token = localStorage.getItem("adminToken");
        try {
          const response = await fetch(
            "http://localhost:8000/api/restaurant/admin/restaurants/unapproved",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 401 || response.status === 403) {
            // Token expired or invalid
            alert("Session expired. Please log in again.");
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setUnapprovedRestaurants(data);
          } else {
            console.error("Failed to fetch unapproved restaurants");
          }
        } catch (error) {
          console.error("Error fetching unapproved restaurants:", error);
        }
      };

      fetchUnapprovedRestaurants();
    }
  }, [activeTab, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const approveRestaurant = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `http://localhost:8000/api/restaurant/admin/restaurants/${id}/approve`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Restaurant approved successfully.");
        setUnapprovedRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== id)
        );
      } else {
        alert("Failed to approve restaurant.");
      }
    } catch (error) {
      console.error("Error approving restaurant:", error);
    }
  };

  const terminateRestaurant = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `http://localhost:8000/api/restaurant/admin/restaurants/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Restaurant terminated successfully.");
        setRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== id)
        );
        setRestaurantCount((prev) => prev - 1); // Update the restaurant count
      } else {
        alert("Failed to terminate restaurant.");
      }
    } catch (error) {
      console.error("Error terminating restaurant:", error);
    }
  };

  const openTerminateModal = (id: string) => {
    setRestaurantToTerminate(id);
    setIsTerminateModalOpen(true);
  };

  const closeTerminateModal = () => {
    setIsTerminateModalOpen(false);
    setRestaurantToTerminate(null);
  };

  const confirmTerminate = () => {
    if (restaurantToTerminate) {
      terminateRestaurant(restaurantToTerminate);
    }
    closeTerminateModal();
  };

  const renderDashboardTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Admin Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-xl font-semibold">{users.length}</p>
            </div>
          </div>
        </div>

        {/* Total Restaurants */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m0 18l-6-6m6 6l6-6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Restaurants
              </p>
              <p className="text-xl font-semibold">{restaurantCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Users</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRestaurantsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Restaurants</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Restaurant Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Approval Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {restaurant.restaurantName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {restaurant.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-medium ${
                      restaurant.isApproved ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {restaurant.isApproved ? "Approved" : "Pending Approval"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openTerminateModal(restaurant._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                  >
                    Terminate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terminate Confirmation Modal */}
      {isTerminateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Termination
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to terminate this restaurant? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeTerminateModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmTerminate}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUnapprovedRestaurantsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Unapproved Restaurants</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurant Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {unapprovedRestaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {restaurant.restaurantName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {restaurant.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {restaurant.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {restaurant.contactNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => approveRestaurant(restaurant._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardTab();
      case "users":
        return renderUsersTab();
      case "restaurants":
        return renderRestaurantsTab();
      case "unapprovedRestaurants":
        return renderUnapprovedRestaurantsTab();
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white h-screen flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="px-6 pt-6 mb-6">
            <h2 className="font-semibold text-xl">Admin Dashboard</h2>
          </div>
          <nav>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "dashboard"
                      ? "bg-gray-100 font-medium border-r-4 border-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "users"
                      ? "bg-gray-100 font-medium border-r-4 border-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("restaurants")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "restaurants"
                      ? "bg-gray-100 font-medium border-r-4 border-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Restaurants
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("unapprovedRestaurants")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "unapprovedRestaurants"
                      ? "bg-gray-100 font-medium border-r-4 border-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Unapproved Restaurants
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
