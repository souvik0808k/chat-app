const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// Sign up
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Get all users
router.get("/users", authController.getAllUsers);

// Get user by ID
router.get("/users/:userId", authController.getUserById);

module.exports = router;
