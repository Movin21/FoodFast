const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAvailableDrivers,
  updateLocation,
  setAvailability,
} = require("../controllers/driverAuthController");

router.post("/register", register);
router.post("/login", login);
router.get("/", getAvailableDrivers);
router.post("/update-location", updateLocation);
router.post("/set-availability", setAvailability);

module.exports = router;
