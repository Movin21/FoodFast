const MenuItem = require("../models/menuItem"); // Import the MenuItem model
const Restaurant = require("../models/restaurantModel"); // Import the Restaurant model

// Controller to create a menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    // Get the logged-in restaurant's ID from the middleware
    const restaurantId = req.restaurant.id;

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Create a new menu item
    const menuItem = new MenuItem({
      restaurantId, // Automatically associate the logged-in restaurant's ID
      name,
      description,
      price,
      category,
      image,
      isAvailable,
    });

    // Save the menu item to the database
    await menuItem.save();

    res
      .status(201)
      .json({ message: "Menu item created successfully", menuItem });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while creating the menu item",
        error: error.message,
      });
  }
};

// Controller to fetch all menu items for a restaurant
const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Fetch all menu items for the given restaurant
    const menuItems = await MenuItem.find({ restaurantId });

    res.status(200).json({ menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({
      message: "An error occurred while fetching menu items",
      error: error.message,
    });
  }
};

// Controller to update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const updates = req.body;

    // Find and update the menu item
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      updates,
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res
      .status(200)
      .json({ message: "Menu item updated successfully", updatedMenuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      message: "An error occurred while updating the menu item",
      error: error.message,
    });
  }
};

// Controller to delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    // Find and delete the menu item
    const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      message: "An error occurred while deleting the menu item",
      error: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem,
};
