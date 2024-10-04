// routes/expenseRoutes.js
const express = require('express');
const { getExpenses, addExpense } = require('../controllers/expenseController.js');
const auth = require('../middlewares/auth.js');
const router = express.Router();

// Fetch expenses for a given date
router.get('/expenses/:date', auth, getExpenses); // Apply auth middleware

// Add expense for a specific date
router.post('/expenses', auth, addExpense); // Apply auth middleware

module.exports = router;
