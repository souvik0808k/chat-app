const { Server } = require("socket.io");

let io;
const onlineUsers = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // change to frontend URL in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`👤 User joined: ${userId} -> Socket: ${socket.id}`);
      console.log(`📊 Online users: ${onlineUsers.size}`);
    });

    socket.on("disconnect", () => {
      for (const [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(`👋 User left: ${key}`);
          break;
        }
      }
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
  onlineUsers
};
