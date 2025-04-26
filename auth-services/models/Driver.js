const mongoose = require("mongoose");
const DriverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  licensePlate: { type: String, required: true },
  bikeType: { type: String, required: true },
  phone: { type: String, required: true },
  available: { type: Boolean, default: true },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
});
module.exports = mongoose.model("Driver", DriverSchema);
