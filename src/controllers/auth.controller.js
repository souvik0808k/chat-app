const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Sign up a new user
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: "Email and password are required" 
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ 
      success: false,
      error: "User already exists with this email" 
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name: name || email.split("@")[0],
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );

  res.status(201).json({
    success: true,
    message: "User created successfully",
    userId: user._id,
    name: user.name,
    email: user.email,
    token,
  });
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: "Email and password are required" 
    });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ 
      success: false,
      error: "Invalid credentials" 
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ 
      success: false,
      error: "Invalid credentials" 
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );

  // Update last seen
  user.lastSeen = Date.now();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Login successful",
    userId: user._id,
    name: user.name,
    email: user.email,
    token,
  });
});

// Get all users (for listing in chat)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// Get user by ID
exports.getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ 
      success: false,
      error: "User not found" 
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});
