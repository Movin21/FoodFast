const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const notifyRoutes = require("./routes/notifyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/notify", notifyRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
