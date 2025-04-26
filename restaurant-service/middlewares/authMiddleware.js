const jwt = require("jsonwebtoken");
const Restaurant = require("../models/restaurantModel");

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Authenticating with token:", token.substring(0, 10) + "...");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    // Check if it's a restaurant or regular user
    if (decoded.type === "restaurant") {
      const restaurant = await Restaurant.findById(decoded.id).select(
        "-password"
      );

      if (!restaurant) {
        console.log("Restaurant not found with ID:", decoded.id);
        return res
          .status(401)
          .json({ message: "Invalid token, restaurant not found" });
      }

      // Set restaurant data on request object
      req.restaurant = restaurant;
      console.log("Restaurant authenticated:", restaurant.username);
    } else {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.log("User not found with ID:", decoded.id);
        return res
          .status(401)
          .json({ message: "Invalid token, user not found" });
      }

      req.user = user;
      console.log("User authenticated:", user.username);
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Server error in authentication" });
  }
};

module.exports = authenticate;
