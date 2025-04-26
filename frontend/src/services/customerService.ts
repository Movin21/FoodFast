import axios from "axios";

// Base API URL - replace with your actual API URL when ready
const API_BASE_URL = "http://localhost:5001/api";

// Helper function for making authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // Create headers with auth token if available
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    // For test purposes, use axios instead of fetch to handle responses more easily
    const response = await axios(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      data: options.body ? JSON.parse(options.body.toString()) : undefined,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }

    // Handle and format error response
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || `Error: ${error.response?.status || 'Unknown'}`;
      throw new Error(message);
    }
    
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Get all restaurants
export const getAllRestaurants = async (filter?: string) => {
  // Mocked data for now - will be replaced with actual API call
  const endpoint = `/restaurants${filter ? `?filter=${filter}` : ''}`;
  
  // Try to fetch from API, fall back to mock data if API is not available
  try {
    return await fetchWithAuth(endpoint);
  } catch (error) {
    console.warn("Using mock data due to API error:", error);
    
    // Simulate API response structure with mock data
    return {
      success: true,
      restaurants: [
        {
          _id: "1",
          name: "Burger Palace",
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          rating: 4.7,
          deliveryTime: "15-25 min",
          deliveryFee: "$1.99",
          categories: ["Burgers", "American", "Fast Food"],
          openCloseStatus: true,
        },
        {
          _id: "2",
          name: "Pizza Heaven",
          imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          rating: 4.5,
          deliveryTime: "20-30 min",
          deliveryFee: "$2.49",
          categories: ["Pizza", "Italian", "Vegetarian"],
          openCloseStatus: true,
        },
        {
          _id: "3",
          name: "Sushi Express",
          imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          rating: 4.8,
          deliveryTime: "25-35 min",
          deliveryFee: "$3.99",
          categories: ["Japanese", "Sushi", "Healthy"],
          openCloseStatus: true,
        },
        {
          _id: "4",
          name: "Taco Fiesta",
          imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          rating: 4.3,
          deliveryTime: "15-25 min",
          deliveryFee: "$1.49",
          categories: ["Mexican", "Tacos", "Burritos"],
          openCloseStatus: true,
        },
        {
          _id: "5",
          name: "Pasta Paradise",
          imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          rating: 4.6,
          deliveryTime: "25-40 min",
          deliveryFee: "$2.99",
          categories: ["Italian", "Pasta", "Mediterranean"],
          openCloseStatus: true,
        },
        {
          _id: "6",
          name: "Salad & Co",
          imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          rating: 4.4,
          deliveryTime: "15-25 min",
          deliveryFee: "$1.99",
          categories: ["Healthy", "Salads", "Wraps"],
          openCloseStatus: true,
        },
      ]
    };
  }
};

// Get single restaurant details
export const getRestaurantById = async (id: string) => {
  // Mocked data for now - will be replaced with actual API call
  const endpoint = `/restaurants/${id}`;
  
  try {
    return await fetchWithAuth(endpoint);
  } catch (error) {
    console.warn("Using mock data due to API error:", error);
    
    // Mock data for restaurant details
    const mockRestaurants = {
      "1": {
        _id: "1",
        name: "Burger Palace",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        rating: 4.7,
        deliveryTime: "15-25 min",
        deliveryFee: "$1.99",
        categories: ["Burgers", "American", "Fast Food"],
        address: "123 Main St, Anytown, USA",
        description: "Serving juicy, delicious burgers since 2010. All our beef is locally sourced and our buns are baked fresh daily.",
        openCloseStatus: true,
        menuItems: [
          {
            _id: "101",
            name: "Classic Cheeseburger",
            description: "Juicy beef patty with melted cheddar cheese, lettuce, tomato, onion, and our special sauce.",
            price: 8.99,
            imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            category: "Burgers",
            isAvailable: true,
          },
          {
            _id: "102",
            name: "Bacon BBQ Burger",
            description: "Beef patty topped with crispy bacon, cheddar cheese, onion rings, and BBQ sauce.",
            price: 10.99,
            imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            category: "Burgers",
            isAvailable: true,
          },
          {
            _id: "103",
            name: "Veggie Burger",
            description: "Plant-based patty with avocado, lettuce, tomato, and vegan mayo.",
            price: 9.99,
            imageUrl: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            category: "Vegetarian",
            isAvailable: true,
          },
        ]
      },
      // Add more restaurants as needed
    };
    
    if (!mockRestaurants[id as keyof typeof mockRestaurants]) {
      throw new Error("Restaurant not found");
    }
    
    return {
      success: true,
      restaurant: mockRestaurants[id as keyof typeof mockRestaurants]
    };
  }
};

// Get restaurant menu items
export const getRestaurantMenu = async (restaurantId: string) => {
  const endpoint = `/restaurants/${restaurantId}/menu`;
  
  try {
    return await fetchWithAuth(endpoint);
  } catch (error) {
    console.warn("Using mock data due to API error:", error);
    
    // Mock menu data based on restaurant ID
    const mockMenuItems = {
      "1": [
        {
          _id: "101",
          name: "Classic Cheeseburger",
          description: "Juicy beef patty with melted cheddar cheese, lettuce, tomato, onion, and our special sauce.",
          price: 8.99,
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          category: "Burgers",
          isAvailable: true,
        },
        {
          _id: "102",
          name: "Bacon BBQ Burger",
          description: "Beef patty topped with crispy bacon, cheddar cheese, onion rings, and BBQ sauce.",
          price: 10.99,
          imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          category: "Burgers",
          isAvailable: true,
        },
        {
          _id: "103",
          name: "Veggie Burger",
          description: "Plant-based patty with avocado, lettuce, tomato, and vegan mayo.",
          price: 9.99,
          imageUrl: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          category: "Vegetarian",
          isAvailable: true,
        },
        {
          _id: "104",
          name: "French Fries",
          description: "Crispy golden fries seasoned with sea salt.",
          price: 3.99,
          imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          category: "Sides",
          isAvailable: true,
        },
      ],
    };
    
    if (!mockMenuItems[restaurantId as keyof typeof mockMenuItems]) {
      return { success: true, menuItems: [] };
    }
    
    return {
      success: true,
      menuItems: mockMenuItems[restaurantId as keyof typeof mockMenuItems]
    };
  }
};