const mongoose = require("mongoose");

// Define the schema for the restaurant model
const restaurantSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: [String],
    default: [],
  },
  profileImage: {
    type: String,
    default: "https://example.com/default-profile-image.png",
  },
  location: {
    type: String,
    required: true,
  },
  isApproved: { type: Boolean, default: false }, // Field to track approval status
  deliveryRange: {
    type: Number,
    required: true,
  },
  openCloseStatus: {
    type: Boolean,
    default: true,
  },
  openTime: {
    type: String, // e.g., "08:00 AM"
    required: true,
  },
  closeTime: {
    type: String, // e.g., "10:00 PM"
    required: true,
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
