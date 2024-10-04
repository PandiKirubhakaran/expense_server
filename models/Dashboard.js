const mongoose = require('mongoose');
const { Schema } = mongoose;

const CapitalLogSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const CapitalSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  capitalLogs: [CapitalLogSchema], 
});

module.exports = mongoose.model('Capital', CapitalSchema);
