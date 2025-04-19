const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "succeeded", "failed"],
    default: "pending",
  },
  paymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  customerName: { type: String },
  customerPhone: { type: String },
  customerAddress: { type: String },
  restaurantName: { type: String },
  restaurantAddress: { type: String },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
