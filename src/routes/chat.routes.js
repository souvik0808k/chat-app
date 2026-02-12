const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");

// Send a message
router.post("/send", chatController.sendMessage);

// Get messages of a thread
router.get("/thread/:threadId", chatController.getMessages);

// Get all threads for a user
router.get("/threads/:userId", chatController.getThreads);

module.exports = router;
