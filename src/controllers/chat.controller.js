const Chat = require("../models/chat.model");
const Thread = require("../models/thread.model");
const asyncHandler = require("../utils/asyncHandler");
const { getIO, onlineUsers } = require("../sockets/socket");

// Send a message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { sender, receiver, message } = req.body;

  if (!sender || !receiver || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Find or create thread
  let thread = await Thread.findOne({
    participants: { $all: [sender, receiver] },
  });

  if (!thread) {
    thread = await Thread.create({
      participants: [sender, receiver],
    });
  }

  // Create chat message
  const chat = await Chat.create({
    sender,
    receiver,
    message,
    thread: thread._id,
  });

  // Update thread's last message
  thread.lastMessage = chat._id;
  await thread.save();

  // Emit to receiver if online
  const io = getIO();
  const receiverSocketId = onlineUsers.get(receiver.toString());

  console.log(`📤 Sending message from ${sender} to ${receiver}`);
  console.log(`🔍 Receiver socket ID: ${receiverSocketId}`);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("new_message", {
      message: chat.message,
      sender: chat.sender,
      thread: thread._id,
    });
    console.log(`✅ Message emitted to socket: ${receiverSocketId}`);
  } else {
    console.log(`⚠️ Receiver ${receiver} is not online`);
  }

  res.status(201).json({
    success: true,
    message: chat.message,
    chatId: chat._id,
    threadId: thread._id,
  });
});

// Get messages of a thread
exports.getMessages = asyncHandler(async (req, res) => {
  const { threadId } = req.params;

  const messages = await Chat.find({ thread: threadId })
    .populate("sender", "name")
    .populate("receiver", "name")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});

// Get all threads for a user
exports.getThreads = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const threads = await Thread.find({
    participants: userId,
  })
    .populate("participants", "name email")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: threads.length,
    threads,
  });
});
