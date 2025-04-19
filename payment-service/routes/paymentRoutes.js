const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../controllers/paymentController");

router.post("/create", createPaymentIntent);
router.post(
  "/webhook",
  require("../controllers/paymentController").handleStripeWebhook
);

module.exports = router;
