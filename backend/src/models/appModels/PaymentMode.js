const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PaymentMode', paymentModeSchema);
