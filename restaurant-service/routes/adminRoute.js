const express = require("express");
const authenticateAdmin = require("../middlewares/adminAuthMiddleware");
const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");

const router = express.Router();

// Fetch all users
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all restaurants
router.get("/restaurants", authenticateAdmin, async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all unapproved restaurants
router.get("/restaurants/unapproved", authenticateAdmin, async (req, res) => {
  try {
    const unapprovedRestaurants = await Restaurant.find({ isApproved: false });
    res.status(200).json(unapprovedRestaurants);
  } catch (error) {
    console.error("Error fetching unapproved restaurants:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve a restaurant
router.patch(
  "/restaurants/:id/approve",
  authenticateAdmin,
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found." });
      }

      restaurant.isApproved = true;
      await restaurant.save();

      res.status(200).json({ message: "Restaurant approved successfully." });
    } catch (error) {
      console.error("Error approving restaurant:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// Delete a restaurant
router.delete("/restaurants/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the restaurant
    const restaurant = await Restaurant.findByIdAndDelete(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.status(200).json({ message: "Restaurant deleted successfully." });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
