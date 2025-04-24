const Driver = require("../models/Driver");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register new driver
exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    licensePlate,
    bikeType,
    phone,
    serviceAreas,
    available = true,
    location = { lat: 0, lng: 0 },
  } = req.body;

  try {
    const existing = await Driver.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Driver already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDriver = new Driver({
      name,
      email,
      password: hashedPassword,
      licensePlate,
      bikeType,
      phone,
      serviceAreas,
      available,
      location,
    });

    await newDriver.save();
    res.status(201).json({ msg: "Driver registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// Login driver
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.status(200).json({ msg: "Login successful", driverId: driver._id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all available drivers
exports.getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ available: true });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching drivers" });
  }
};

// Update driver location
exports.updateLocation = async (req, res) => {
  const { driverId, location } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { location },
      { new: true }
    );
    res.json(driver);
  } catch (err) {
    res.status(500).json({ msg: "Error updating location" });
  }
};

// Update driver availability
exports.setAvailability = async (req, res) => {
  const { driverId, available } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { available },
      { new: true }
    );
    res.json(driver);
  } catch (err) {
    res.status(500).json({ msg: "Error updating availability" });
  }
};
