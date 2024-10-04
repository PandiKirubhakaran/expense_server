const express = require('express');
const { addCapital, getDashboardData } = require('../controllers/dashboardController.js');
const auth = require('../middlewares/auth.js');

const router = express.Router();

// POST /api/capital - Add capital
router.post('/capital', auth, addCapital);

// GET /api/dashboard?month=9&year=2024 - Get dashboard data for a specific month and year
router.get('/dashboard', auth, getDashboardData);

module.exports = router;
