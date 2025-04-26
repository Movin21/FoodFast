const express = require("express");
const { updateOpenCloseStatus } = require("../controllers/resturentController");
const authenticate = require("../middlewares/authMiddleware");
const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuItem");

const router = express.Router();

// Route to update open/close status (only accessible to logged-in restaurants)
router.put("/status", authenticate, async (req, res) => {
  try {
    const { openCloseStatus } = req.body;
    const restaurantId = req.restaurant._id;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { openCloseStatus },
      { new: true }
    );

    res.json({
      message: "Status updated successfully",
      openCloseStatus: updatedRestaurant.openCloseStatus,
    });
  } catch (error) {
    console.error("Error updating restaurant status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get restaurant profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const restaurant = req.restaurant; // From auth middleware

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Return the restaurant data (excluding sensitive fields)
    const restaurantData = {
      _id: restaurant._id,
      username: restaurant.username,
      restaurantName: restaurant.restaurantName,
      email: restaurant.email,
      contactNumber: restaurant.contactNumber,
      location: restaurant.location,
      openCloseStatus: restaurant.openCloseStatus || false,
      openTime: restaurant.openTime || "09:00",
      closeTime: restaurant.closeTime || "22:00",
      deliveryRange: restaurant.deliveryRange || 5,
      ratings: restaurant.ratings || 0,
      profileImage: restaurant.profileImage || "",
    };

    res.json(restaurantData);
  } catch (error) {
    console.error("Error fetching restaurant profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update restaurant profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;
    const updateFields = req.body;

    // Don't allow updating sensitive fields
    delete updateFields.password;
    delete updateFields._id;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updateFields,
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({
      message: "Profile updated successfully",
      restaurant: {
        _id: updatedRestaurant._id,
        username: updatedRestaurant.username,
        restaurantName: updatedRestaurant.restaurantName,
        contactNumber: updatedRestaurant.contactNumber,
        email: updatedRestaurant.email,
        ratings: updatedRestaurant.ratings,
        reviews: updatedRestaurant.reviews,
        profileImage: updatedRestaurant.profileImage,
        location: updatedRestaurant.location,
        deliveryRange: updatedRestaurant.deliveryRange,
        openCloseStatus: updatedRestaurant.openCloseStatus,
        openTime: updatedRestaurant.openTime,
        closeTime: updatedRestaurant.closeTime,
      },
    });
  } catch (error) {
    console.error("Error updating restaurant profile:", error);
    res.status(500).json({
      message: "Error updating restaurant profile",
      error: error.message,
    });
  }
});

// Add menu endpoints to restaurant route
router.get("/menu", authenticate, async (req, res) => {
  try {
    const restaurantId = req.restaurant._id;
    const menuItems = await MenuItem.find({ restaurant: restaurantId });

    res.json({ menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
});

router.post("/menu", authenticate, async (req, res) => {
  try {
    // Log request for debugging
    console.log("Creating menu item with data:", req.body);
    console.log("Restaurant ID:", req.restaurant._id);

    const { name, description, price, category, image, isAvailable } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Menu item requires name, price, and category",
      });
    }

    // Create menu item with restaurant ID
    const menuItem = new MenuItem({
      name,
      description: description || "",
      price: Number(price),
      category,
      image: image || "",
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      restaurant: req.restaurant._id, // Ensure restaurant ID is set
    });

    // Save with better error handling
    await menuItem.save();

    console.log("Menu item created successfully:", menuItem);
    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);

    // Send more detailed error message
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    res
      .status(500)
      .json({ message: "Error creating menu item", error: error.message });
  }
});

router.put("/menu/:id", authenticate, async (req, res) => {
  try {
    const restaurantId = req.restaurant._id;
    const menuItemId = req.params.id;

    // Find item and verify ownership
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menuItem.restaurant.toString() !== restaurantId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this item" });
    }

    // Update and return
    const updated = await MenuItem.findByIdAndUpdate(
      menuItemId,
      { ...req.body },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Error updating menu item" });
  }
});

router.delete("/menu/:id", authenticate, async (req, res) => {
  try {
    const restaurantId = req.restaurant._id;
    const menuItemId = req.params.id;

    // Find item and verify ownership
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menuItem.restaurant.toString() !== restaurantId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this item" });
    }

    // Delete and confirm
    await MenuItem.findByIdAndDelete(menuItemId);

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Error deleting menu item" });
  }
});

module.exports = router;
