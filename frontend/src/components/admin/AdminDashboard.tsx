import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import these at the top of your file
// You'll need to install these packages:
// npm install recharts react-icons
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  FiUsers,
  FiShoppingBag,
  FiTruck,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiCheck,
  FiClock,
} from "react-icons/fi";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [restaurantToTerminate, setRestaurantToTerminate] = useState<
    string | null
  >(null);
  const [isTerminateUserModalOpen, setIsTerminateUserModalOpen] =
    useState(false);
  const [userToTerminate, setUserToTerminate] = useState<string | null>(null);
  const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] =
    useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  interface User {
    id: number;
    username: string;
    email: string;
    status: string;
  }

  interface Restaurant {
    _id: string;
    restaurantName: string;
    location: string;
    email: string;
    contactNumber: string;
    isApproved: boolean;
  }

  // Add Driver interface
  interface Driver {
    _id: string;
    name: string;
    email: string;
    phone: string;
    licensePlate: string;
    bikeType: string;
    available: boolean;
    location: {
      lat: number;
      lng: number;
    };
  }

  // Add Transaction interface
  interface Transaction {
    _id: string;
    orderId: string;
    amount: number;
    paymentStatus: string;
    paymentIntentId: string;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerEmail: string;
    restaurantName: string;
    restaurantAddress: string;
    createdAt: string;
    updatedAt: string;
  }

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "yasas",
      email: "yasas@example.com",

      status: "Active",
    },
    {
      id: 2,
      username: "william",
      email: "william@example.com",

      status: "Active",
    },
    {
      id: 3,
      username: "mike_smith",
      email: "mike@example.com",

      status: "Inactive",
    },
    {
      id: 4,
      username: "susan_lee",
      email: "susan@example.com",

      status: "Active",
    },
  ]);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [unapprovedRestaurants, setUnapprovedRestaurants] = useState<
    Restaurant[]
  >([]);
  // Add states for drivers and transactions
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  // Add these new state variables for enhanced metrics
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState({ percentage: 12, trend: "up" });
  const [restaurantGrowth, setRestaurantGrowth] = useState({
    percentage: 8,
    trend: "up",
  });

  // Add state for selected timeframe
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(7);

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

  // Add useEffect to fetch drivers
  useEffect(() => {
    if (activeTab === "drivers" || activeTab === "dashboard") {
      const fetchDrivers = async () => {
        const token = localStorage.getItem("adminToken");
        try {
          const response = await fetch(
            "http://localhost:8000/api/auth/drivers",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 401 || response.status === 403) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setDrivers(data);
          } else {
            console.error("Failed to fetch drivers");
          }
        } catch (error) {
          console.error("Error fetching drivers:", error);
        }
      };

      fetchDrivers();
    }
  }, [activeTab, navigate]);

  // Add useEffect to fetch transactions
  useEffect(() => {
    if (activeTab === "transactions" || activeTab === "dashboard") {
      const fetchTransactions = async () => {
        const token = localStorage.getItem("adminToken");
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

          const response = await fetch(
            "http://localhost:8000/api/payment/transactions",
            {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);
          if (response.status === 401 || response.status === 403) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
            return;
          }

          // In your fetch transactions function
          if (response.ok) {
            const responseData = await response.json();

            // Check actual structure
            if (responseData.data && Array.isArray(responseData.data)) {
              const firstItem = responseData.data[0];
              if (firstItem) {
              }

              // Extract transactions from the nested data structure
              const transactionsArray = responseData.data || [];
              setTransactions(transactionsArray);
            }
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
          if (
            typeof error === "object" &&
            error !== null &&
            "name" in error &&
            (error as { name?: string }).name === "AbortError"
          ) {
            console.error("Request timed out");
          }
        }
      };

      fetchTransactions();
    }
  }, [activeTab, navigate]);

  // Function to handle timeframe changes
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(parseInt(value));
  };

  // Add effect to calculate total revenue and prepare chart data
  useEffect(() => {
    if (transactions.length > 0) {
      console.log("Raw transactions:", transactions);

      // Calculate commission correctly based on transaction amounts
      const revenue = transactions.reduce((total, transaction) => {
        // Include completed, succeeded, and pending transactions
        const status = transaction.paymentStatus?.toLowerCase();

        // Check for valid statuses
        if (
          status === "completed" ||
          status === "succeeded" ||
          status === "pending"
        ) {
          // Get raw amount value without dividing by 100 (amounts are already in dollars)
          const amount = Number(transaction.amount);
          if (!isNaN(amount)) {
            // Calculate 10% commission
            const commission = amount * 0.1;
            console.log(
              `Transaction ${
                transaction._id
              }: Amount=${amount}, Commission=${commission.toFixed(2)}`
            );
            return total + commission;
          }
        }
        return total;
      }, 0);

      console.log("Total calculated commission:", revenue.toFixed(2));
      setTotalRevenue(revenue);

      // Rest of your code remains the same

      // Process payment status data for pie chart
      const statusCounts = transactions.reduce((acc, transaction) => {
        const status = transaction.paymentStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const pieData = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));
      setPaymentStatusData(pieData);

      // Prepare sales data based on selected timeframe
      const days = selectedTimeframe;
      const daysArray = [...Array(days)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return date.toISOString().split("T")[0];
      });

      // Since we've removed the 90-day option, we can simplify this to just handle
      // the daily view for all supported timeframes (7, 14, 30 days)
      const salesData = daysArray.map((day) => {
        const dayTransactions = transactions.filter((t) => {
          const status = t.paymentStatus?.toLowerCase();
          return (
            t.createdAt.split("T")[0] === day &&
            (status === "completed" ||
              status === "succeeded" ||
              status === "pending")
          );
        });

        // Calculate total order value
        const totalOrderValue = dayTransactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

        // Calculate commission
        const commission = totalOrderValue * 0.1;

        const label = new Date(day).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });

        return {
          name: label,
          orderAmount: totalOrderValue,
          commission: commission,
        };
      });

      setSalesData(salesData);
    }
  }, [transactions, selectedTimeframe]); // Add selectedTimeframe as dependency

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
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

  const terminateUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    alert("User terminated successfully.");
  };

  const openTerminateUserModal = (id: number) => {
    setUserToTerminate(id.toString());
    setIsTerminateUserModalOpen(true);
  };

  const closeTerminateUserModal = () => {
    setIsTerminateUserModalOpen(false);
    setUserToTerminate(null);
  };

  const confirmTerminateUser = () => {
    if (userToTerminate) {
      terminateUser(parseInt(userToTerminate));
    }
    closeTerminateUserModal();
  };

  // Add function to delete transaction
  const deleteTransaction = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `http://localhost:8000/api/payment/transactions/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Transaction deleted successfully.");
        setTransactions((prev) =>
          prev.filter((transaction) => transaction._id !== id)
        );
      } else {
        alert("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const openDeleteTransactionModal = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteTransactionModalOpen(true);
  };

  const closeDeleteTransactionModal = () => {
    setIsDeleteTransactionModalOpen(false);
    setTransactionToDelete(null);
  };

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
    }
    closeDeleteTransactionModal();
  };

  // Update renderDashboardTab with the enhanced UI
  const renderDashboardTab = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </span>
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-50">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Platform Commission
                </span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  $
                  {typeof totalRevenue === "number"
                    ? totalRevenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  (10% of completed orders)
                </span>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <FiDollarSign className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span
                className={`flex items-center text-sm ${
                  userGrowth.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {userGrowth.trend === "up" ? (
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 mr-1" />
                )}
                {userGrowth.percentage}%
              </span>
              <span className="ml-2 text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Users
                </span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {users.length}
                </span>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span
                className={`flex items-center text-sm ${
                  userGrowth.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {userGrowth.trend === "up" ? (
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 mr-1" />
                )}
                {userGrowth.percentage}%
              </span>
              <span className="ml-2 text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Restaurants */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Restaurants
                </span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {restaurantCount}
                </span>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <FiShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span
                className={`flex items-center text-sm ${
                  restaurantGrowth.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {restaurantGrowth.trend === "up" ? (
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 mr-1" />
                )}
                {restaurantGrowth.percentage}%
              </span>
              <span className="ml-2 text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Drivers */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Active Drivers
                </span>
                <span className="text-2xl font-bold text-gray-900 mt-1">
                  {drivers.filter((driver) => driver.available).length}/
                  {drivers.length}
                </span>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <FiTruck className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 justify-between">
              <div>
                <span className="flex items-center text-sm text-green-600">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                  Online
                </span>
              </div>
              <div>
                <span className="flex items-center text-sm text-red-600">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                  Offline
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedTimeframe <= 7
                ? "Weekly"
                : selectedTimeframe <= 30
                ? "Monthly"
                : "Quarterly"}{" "}
              Sales
            </h3>
            <div className="flex items-center space-x-2">
              <select
                className="text-sm border rounded-md px-2 py-1 bg-white text-gray-700"
                onChange={(e) => handleTimeframeChange(e.target.value)}
                defaultValue="7"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) =>
                    `$${value.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}`
                  }
                />
                <Tooltip
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                    name === "orderAmount"
                      ? "Total Transaction Amount"
                      : "Platform Commission",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orderAmount"
                  stroke="#8884d8" // This is the purple line
                  name="Total Transaction Amount" // Changed from "Total Orders"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="commission"
                  stroke="#82ca9d"
                  name="Platform Commission"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Chart with fixed dimensions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Payment Status
          </h3>
          <div className="h-72 flex flex-col items-center justify-center">
            {" "}
            {/* Increased height */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={{
                    stroke: "#999",
                    strokeWidth: 1,
                    strokeDasharray: "2 2",
                  }}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    index,
                    name,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    // Force "pending" label to appear at the top
                    let labelMidAngle = midAngle;
                    if (name.toLowerCase() === "pending") {
                      labelMidAngle = 270; // 270 degrees positions at top (0 is right, 90 is bottom, 180 is left)
                    }

                    // Position labels further from the pie
                    const radius = outerRadius * 1.4;
                    const x = cx + radius * Math.cos(-labelMidAngle * RADIAN);
                    const y = cy + radius * Math.sin(-labelMidAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#333"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize="12px"
                        fontWeight={
                          name.toLowerCase() === "pending" ? "bold" : "normal"
                        }
                      >
                        {`${name}: ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  <Cell key="completed" fill="#4ade80" />
                  <Cell key="pending" fill="#facc15" />
                  <Cell key="failed" fill="#f87171" />
                  <Cell key="cancelled" fill="#94a3b8" />
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} transactions`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-3 mt-4">
            {" "}
            {/* Made legend wrap and added gap */}
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-1"></span>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></span>
              <span className="text-xs text-gray-600">Pending</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-400 rounded-full mr-1"></span>
              <span className="text-xs text-gray-600">Failed</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
              <span className="text-xs text-gray-600">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h3>
            <button
              onClick={() => setActiveTab("transactions")}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(Array.isArray(transactions)
                ? transactions.slice(0, 5)
                : []
              ).map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.orderId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.customerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {transaction.restaurantName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${transaction.amount / 100}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        transaction.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {(!Array.isArray(transactions) || transactions.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
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

                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-medium ${
                      user.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {user.status}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openTerminateUserModal(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Terminate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terminate User Confirmation Modal */}
      {isTerminateUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Termination
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to terminate this user? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeTerminateUserModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmTerminateUser}
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

  // Add new drivers tab
  const renderDriversTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Drivers</h2>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License Plate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {driver.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{driver.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{driver.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {driver.licensePlate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{driver.bikeType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      driver.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {driver.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600 mr-2">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Add new transactions tab
  const renderTransactionsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Transaction History</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.orderId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {transaction.customerName}
                    <div className="text-xs text-gray-400">
                      {transaction.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {transaction.restaurantName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    ${transaction.amount / 100}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      transaction.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openDeleteTransactionModal(transaction._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Transaction Confirmation Modal */}
      {isDeleteTransactionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete Transaction
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteTransactionModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTransaction}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
      case "drivers":
        return renderDriversTab();
      case "transactions":
        return renderTransactionsTab();
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white h-screen flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="px-6 pt-6 mb-6 flex items-center">
            <svg
              className="w-8 h-8 mr-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h2 className="font-bold text-xl text-gray-800">FoodFast Admin</h2>
          </div>
          <nav>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "dashboard"
                      ? "bg-gray-50 text-gray-700 font-medium border-r-4 border-gray-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "users"
                      ? "bg-gray-50 text-gray-700 font-medium border-r-4 border-gray-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("restaurants")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "restaurants"
                      ? "bg-gray-50 text-gray-700 font-medium border-r-4 border-gray-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Restaurants
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("unapprovedRestaurants")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "unapprovedRestaurants"
                      ? "bg-gray-50 text-gray-700 font-medium border-r-4 border-gray-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pending Approval
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("drivers")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "drivers"
                      ? "bg-gray-50 text-gray-700 font-medium border-r-4 border-gray-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h.01M16 7h.01M12 13h.01M12 17h.01M12 9h.01M13 17h5a2 2 0 002-2V9a2 2 0 00-2-2h-5m-1 0H6a2 2 0 00-2 2v6a2 2 0 002 2h5m0-4v4m0 0h2"
                    />
                  </svg>
                  Drivers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`w-full px-6 py-3 text-left flex items-center ${
                    activeTab === "transactions"
                      ? "bg-gray-50 text-gray-700 font-medium border-r-4 border-gray-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Transactions
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 bg-gray-100 min-h-screen">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
