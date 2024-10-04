const Expense = require('../models/Expense');

// Fetch expenses for a given date
const getExpenses = async (req, res) => {
  const { date } = req.params;
  try {
    const expenses = await Expense.find({ date: date, user: req.user.id }); // Assuming user is authenticated
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ expenses, total });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

// Add expense for a specific date
const addExpense = async (req, res) => {
  const { date, amount, description } = req.body;
  try {
    const newExpense = new Expense({
      user: req.user._id, // Assuming you have the user attached to req from authentication middleware
      date,
      amount: parseFloat(amount),
      description,
    });
    
    await newExpense.save(); // Save the new expense to the database
    
    // Fetch the updated list of expenses for that date
    const expenses = await Expense.find({ date });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    res.json({ expense: newExpense, total });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExpenses,
  addExpense,
};
