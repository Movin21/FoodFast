const express = require("express");
const router = express.Router();
const controller = require("../controllers/deliveryController");

router.post("/", controller.createDelivery);
router.put("/:orderId/status", controller.updateDeliveryStatus);
router.put("/:orderId/driver-location", controller.updateDriverLocation);
router.get("/:orderId", controller.getDeliveryByOrderId);

module.exports = router;
