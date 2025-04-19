// services/driverService.js
const axios = require("axios");
const geoService = require("./geoService");

exports.findNearestDriver = async (pickupCoords) => {
  const res = await axios.get(`${process.env.AUTH_SERVICE_URL}/drivers`);
  const drivers = res.data;

  if (!drivers.length) return null;

  // Calculate distance for each driver and find the closest one
  const driversWithDistance = drivers.map((driver) => {
    // Skip drivers without location data
    if (!driver.location || !driver.location.lat || !driver.location.lng) {
      return { ...driver, distance: Infinity };
    }

    const distance = geoService.calculateDistance(
      pickupCoords,
      driver.location
    );
    return { ...driver, distance };
  });

  // Sort drivers by distance (ascending)
  driversWithDistance.sort((a, b) => a.distance - b.distance);

  // Return the closest driver
  return driversWithDistance[0];
};

exports.getDriverById = async (driverId) => {
  if (!driverId) return null;
  try {
    const res = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/drivers/${driverId}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
