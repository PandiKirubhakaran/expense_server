const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const capitalRoutes = require('./routes/dashboardRoutes');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: 'https://expense-ui-swart.vercel.app', // Make sure this matches exactly with your frontend URL
  credentials: true, // Allow credentials (cookies)
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', expenseRoutes);
app.use('/api', capitalRoutes);

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
