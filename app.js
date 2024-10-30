const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const capitalRoutes = require('./routes/dashboardRoutes');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin:'https://expense-ui-swart.vercel.app/',
  credentials: true, // Allow credentials (cookies)
}));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
// Use routes
app.use('/api', expenseRoutes);
app.use('/api', capitalRoutes);

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
