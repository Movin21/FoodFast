const express = require("express");
const router = express.Router();
const { sendNotification } = require("../controllers/notifyController");

router.post("/", sendNotification);

module.exports = router;
