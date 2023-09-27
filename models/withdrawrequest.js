const mongoose = require('mongoose');

const withdrawRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  requestTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rider',
    required: true
  }
});

const WithdrawRequest = mongoose.model('WithdrawRequest', withdrawRequestSchema);

module.exports = WithdrawRequest;
