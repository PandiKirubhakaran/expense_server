const Capital = require('../models/Dashboard.js'); // Update path if necessary
const Expense = require('../models/Expense.js'); // Ensure the Expense model is imported

// Add capital and accumulate it
const addCapital = async (req, res) => {
  const { amount, description } = req.body;
  try {
    // Validate the input
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Find existing capital entry for the user
    let capitalEntry = await Capital.findOne({ user: req.user._id });

    if (capitalEntry) {
      // Add new capital to existing amount
      capitalEntry.amount += parseFloat(amount);
      capitalEntry.capitalLogs.push({
        amount: parseFloat(amount),
        description,
        date: new Date(),
      });
    } else {
      // Create a new capital entry if none exists
      capitalEntry = new Capital({
        user: req.user._id,
        amount: parseFloat(amount),
        capitalLogs: [
          {
            amount: parseFloat(amount),
            description,
            date: new Date(),
          },
        ],
      });
    }

    // Save the updated or new capital entry
    await capitalEntry.save();

    res.json({ capital: capitalEntry.amount, logs: capitalEntry.capitalLogs });
  } catch (error) {
    console.error('Error adding capital:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard data for a specific month and year
const getDashboardData = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validate the month and year
    if (!month || !year || isNaN(month) || isNaN(year)) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    // Fetch capital for the user (assume it's a single entry for now)
    const capitalEntry = await Capital.findOne({ user: req.user._id });

    // Fetch expenses for the current month
    const expenses = await Expense.find({
      user: req.user._id,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    const dailyExpenses = {};
    const monthlyExpenses = expenses.reduce((sum, exp) => {
      const day = exp.date.getDate();
      dailyExpenses[day] = (dailyExpenses[day] || 0) + exp.amount;
      return sum + exp.amount;
    }, 0);

    const totalCapital = capitalEntry ? capitalEntry.amount : 0;
    const capitalLogs = capitalEntry ? capitalEntry.capitalLogs : [];

    res.json({
      totalCapital,
      totalExpenses: monthlyExpenses,
      dailyExpenses,
      capitalLogs,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

module.exports = {
  addCapital,
  getDashboardData,
};
