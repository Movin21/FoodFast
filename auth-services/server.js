const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const driverAuthRoutes = require("./routes/driverRoute");
const customerAuthRoutes = require("./routes/customerRoute");
const connectDB = require("./config/dbConnection");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/drivers", driverAuthRoutes);
app.use("/customers", customerAuthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
