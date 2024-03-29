const mongoose = require('mongoose');

const withdrawRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  requestAmount: {
    type: Number,
    required: true
  },
  requestTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "REQUESTED", "TRANSFERRED","CANCELLED"],
    default: "PENDING",
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rider',
    required: true
  }
});

const WithdrawRequest = mongoose.model('WithdrawRequest', withdrawRequestSchema);

module.exports = WithdrawRequest;
