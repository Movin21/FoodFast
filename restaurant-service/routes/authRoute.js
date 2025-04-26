const express = require("express");
const router = express.Router();
const {
  registerRestaurant,
  loginRestaurant,
  registerUser,
  loginUser,
} = require("../controllers/authController");

// Restaurant auth routes
router.post("/restaurantRegister", registerRestaurant);
router.post("/restaurantLogin", loginRestaurant); 

// User auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
