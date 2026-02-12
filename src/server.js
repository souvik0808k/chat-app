require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const errorMiddleware = require("./middleware/error.middleware");
const { initSocket } = require("./sockets/socket");

const app = express();
const server = http.createServer(app);

// init socket
initSocket(server);

// middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static("public"));
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Chat API Running 🚀");
});

// error middleware (LAST)
app.use(errorMiddleware);

// DB + server start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
});