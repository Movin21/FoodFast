const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  getCustomerOrders, 
  getRestaurantOrders, 
  getOrderById,
  updateOrderStatus,
  assignDriver,
  cancelOrder,
  getRestaurantOrderStats
} = require("../controllers/orderController");
const { 
  authMiddleware, 
  optionalAuth, 
  isRestaurant, 
  isCustomer, 
  isDriver, 
  isAdmin 
} = require("../middleware/auth");

// Public routes
router.post("/", optionalAuth, createOrder); // Allow orders without auth for testing

// Protected routes - Customer
router.get("/customer", authMiddleware, isCustomer, getCustomerOrders);

// Protected routes - Restaurant
router.get("/restaurant/:restaurantId?", authMiddleware, getRestaurantOrders);
router.get("/restaurant/:restaurantId/stats", authMiddleware, getRestaurantOrderStats);

// Protected routes - Both customer and restaurant need access
router.get("/:id", authMiddleware, getOrderById);
router.post("/:id/cancel", authMiddleware, cancelOrder);

// Protected routes - Restaurant/Admin only
router.put("/:id/status", authMiddleware, updateOrderStatus);

// Protected routes - Admin/Delivery service only
router.post("/:id/assign-driver", authMiddleware, assignDriver);

module.exports = router;