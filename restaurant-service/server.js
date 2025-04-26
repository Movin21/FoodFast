require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoute = require("./routes/authRoute");
const menuItemRoute = require("./routes/menuItemRoute"); // Import menu item routes
const restaurantRoute = require("./routes/restaurantRoute"); // Import the restaurant route
const orderRoute = require("./routes/orderRoute"); // Import the order route
const adminAuthRoute = require("./routes/adminAuthRoute"); // Import the admin auth route
const adminRoute = require("./routes/adminRoute"); // Import the admin route

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Add this before your routes
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database connection
connectDB();

// Debug registered routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/auth", require("./routes/authRoute"));
app.use("/restaurant", require("./routes/restaurantRoute"));
app.use("/order", require("./routes/orderRoute"));
app.use("/menu", require("./routes/menuItemRoute"));
app.use("/images", require("./routes/imageRoutes"));
app.use("/admin/auth", adminAuthRoute);
app.use("/admin", adminRoute);
app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
