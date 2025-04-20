const Order = require("../models/Order");
const mongoose = require("mongoose");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      restaurantId,
      restaurantName,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      contactNumber,
      specialInstructions
    } = req.body;

    // Get customerId from JWT token (via middleware)
    const customerId = req.user ? req.user.id : req.body.customerId; // Fallback for testing

    // Verify that all required fields are present
    if (!items || !restaurantId || !totalAmount || !paymentMethod || !deliveryAddress || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Create new order
    const newOrder = new Order({
      customerId,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      contactNumber,
      specialInstructions: specialInstructions || ""
    });

    // Calculate estimated delivery time
    newOrder.calculateETA();

    // Save order to database
    await newOrder.save();

    // Publish order to message queue (if implemented)
    // publishToQueue('new-order', newOrder);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    });
  }
};

// Get all orders for a customer
const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { status } = req.query;

    let query = { customerId };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error getting customer orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message
    });
  }
};

// Get all orders for a restaurant
const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId || req.user.id;
    const { status } = req.query;

    let query = { restaurantId };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error getting restaurant orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving restaurant orders",
      error: error.message
    });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is authorized to view this order
    // (Either the customer who placed it, the restaurant that received it, or an admin)
    const userIsCustomer = req.user && (req.user.id === order.customerId);
    const userIsRestaurant = req.user && (req.user.id === order.restaurantId);
    const userIsDriver = req.user && (req.user.id === order.driverId);
    const userIsAdmin = req.user && req.user.role === 'admin';

    if (!(userIsCustomer || userIsRestaurant || userIsDriver || userIsAdmin)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error getting order:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving order",
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    // Validate status
    const validStatuses = ["pending", "preparing", "ready", "out for delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    // Find the order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update status
    order.status = status;

    // If delivered, set actual delivery time
    if (status === "delivered") {
      order.actualDeliveryTime = new Date();
    }

    // Save the updated order
    await order.save();

    // Publish status update to message queue (if implemented)
    // publishToQueue('order-status-updated', { orderId: id, status });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

// Assign driver to order
const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId, driverName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    if (!driverId || !driverName) {
      return res.status(400).json({
        success: false,
        message: "Driver ID and name are required"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update driver information
    order.driverId = driverId;
    order.driverName = driverName;
    
    // If the order was ready, update status to "out for delivery"
    if (order.status === "ready") {
      order.status = "out for delivery";
    }

    // Save the updated order
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      order
    });
  } catch (error) {
    console.error("Error assigning driver:", error);
    return res.status(500).json({
      success: false,
      message: "Error assigning driver",
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is authorized to cancel this order
    const userIsCustomer = req.user && (req.user.id === order.customerId);
    const userIsRestaurant = req.user && (req.user.id === order.restaurantId);
    const userIsAdmin = req.user && req.user.role === 'admin';

    if (!(userIsCustomer || userIsRestaurant || userIsAdmin)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order"
      });
    }

    // Check if the order can be cancelled
    const nonCancellableStatuses = ["delivered", "out for delivery", "cancelled"];
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled when status is ${order.status}`
      });
    }

    // Update order status
    order.status = "cancelled";
    order.specialInstructions = order.specialInstructions 
      ? `${order.specialInstructions}\nCANCELLED: ${reason || 'No reason provided'}`
      : `CANCELLED: ${reason || 'No reason provided'}`;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
};

// Get orders stats for a restaurant
const getRestaurantOrderStats = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId || req.user.id;
    
    // Get current date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Total orders stats
    const totalOrders = await Order.countDocuments({ restaurantId });
    const totalRevenue = await Order.aggregate([
      { $match: { restaurantId } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Today's orders stats
    const todayOrders = await Order.countDocuments({ 
      restaurantId, 
      createdAt: { $gte: today } 
    });
    const todayRevenue = await Order.aggregate([
      { 
        $match: { 
          restaurantId,
          createdAt: { $gte: today }
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // This month's orders stats
    const monthOrders = await Order.countDocuments({ 
      restaurantId, 
      createdAt: { $gte: thisMonth } 
    });
    const monthRevenue = await Order.aggregate([
      { 
        $match: { 
          restaurantId,
          createdAt: { $gte: thisMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Status counts
    const statusCounts = await Order.aggregate([
      { $match: { restaurantId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formattedStatusCounts = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        todayOrders,
        todayRevenue: todayRevenue.length > 0 ? todayRevenue[0].total : 0,
        monthOrders,
        monthRevenue: monthRevenue.length > 0 ? monthRevenue[0].total : 0,
        statusCounts: formattedStatusCounts
      }
    });
  } catch (error) {
    console.error("Error getting order stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving order statistics",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
  updateOrderStatus,
  assignDriver,
  cancelOrder,
  getRestaurantOrderStats
};