const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

// Middlewares (e.g., logging)
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] → ${req.method} ${req.originalUrl}`
  );
  next();
});

// AUTH Service Proxy
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/",
    },
  })
);

// Placeholder for DELIVERY service
app.use(
  "/api/delivery",
  createProxyMiddleware({
    target: process.env.DELIVERY_SERVICE_URL,
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      "^/api/delivery": "/delivery",
    },
    logLevel: "debug",
  })
);

// Placeholder for PAYMENT service
app.use(
  "/api/payment",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/payment": "/payment",
    },
  })
);
// Placeholder for RESTAURANT service
app.use(
  "/api/restaurant/",
  createProxyMiddleware({
    target: process.env.RESTAURANT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/restaurant/": "/",
    },
  })
);
// Placeholder for ORDER service
app.use(
  "/api/order",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/order": "/",
    },
  })
);
// Placeholder for NOTIFICATION service
app.use(
  "/api/notify",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/notify": "/notify",
    },
  })
);

app.use(
  "/socket",
  createProxyMiddleware({
    target: process.env.DELIVERY_SERVICE_URL,
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      "^/socket": "/socket",
    },
  })
);

// Fallback route
app.use("*", (req, res) => {
  res.status(404).json({ msg: "API not found in gateway" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
