const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Restaurant Service running on port ${PORT}`);
});
