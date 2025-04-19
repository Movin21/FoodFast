import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as restaurantService from "../../services/restaurantService";

// Define types based on your backend models
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface Order {
  _id: string;
  customerName: string;
  customerContact: string;
  items: {
    menuItemId: MenuItem;
    quantity: number;
  }[];
  totalPrice: number;
  status: "pending" | "preparing" | "ready" | "out for delivery" | "cancelled";
  createdAt: string;
}

export interface Restaurant {
  _id: string;
  username: string;
  restaurantName: string;
  contactNumber: string;
  email: string;
  ratings: number;
  reviews: string[];
  profileImage: string;
  location: string;
  deliveryRange: number;
  openCloseStatus: boolean;
  openTime: string;
  closeTime: string;
}

interface RestaurantState {
  profile: Restaurant | null;
  menuItems: MenuItem[];
  orders: Order[];
  loading: {
    profile: boolean;
    menu: boolean;
    orders: boolean;
  };
  error: {
    profile: string | null;
    menu: string | null;
    orders: string | null;
  };
}

// Create async thunks for API calls
export const fetchRestaurantProfile = createAsyncThunk(
  "restaurant/fetchProfile",
  async () => {
    return await restaurantService.getRestaurantProfile();
  }
);

export const toggleOpenCloseStatus = createAsyncThunk(
  "restaurant/toggleStatus",
  async (isOpen: boolean) => {
    return await restaurantService.updateOpenCloseStatus(isOpen);
  }
);

export const fetchMenuItems = createAsyncThunk(
  "restaurant/fetchMenuItems",
  async () => {
    return await restaurantService.getMenuItems();
  }
);

export const addMenuItem = createAsyncThunk(
  "restaurant/addMenuItem",
  async (menuItem: Omit<MenuItem, "_id">) => {
    return await restaurantService.addMenuItem(menuItem);
  }
);

export const updateMenuItem = createAsyncThunk(
  "restaurant/updateMenuItem",
  async ({ id, data }: { id: string; data: Partial<MenuItem> }) => {
    return await restaurantService.updateMenuItem(id, data);
  }
);

export const deleteMenuItem = createAsyncThunk(
  "restaurant/deleteMenuItem",
  async (id: string) => {
    await restaurantService.deleteMenuItem(id);
    return id;
  }
);

// Update the fetchOrders thunk to accept a filter parameter
export const fetchOrders = createAsyncThunk(
  "restaurant/fetchOrders",
  async (filter: string = "all") => {
    return await restaurantService.getRestaurantOrders(filter);
  }
);

// Modify your updateOrderStatus thunk to include the current filter
export const updateOrderStatus = createAsyncThunk(
  "restaurant/updateOrderStatus",
  async (
    {
      id,
      status,
      currentFilter = "all",
    }: { id: string; status: string; currentFilter?: string },
    { dispatch }
  ) => {
    const response = await restaurantService.updateOrderStatus(id, status);

    // Don't refetch orders here - we'll handle that in the component
    return response;
  }
);

export const updateRestaurantProfile = createAsyncThunk(
  "restaurant/updateProfile",
  async (profileData: any) => {
    return await restaurantService.updateRestaurantProfile(profileData);
  }
);

const initialState: RestaurantState = {
  profile: null,
  menuItems: [],
  orders: [],
  loading: {
    profile: false,
    menu: false,
    orders: false,
  },
  error: {
    profile: null,
    menu: null,
    orders: null,
  },
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    clearRestaurantData: (state) => {
      state.profile = null;
      state.menuItems = [];
      state.orders = [];
      state.error = { profile: null, menu: null, orders: null };
    },
  },
  extraReducers: (builder) => {
    // Profile reducers
    builder
      .addCase(fetchRestaurantProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchRestaurantProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchRestaurantProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.error.message || "Failed to load profile";
      })
      .addCase(toggleOpenCloseStatus.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.openCloseStatus = action.payload.openCloseStatus;
        }
      })
      .addCase(updateRestaurantProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });

    // Menu reducers
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading.menu = true;
        state.error.menu = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading.menu = false;
        state.menuItems = action.payload.menuItems || [];
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading.menu = false;
        state.error.menu = action.error.message || "Failed to load menu items";
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.menuItems.push(action.payload.menuItem);
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.menuItems.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.menuItems[index] = action.payload;
        }
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.menuItems = state.menuItems.filter(
          (item) => item._id !== action.payload
        );
      });

    // Orders reducers
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.error.message || "Failed to load orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.order._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      });
  },
});

export const { clearRestaurantData } = restaurantSlice.actions;
export default restaurantSlice.reducer;
