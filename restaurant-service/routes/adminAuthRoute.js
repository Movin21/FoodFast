const express = require("express");
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminAuthController");

const router = express.Router();

// Admin registration
router.post("/register", registerAdmin);

// Admin login
router.post("/login", loginAdmin);

module.exports = router;
