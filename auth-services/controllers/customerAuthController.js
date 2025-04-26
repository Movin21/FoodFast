const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register new customer
exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    password,
  } = req.body;

  try {
    // Check if customer already exists
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    await newCustomer.save();

    // Generate JWT
    const token = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send response
    res.status(201).json({ 
      token, 
      customer: {
        id: newCustomer._id,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address
      } 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Login customer
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find customer
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ msg: "Invalid credentials" });

    // Verify password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send response
    res.json({ 
      token,
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get customer profile
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id).select("-password");
    if (!customer) return res.status(404).json({ msg: "Customer not found" });
    
    res.json(customer);
  } catch (err) {
    console.error("Get customer error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Update customer profile
exports.updateCustomer = async (req, res) => {
  const { firstName, lastName, phone, address } = req.body;
  
  // Build update object
  const customerFields = {};
  if (firstName) customerFields.firstName = firstName;
  if (lastName) customerFields.lastName = lastName;
  if (phone) customerFields.phone = phone;
  if (address) customerFields.address = address;
  customerFields.updatedAt = Date.now();

  try {
    let customer = await Customer.findById(req.customer.id);
    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    // Update customer
    customer = await Customer.findByIdAndUpdate(
      req.customer.id,
      { $set: customerFields },
      { new: true }
    ).select("-password");

    res.json(customer);
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    customer.password = hashedPassword;
    customer.updatedAt = Date.now();
    await customer.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};