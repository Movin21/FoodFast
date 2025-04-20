const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  register,
  login,
  getCustomer,
  updateCustomer,
  changePassword
} = require("../controllers/customerAuthController");

// @route   POST /customers/register
// @desc    Register a customer
// @access  Public
router.post("/register", register);

// @route   POST /customers/login
// @desc    Login customer & get token
// @access  Public
router.post("/login", login);

// @route   GET /customers/me
// @desc    Get current customer profile
// @access  Private
router.get("/me", auth, getCustomer);

// @route   PUT /customers/profile
// @desc    Update customer profile
// @access  Private
router.put("/profile", auth, updateCustomer);

// @route   PUT /customers/change-password
// @desc    Change customer password
// @access  Private
router.put("/change-password", auth, changePassword);

module.exports = router;