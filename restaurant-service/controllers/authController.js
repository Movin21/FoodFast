const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Restaurant = require("../models/restaurantModel");

// Restaurant registration
const registerRestaurant = async (req, res) => {
  try {
    const {
      username,
      password,
      restaurantName,
      email,
      contactNumber,
      location,
      deliveryRange,
      openTime,
      closeTime,
    } = req.body;

    // Check if restaurant exists
    const existingRestaurant = await Restaurant.findOne({ username });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new restaurant
    const newRestaurant = new Restaurant({
      username,
      password: hashedPassword,
      restaurantName,
      email,
      contactNumber,
      location,
      deliveryRange,
      openTime,
      closeTime,
    });

    await newRestaurant.save();

    res.status(201).json({ message: "Restaurant registered successfully" });
  } catch (error) {
    console.error("Error in registerRestaurant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Restaurant login
const loginRestaurant = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findOne({ username });
    if (!restaurant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the restaurant is approved
    if (!restaurant.isApproved) {
      return res.status(403).json({ message: "Admin approval needed." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT
    const token = jwt.sign(
      { id: restaurant._id, type: "restaurant" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    res.json({
      token,
      restaurant: {
        id: restaurant._id,
        username: restaurant.username,
        restaurantName: restaurant.restaurantName,
        email: restaurant.email,
      },
    });
  } catch (error) {
    console.error("Error in loginRestaurant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// User registration
const registerUser = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT
    const token = jwt.sign(
      { id: user._id, type: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export all functions
module.exports = {
  registerRestaurant,
  loginRestaurant,
  registerUser,
  loginUser,
};
