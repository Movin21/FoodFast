import { getAuthToken, removeAuthToken } from "./authService";

const API_URL = "http://localhost:8000/api/restaurant";

// Helper function for API calls with authentication
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });

    // Debug information
    console.log(`API call to ${endpoint}, status: ${response.status}`);

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      // Token is invalid or expired - remove it
      removeAuthToken();
      throw new Error("Your session has expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Restaurant profile services
export const getRestaurantProfile = () => {
  return fetchWithAuth("/restaurant/profile");
};

export const updateRestaurantProfile = (data: any) => {
  return fetchWithAuth("/restaurant/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Restaurant status service
export const updateOpenCloseStatus = (isOpen: boolean) => {
  return fetchWithAuth("/restaurant/status", {
    method: "PUT",
    body: JSON.stringify({ openCloseStatus: isOpen }),
  });
};

// Menu item services
export const getMenuItems = () => {
  return fetchWithAuth("/restaurant/menu");
};

export const addMenuItem = (data: any) => {
  return fetchWithAuth("/restaurant/menu", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateMenuItem = (id: string, data: any) => {
  return fetchWithAuth(`/restaurant/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMenuItem = (id: string) => {
  return fetchWithAuth(`/restaurant/menu/${id}`, {
    method: "DELETE",
  });
};

// Order services
export const getRestaurantOrders = (filter: string = "all") => {
  return fetchWithAuth(`/order?filter=${filter}`);
};

export const updateOrderStatus = (id: string, status: string) => {
  return fetchWithAuth(`/order/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};
