const express = require("express");
const {
  getOrdersByRestaurant,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const authenticate = require("../middlewares/authMiddleware");
const Order = require("../models/orderModel"); // Add this import

const router = express.Router();

// Route to get all orders for a restaurant
router.get("/", authenticate, getOrdersByRestaurant);

// Route to create a new order
router.post("/", authenticate, createOrder);

// Route to update the status of an order
router.put("/:orderId/status", authenticate, updateOrderStatus);

module.exports = router;
