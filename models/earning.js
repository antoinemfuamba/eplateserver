const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  deliveryTime: {
    type: Date,
    required: true
  }
});

const Earning = mongoose.model('Earning', earningSchema);

module.exports = Earning;
