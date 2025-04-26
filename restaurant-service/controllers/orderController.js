const Order = require("../models/orderModel");
const MenuItem = require("../models/menuItem");

// Controller to get all orders for a restaurant
const getOrdersByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.restaurant._id;
    const { filter = "all" } = req.query;

    // Change from 'restaurant' to 'restaurantId' to match your model
    let query = { restaurantId: restaurantId };
    if (filter !== "all") {
      query.status = filter;
    }

    console.log("Querying orders with:", query); // Add this for debugging

    const orders = await Order.find(query)
      .populate("items.menuItemId")
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders`); // Add this for debugging

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Controller to create a new order
const createOrder = async (req, res) => {
  try {
    const { restaurantId, customerName, customerContact, items } = req.body;

    // Validate that the restaurant exists
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    // Validate that items are provided
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // Calculate the total price of the order
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res
          .status(404)
          .json({ message: `Menu item not found: ${item.menuItemId}` });
      }
      totalPrice += menuItem.price * item.quantity;
    }

    // Create the order
    const newOrder = new Order({
      restaurant: restaurantId, // Change from 'restaurantId' to 'restaurant'
      customerName,
      customerContact,
      items,
      totalPrice,
      status: "pending", // Default status
    });

    // Save the order to the database
    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "An error occurred while creating the order",
      error: error.message,
    });
  }
};

// Controller to update the status of an order
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = [
      "pending",
      "preparing",
      "ready",
      "out for delivery",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "An error occurred while updating the order status",
      error: error.message,
    });
  }
};

module.exports = {
  getOrdersByRestaurant,
  createOrder, // Export the create order controller
  updateOrderStatus,
};
