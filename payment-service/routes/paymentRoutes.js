const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  getAllTransactions,
  deleteTransaction,
} = require("../controllers/paymentController");

router.post("/create", createPaymentIntent);
router.post(
  "/webhook",
  require("../controllers/paymentController").handleStripeWebhook
);

// Get all transactions
router.get("/transactions", getAllTransactions);

// Delete a transaction
router.delete("/transactions/:id", deleteTransaction);

module.exports = router;
