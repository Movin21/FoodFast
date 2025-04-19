const axios = require("axios");

exports.getCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!address || typeof address !== "string" || address.trim().length === 0) {
    throw new Error("Address is empty or invalid format");
  }
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  let res;
  try {
    res = await axios.get(url);
  } catch (err) {
    throw new Error("Failed to connect to geocoding service");
  }
  if (!res.data || !Array.isArray(res.data.results)) {
    throw new Error("Unexpected response from geocoding service");
  }
  if (res.data.status === "ZERO_RESULTS") {
    throw new Error("No results found for the provided address");
  }
  if (res.data.status !== "OK") {
    throw new Error(`Geocoding error: ${res.data.status}`);
  }
  const location = res.data.results[0]?.geometry?.location;
  if (
    !location ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number"
  ) {
    throw new Error("Location not found");
  }
  return location;
};

// Calculate distance between two coordinates using Haversine formula
exports.calculateDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};
