const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  imageUrl: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "out for delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Credit Card", "Cash on Delivery", "Wallet"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
    },
    driverName: {
      type: String,
    },
    specialInstructions: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    actualDeliveryTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for order tracking URL
orderSchema.virtual('trackingUrl').get(function() {
  return `/track-order/${this._id}`;
});

// Add method to calculate ETA
orderSchema.methods.calculateETA = function() {
  // Simple implementation - in production you'd want more sophisticated logic
  // that takes into account restaurant preparation time, distance, and traffic
  const now = new Date();
  const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);
  this.estimatedDeliveryTime = thirtyMinutesLater;
  return thirtyMinutesLater;
};

module.exports = mongoose.model("Order", orderSchema);