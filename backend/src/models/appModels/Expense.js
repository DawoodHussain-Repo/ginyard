const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },

  vendor: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Software & Subscriptions',
      'Marketing',
      'Office Supplies',
      'Travel',
      'Professional Services',
      'Utilities',
      'Equipment',
      'Miscellaneous',
    ],
    default: 'Miscellaneous',
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  notes: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

expenseSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Expense', expenseSchema);
