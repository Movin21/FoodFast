const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const authenticateAdmin = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(403).json({ message: "Invalid admin token." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authenticateAdmin;
