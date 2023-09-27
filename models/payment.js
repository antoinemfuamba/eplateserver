const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentStatus: {
    type: String,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  // Add other fields relevant to your payment model
});

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;
