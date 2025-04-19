const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    dropAddress: { type: String, required: true },
    pickupCoords: { lat: Number, lng: Number },
    dropCoords: { lat: Number, lng: Number },
    driver: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      licensePlate: String,
      email: { type: String, required: true },
      phone: { type: String, required: true },
      location: { lat: Number, lng: Number },
      distance: Number,
    },
    status: {
      type: String,
      enum: ["On the way to pick up point", "Order Picked Up", "Delivered"],
      default: "On the way to pick up",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
