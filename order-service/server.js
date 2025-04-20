const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "Order service is running", 
    timestamp: new Date() 
  });
});

// Routes
app.use("/api/orders", orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "production" ? null : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`
  });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
