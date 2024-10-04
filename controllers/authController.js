const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User Registration
const signup = async (req, res) => {
  const { username, email, password, mobile } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile,
    });
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set JWT token in an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id,pw:password }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set JWT token in an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({token,  message: "Login successful" });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { signup, login };
