const Delivery = require("../models/Delivery");
const geoService = require("../services/geoService");
const driverService = require("../services/driverService");
const { emitToRoom } = require("../socket/socket");
const axios = require("axios");

exports.createDelivery = async (req, res) => {
  const {
    orderId,
    pickupAddress,
    dropAddress,
    customerName,
    customerPhone,
    customerEmail, // <-- Added
  } = req.body;

  if (!pickupAddress || !dropAddress) {
    return res
      .status(400)
      .json({ message: "Pickup and dropoff addresses are required." });
  }

  try {
    const [pickupCoords, dropCoords] = await Promise.all([
      geoService.getCoordinates(pickupAddress),
      geoService.getCoordinates(dropAddress),
    ]);

    if (!pickupCoords || !dropCoords) {
      return res.status(400).json({
        message:
          "Could not determine coordinates for provided addresses. Please check the address format and try again.",
      });
    }

    // Find the nearest available driver based on pickup coordinates
    const driver = await driverService.findNearestDriver(pickupCoords);
    if (!driver)
      return res.status(404).json({ message: "No available drivers" });

    // Get driver's current location
    const driverLocation = driver.location || { lat: 0, lng: 0 };

    const delivery = await Delivery.create({
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      dropAddress,
      pickupCoords,
      dropCoords,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email || "movin@gmail.com",
        phone: driver.phone || "0713505391",
        licensePlate: driver.licensePlate,
        location: driverLocation,
        distance: driver.distance
          ? parseFloat(driver.distance.toFixed(2))
          : null,
      },
      status: "On the way to pick up point",
    });

    emitToRoom(orderId, "deliveryCreated", delivery);

    // Send notifications to driver and customer
    try {
      // Format messages for driver and customer
      const driverMessage = `New delivery assigned! Order ID: ${orderId}. Customer: ${customerName}. Pickup: ${pickupAddress}. Dropoff: ${dropAddress}. Please proceed to pickup location.`;
      const customerMessage = `Your order ${orderId} has been confirmed! Your driver ${driver.name} (${driver.licensePlate}, ${driver.bikeType}) will pick up your order soon. Driver contact: ${driver.phone}.Live Track Your Order Using ${orderId}`;

      // Send notifications via notification service
      await axios.post("http://localhost:5006/api/notify", {
        toEmail: driver.email,
        toPhone: driver.phone,
        subject: `New Delivery Assignment - Order ${orderId}`,
        message: driverMessage,
      });

      await axios.post("http://localhost:5006/api/notify", {
        toEmail: customerEmail,
        toPhone: customerPhone,
        subject: `Your Order ${orderId} Confirmation`,
        message: customerMessage,
      });

      console.log("Notifications sent to driver and customer");
    } catch (notifyErr) {
      console.error("Failed to send notifications:", notifyErr.message);
      // Continue with response even if notifications fail
    }

    res.status(201).json({
      ...delivery.toObject(),
      customerEmail: delivery.customerEmail,
      driverEmail: delivery.driver.email,
      driverPhone: delivery.driver.phone,
    });
  } catch (err) {
    let errorMsg = err.message || "Unknown error";
    if (
      errorMsg.includes("empty or invalid format") ||
      errorMsg.includes("No results found") ||
      errorMsg.includes("Location not found")
    ) {
      return res
        .status(400)
        .json({ error: "Invalid pickup or dropoff address. " + errorMsg });
    }
    if (errorMsg.includes("Google Maps API key is not configured")) {
      return res.status(500).json({
        error:
          "Geocoding service is not configured properly. Please contact support.",
      });
    }
    if (errorMsg.includes("Failed to connect to geocoding service")) {
      return res.status(502).json({
        error: "Unable to reach geocoding service. Please try again later.",
      });
    }
    if (
      errorMsg.includes("Unexpected response from geocoding service") ||
      errorMsg.includes("Geocoding error")
    ) {
      return res
        .status(502)
        .json({ error: "Geocoding service error: " + errorMsg });
    }
    res.status(500).json({ error: errorMsg });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const delivery = await Delivery.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!delivery)
      return res.status(404).json({ message: "Delivery not found" });

    emitToRoom(orderId, "statusUpdated", { orderId, status });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeliveryByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const delivery = await Delivery.findOne({ orderId });
    if (!delivery) return res.status(404).json({ message: "Not found" });
    let driverDetails = null;
    if (delivery.driver && delivery.driver.id) {
      const driverService = require("../services/driverService");
      driverDetails = await driverService.getDriverById(delivery.driver.id);
    }
    const driver = delivery.driver || {};
    const responseDriver = {
      id: driver.id || "",
      name: driver.name || "",
      licensePlate: driver.licensePlate || "",
      model: driver.bikeType || "Bajaj Pulsar N-160",
      location: driver.location || { lat: null, lng: null },
      distance: driver.distance || null,
      email: driver.email || "",
      phone: driver.phone || "",
    };
    res.json({
      pickupCoords: delivery.pickupCoords,
      dropCoords: delivery.dropCoords,
      driver: responseDriver,
      _id: delivery._id,
      orderId: delivery.orderId,
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone,
      customerEmail: delivery.customerEmail,
      pickupAddress: delivery.pickupAddress,
      dropAddress: delivery.dropAddress,
      status: delivery.status,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
      __v: delivery.__v,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update driver location during delivery
exports.updateDriverLocation = async (req, res) => {
  const { orderId } = req.params;
  const { driverLocation } = req.body;

  try {
    // Validate location data
    if (!driverLocation || !driverLocation.lat || !driverLocation.lng) {
      return res.status(400).json({ message: "Invalid location data" });
    }

    const delivery = await Delivery.findOne({ orderId });
    if (!delivery)
      return res.status(404).json({ message: "Delivery not found" });

    // Update driver location in delivery record
    delivery.driver.location = driverLocation;
    await delivery.save();

    // Emit location update to clients
    emitToRoom(orderId, "driverLocationUpdated", {
      orderId,
      driverLocation,
      driverId: delivery.driver.id,
    });

    res.json({ success: true, location: driverLocation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
