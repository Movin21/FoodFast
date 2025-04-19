import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUploader from "../components/ImageUploader";
import { RootState } from "../redux/store";
import {
  fetchRestaurantProfile,
  fetchMenuItems,
  fetchOrders,
  updateMenuItem,
  deleteMenuItem,
  addMenuItem,
  updateOrderStatus,
  toggleOpenCloseStatus,
  updateRestaurantProfile,
} from "../redux/slices/restaurantSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { AppDispatch } from "../redux/store";
import OrderFilter from "../components/OrderFilter";
import EmptyStateOrders from "../components/EmptyStateOrders";
import DeleteConfirmationModal from "../components//common/DeleteConfirmationModal";

// Menu Item Form Component (would be separated in production)
interface MenuItemFormProps {
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isAvailable: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// Update the MenuItemForm component to include the ImageUploader
const MenuItemForm: React.FC<MenuItemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      isAvailable: true,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "price"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData({
      ...formData,
      image: imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          name="price"
          id="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 max-h-48 overflow-y-auto"
        >
          <option value="">Select a category</option>
          <option value="popular">Popular</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="appetizer">Appetizer</option>
          <option value="main">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="spicy">Spicy</option>
          <option value="italian">Italian</option>
          <option value="chinese">Chinese</option>
          <option value="indian">Indian</option>
          <option value="mexican">Mexican</option>
          <option value="japanese">Japanese</option>
        </select>
      </div>

      {/* Replace the old image input with ImageUploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Menu Item Image
        </label>
        <ImageUploader
          onImageUpload={handleImageUpload}
          currentImage={formData.image}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isAvailable"
          id="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label
          htmlFor="isAvailable"
          className="ml-2 block text-sm text-gray-700"
        >
          Available
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md text-sm"
          disabled={formData.image === "" && !initialData?.image}
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

// Profile Edit Form Component
interface ProfileFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    restaurantName: initialData.restaurantName || "",
    email: initialData.email || "",
    contactNumber: initialData.contactNumber || "",
    location: initialData.location || "",
    openTime: initialData.openTime || "09:00",
    closeTime: initialData.closeTime || "22:00",
    deliveryRange: initialData.deliveryRange || 5,
    profileImage: initialData.profileImage || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "deliveryRange" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
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
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label
          htmlFor="contactNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
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
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
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
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
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
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
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
          min="1"
          max="50"
          value={formData.deliveryRange}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label
          htmlFor="profileImage"
          className="block text-sm font-medium text-gray-700"
        >
          Profile Image URL
        </label>
        <input
          type="text"
          id="profileImage"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md text-sm"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const RestaurantDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("dashboard"); // Changed default to dashboard
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState<string | null>(
    null
  );
  const [orderFilter, setOrderFilter] = useState("all");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  // Add this state for tracking all orders regardless of filter
  const [allOrders, setAllOrders] = useState([]);

  // Get data from Redux store
  const { profile, menuItems, orders, loading, error } = useSelector(
    (state: RootState) => state.restaurant
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch data on component mount
  useEffect(() => {
    console.log("Restaurant Dashboard mounting...");
    dispatch(fetchRestaurantProfile());
    dispatch(fetchMenuItems());

    // First fetch all orders to get complete counts
    dispatch(fetchOrders("all"))
      .unwrap()
      .then((result) => {
        setAllOrders(result.orders);

        // Then fetch the filtered orders if not "all"
        if (orderFilter !== "all") {
          dispatch(fetchOrders(orderFilter));
        }
      });

    // Refresh orders every minute
    const orderRefreshInterval = setInterval(() => {
      if (activeTab === "orders") {
        // Always update the allOrders first
        dispatch(fetchOrders("all"))
          .unwrap()
          .then((result) => {
            setAllOrders(result.orders);
            if (orderFilter !== "all") {
              dispatch(fetchOrders(orderFilter));
            }
          });
      }
    }, 60000);

    return () => {
      clearInterval(orderRefreshInterval);
    };
  }, [dispatch, activeTab]);

  // Add a separate effect for when orderFilter changes
  useEffect(() => {
    if (orderFilter !== "all") {
      dispatch(fetchOrders(orderFilter));
    }
  }, [dispatch, orderFilter]);

  // Update the handleMenuItemSubmit function
  const handleMenuItemSubmit = (data: any) => {
    console.log("Submitting menu item:", data);
    if (editingMenuItem) {
      dispatch(
        updateMenuItem({
          id: editingMenuItem._id,
          data,
        })
      )
        .then(() => {
          setEditingMenuItem(null);
          console.log("Menu item updated successfully");
        })
        .catch((err) => {
          console.error("Error updating menu item:", err);
          // Add error handling UI here
        });
    } else {
      dispatch(addMenuItem(data))
        .then((result) => {
          console.log("Menu item added successfully:", result);
          setIsAddingMenuItem(false);
        })
        .catch((err) => {
          console.error("Error adding menu item:", err);
          // Add error handling UI here
        });
    }
  };

  // Handle order status update
  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrderStatusUpdating(orderId);
    dispatch(updateOrderStatus({ id: orderId, status: newStatus })).finally(
      () => {
        setOrderStatusUpdating(null);
      }
    );
  };

  // Handle restaurant open/close toggle
  const handleOpenCloseToggle = () => {
    if (profile) {
      dispatch(toggleOpenCloseStatus(!profile.openCloseStatus));
    }
  };

  // Format timestamp to readable date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOrderFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setOrderFilter(newFilter);
    dispatch(fetchOrders(newFilter));
  };

  const handleProfileUpdate = (data: any) => {
    dispatch(updateRestaurantProfile(data))
      .then(() => {
        setIsEditingProfile(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const getOrderCountsByStatus = () => {
    const counts = {
      all: allOrders.length,
      pending: 0,
      preparing: 0,
      ready: 0,
      "out for delivery": 0,
      cancelled: 0,
    };

    allOrders.forEach((order: { status: keyof typeof counts }) => {
      if (order.status in counts) {
        counts[order.status]++;
      }
    });

    return counts;
  };

  const renderOrdersTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Orders</h2>

        {/* Add the filter component */}
        <OrderFilter
          activeFilter={orderFilter}
          onFilterChange={(newFilter) => {
            setOrderFilter(newFilter);
            // Use cached data if available for "all" orders
            if (newFilter === "all" && allOrders.length > 0) {
              // Instead of a custom action, use your existing reducer actions
              dispatch({ 
                type: fetchOrders.fulfilled.type, 
                payload: { orders: allOrders, filter: 'all' }
              });
            } else {
              // Otherwise fetch from API
              dispatch(fetchOrders(newFilter));
            }
          }}
          counts={getOrderCountsByStatus()}
        />

        {loading.orders ? (
          <LoadingSpinner />
        ) : error.orders ? (
          <div className="bg-red-50 p-4 text-red-700 rounded">
            {error.orders}
          </div>
        ) : orders.length === 0 ? (
          <EmptyStateOrders
            onRefresh={() => dispatch(fetchOrders(orderFilter))}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium">{order.customerName}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "preparing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <p className="text-sm font-medium mt-1">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="py-3 border-b">
                  <h4 className="text-sm font-medium mb-2">Order Items</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x{" "}
                          {item.menuItemId?.name || "Unknown Item"}
                        </span>
                        <span>
                          $
                          {(
                            (item.menuItemId?.price || 0) * (item.quantity || 1)
                          ).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm">
                      <strong>Contact:</strong> {order.customerContact}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={orderStatusUpdating === order._id}
                      className="text-sm border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="out for delivery">Out for Delivery</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleItemAvailabilityToggle = (
    itemId: string,
    currentStatus: boolean
  ) => {
    dispatch(
      updateMenuItem({
        id: itemId,
        data: { isAvailable: !currentStatus },
      })
    )
      .then(() => {
        console.log("Item availability updated successfully");
      })
      .catch((err) => {
        console.error("Error updating item availability:", err);
      });
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      dispatch(deleteMenuItem(itemToDelete))
        .then(() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        })
        .catch((err) => {
          console.error("Error deleting menu item:", err);
        });
    }
  };

  // Fix the getDashboardMetrics function with proper null checks
  const getDashboardMetrics = () => {
    // Calculate revenue
    const totalRevenue = orders.reduce((total, order) => {
      if (order.status !== "cancelled") {
        return total + order.totalPrice;
      }
      return total;
    }, 0);

    // Calculate order counts by status
    const orderCounts = {
      total: orders.length,
      pending: 0,
      preparing: 0,
      ready: 0,
      outForDelivery: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (order && order.status) {
        switch (order.status) {
          case "pending":
            orderCounts.pending++;
            break;
          case "preparing":
            orderCounts.preparing++;
            break;
          case "ready":
            orderCounts.ready++;
            break;
          case "out for delivery":
            orderCounts.outForDelivery++;
            break;
          case "cancelled":
            orderCounts.cancelled++;
            break;
        }
      }
    });

    // Calculate popular menu items with proper null checking
    const menuItemCounts: Record<
      string,
      { name: string; count: number; revenue: number }
    > = {};
    orders.forEach((order) => {
      if (order && order.status !== "cancelled" && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          // Add null checks to prevent the error
          if (item && item.menuItemId) {
            // Make sure menuItemId is an object with an _id property
            const itemId =
              typeof item.menuItemId === "object" && item.menuItemId?._id
                ? item.menuItemId._id
                : item.menuItemId || "unknown";

            const itemName =
              typeof item.menuItemId === "object" && item.menuItemId?.name
                ? item.menuItemId.name
                : "Unknown Item";

            const itemPrice =
              typeof item.menuItemId === "object" && item.menuItemId?.price
                ? item.menuItemId.price
                : 0;

            menuItemCounts[String(itemId)] = menuItemCounts[String(itemId)] || {
              name: itemName,
              count: 0,
              revenue: 0,
            };

            menuItemCounts[String(itemId)].count += item.quantity || 1;
            menuItemCounts[String(itemId)].revenue +=
              (item.quantity || 1) * itemPrice;
          }
        });
      }
    });

    // Get top menu items by sales
    const topItems = Object.values(menuItemCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue,
      orderCounts,
      topItems,
    };
  };

  // New Dashboard Overview Tab
  const renderDashboardTab = () => {
    const metrics = getDashboardMetrics();

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Dashboard Overview
        </h2>

        {loading.orders || loading.profile ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Restaurant Status Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile?.restaurantName || "Your Restaurant"}
                  </h3>
                  <p className="text-gray-600">
                    {profile?.location || "Location not set"}
                  </p>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      profile?.openCloseStatus ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium text-gray-700">
                    {profile?.openCloseStatus ? "Open" : "Closed"}
                  </span>
                  <button
                    onClick={handleOpenCloseToggle}
                    className="ml-4 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                  >
                    {profile?.openCloseStatus ? "Close Now" : "Open Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Revenue
                    </p>
                    <p className="text-xl font-semibold">
                      ${metrics.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Orders */}
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Orders
                    </p>
                    <p className="text-xl font-semibold">
                      {metrics.orderCounts.total}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Orders */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 mr-4">
                    <svg
                      className="w-6 h-6 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Active Orders
                    </p>
                    <p className="text-xl font-semibold">
                      {metrics.orderCounts.pending +
                        metrics.orderCounts.preparing +
                        metrics.orderCounts.ready}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <svg
                      className="w-6 h-6 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Menu Items
                    </p>
                    <p className="text-xl font-semibold">{menuItems.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders by Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Orders by Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                      <span className="text-sm">Pending</span>
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium">
                        {metrics.orderCounts.pending}
                      </span>
                      <div className="ml-3 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${
                              metrics.orderCounts.total
                                ? (metrics.orderCounts.pending /
                                    metrics.orderCounts.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      <span className="text-sm">Preparing</span>
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium">
                        {metrics.orderCounts.preparing}
                      </span>
                      <div className="ml-3 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              metrics.orderCounts.total
                                ? (metrics.orderCounts.preparing /
                                    metrics.orderCounts.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm">Ready</span>
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium">
                        {metrics.orderCounts.ready}
                      </span>
                      <div className="ml-3 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              metrics.orderCounts.total
                                ? (metrics.orderCounts.ready /
                                    metrics.orderCounts.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                      <span className="text-sm">Out for Delivery</span>
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium">
                        {metrics.orderCounts.outForDelivery}
                      </span>
                      <div className="ml-3 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${
                              metrics.orderCounts.total
                                ? (metrics.orderCounts.outForDelivery /
                                    metrics.orderCounts.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-sm">Cancelled</span>
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium">
                        {metrics.orderCounts.cancelled}
                      </span>
                      <div className="ml-3 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${
                              metrics.orderCounts.total
                                ? (metrics.orderCounts.cancelled /
                                    metrics.orderCounts.total) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Top Selling Items</h3>
                {metrics.topItems.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.topItems.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.count} orders
                          </p>
                        </div>
                        <p className="text-green-600 font-medium">
                          ${item.revenue.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>No sales data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                {orders.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customerName || "Unknown Customer"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerContact || "No contact info"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.createdAt
                                ? formatDate(order.createdAt)
                                : "Unknown date"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              $
                              {order.totalPrice
                                ? order.totalPrice.toFixed(2)
                                : "0.00"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items?.length || 0} items
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "preparing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "ready"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setActiveTab("orders")}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
                >
                  View all orders →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardTab();
      case "orders":
        return renderOrdersTab();
      case "menu":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Menu Management</h2>
              {!isAddingMenuItem && !editingMenuItem && (
                <button
                  onClick={() => setIsAddingMenuItem(true)}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm"
                >
                  Add New Item
                </button>
              )}
            </div>

            {isAddingMenuItem || editingMenuItem ? (
              <div className="bg-white p-6 rounded-lg border mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {editingMenuItem ? "Edit Menu Item" : "Add Menu Item"}
                </h3>
                <MenuItemForm
                  initialData={editingMenuItem}
                  onSubmit={handleMenuItemSubmit}
                  onCancel={() => {
                    setIsAddingMenuItem(false);
                    setEditingMenuItem(null);
                  }}
                />
              </div>
            ) : null}

            {loading.menu ? (
              <LoadingSpinner />
            ) : error.menu ? (
              <div className="bg-red-50 p-4 text-red-700 rounded">
                {error.menu}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Available
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No menu items found. Add your first item!
                        </td>
                      </tr>
                    ) : (
                      menuItems.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* Item cell content */}
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                {item.image ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={item.image}
                                    alt={item.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <svg
                                      className="h-6 w-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${item.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.isAvailable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.isAvailable ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() =>
                                handleItemAvailabilityToggle(
                                  item._id,
                                  item.isAvailable
                                )
                              }
                              className="relative inline-flex items-center cursor-pointer focus:outline-none mx-auto"
                              aria-pressed={item.isAvailable}
                              role="switch"
                            >
                              <div
                                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                                  item.isAvailable
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                                    item.isAvailable ? "translate-x-5" : ""
                                  }`}
                                ></div>
                              </div>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditingMenuItem(item)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setItemToDelete(item._id);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={handleDeleteConfirm}
              title="Delete Menu Item"
              message="Do you really want to delete this menu item? This action cannot be undone."
            />
          </div>
        );

      case "profile":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Restaurant Profile</h2>
            {loading.profile ? (
              <LoadingSpinner />
            ) : error.profile ? (
              <div className="bg-red-50 p-4 text-red-700 rounded">
                {error.profile}
              </div>
            ) : profile ? (
              isEditingProfile ? (
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Edit Restaurant Profile
                  </h3>
                  <ProfileEditForm
                    initialData={profile}
                    onSubmit={handleProfileUpdate}
                    onCancel={() => setIsEditingProfile(false)}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      {/* Left side: Profile image and info */}
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                          {profile.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt={profile.restaurantName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {profile.restaurantName}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600 mr-3">
                              {profile.location}
                            </span>
                            <div className="flex items-center">
                              <span className="text-sm mr-1">Rating:</span>
                              <span className="text-sm font-medium">
                                {profile.ratings} ★
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Status indicator (moved from below) */}
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-4 h-4 rounded-full mr-2 ${
                            profile.openCloseStatus
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-sm font-medium">
                          {profile.openCloseStatus ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>

                    {/* 2. Now put the toggle in the Restaurant Status section */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Restaurant Status</h4>

                        {/* Toggle switch moved here */}
                        <button
                          onClick={handleOpenCloseToggle}
                          className="relative inline-flex items-center cursor-pointer focus:outline-none"
                          aria-pressed={profile.openCloseStatus}
                          role="switch"
                        >
                          <div
                            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                              profile.openCloseStatus
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                                profile.openCloseStatus ? "translate-x-7" : ""
                              }`}
                            ></div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Rest of your profile sections remain the same */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                      <div>
                        <h4 className="text-sm text-gray-500">
                          Contact Information
                        </h4>
                        <dl className="mt-2 space-y-2">
                          <div>
                            <dt className="text-sm font-medium">Email</dt>
                            <dd>{profile.email}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium">Phone</dt>
                            <dd>{profile.contactNumber}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 className="text-sm text-gray-500">
                          Business Hours
                        </h4>
                        <dl className="mt-2 space-y-2">
                          <div>
                            <dt className="text-sm font-medium">
                              Opening Time
                            </dt>
                            <dd>{profile.openTime}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium">
                              Closing Time
                            </dt>
                            <dd>{profile.closeTime}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium mb-4">
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium">
                            Delivery Range
                          </h5>
                          <p>{profile.deliveryRange} km</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-end">
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-black text-white px-4 py-2 rounded-md text-sm"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <p className="text-gray-500">No profile information available.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Improved UI with icons in the sidebar navigation
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - fixed with no scrolling */}
      <div className="w-64 border-r bg-white h-screen flex-shrink-0">
        <div className="px-6 pt-6 mb-6">
          <h2 className="font-semibold text-xl">Restaurant Dashboard</h2>
          <p className="text-sm text-gray-600">
            {user?.restaurantName || "Loading..."}
          </p>
        </div>

        <nav>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full px-6 py-3 text-left flex items-center ${
                  activeTab === "dashboard"
                    ? "bg-gray-100 font-medium border-r-4 border-black" // Changed from border-l-4 to border-r-4
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full px-6 py-3 text-left flex items-center ${
                  activeTab === "orders"
                    ? "bg-gray-100 font-medium border-r-4 border-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("menu")}
                className={`w-full px-6 py-3 text-left flex items-center ${
                  activeTab === "menu"
                    ? "bg-gray-100 font-medium border-r-4 border-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Menu
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full px-6 py-3 text-left flex items-center ${
                  activeTab === "profile"
                    ? "bg-gray-100 font-medium border-r-4 border-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                Profile
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content - ONLY element with scrolling */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
