const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied"
      });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Invalid token, authorization denied"
    });
  }
};

// Optional middleware to make auth optional
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    // If token verification fails, just continue without setting req.user
    next();
  }
};

// Check if user is a restaurant owner
const isRestaurant = (req, res, next) => {
  if (!req.user || req.user.role !== "restaurant") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Restaurant role required"
    });
  }
  next();
};

// Check if user is a customer
const isCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Customer role required"
    });
  }
  next();
};

// Check if user is a driver
const isDriver = (req, res, next) => {
  if (!req.user || req.user.role !== "driver") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Driver role required"
    });
  }
  next();
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required"
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  optionalAuth,
  isRestaurant,
  isCustomer,
  isDriver,
  isAdmin
};