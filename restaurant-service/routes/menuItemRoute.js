const express = require("express");
const {
  createMenuItem,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuItemController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a menu item (only accessible to logged-in restaurants)
router.post("/", authenticate, createMenuItem);

// Route to fetch all menu items for a restaurant
router.get("/:restaurantId", getMenuItemsByRestaurant);

// Route to update a menu item
router.put("/:menuItemId", updateMenuItem);

// Route to delete a menu item
router.delete("/:menuItemId", deleteMenuItem);

module.exports = router;
