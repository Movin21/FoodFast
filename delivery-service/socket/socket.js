const { Server } = require("socket.io");

let io;

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinOrderRoom", (orderId) => {
      socket.join(orderId);
      console.log(`Client ${socket.id} joined room: ${orderId}`);
    });

    socket.on("updateDriverLocation", ({ orderId, location, driverId }) => {
      // Broadcast driver location to all clients in the order room
      io.to(orderId).emit("driverLocationUpdated", {
        orderId,
        driverLocation: location,
        driverId,
      });
      console.log(`Driver ${driverId} location updated for order ${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

function emitToRoom(roomId, event, data) {
  if (io) {
    io.to(roomId).emit(event, data);
  }
}

module.exports = { setupSocket, emitToRoom };
