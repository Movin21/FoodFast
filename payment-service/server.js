const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/payment", paymentRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
