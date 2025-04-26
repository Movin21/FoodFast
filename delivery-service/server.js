const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./config/db");
const cors = require("cors");
const { setupSocket } = require("./socket/socket");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const deliveryRoutes = require("./routes/deliveryRoutes");
app.use("/delivery", deliveryRoutes);

const server = http.createServer(app);
setupSocket(server);

server.listen(process.env.PORT, () =>
  console.log(`Delivery Service running on port ${process.env.PORT}`)
);
