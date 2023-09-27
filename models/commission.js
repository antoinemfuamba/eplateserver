const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  commissionRate: {
    type: Number,
    required: true
  }
});

const Commission = mongoose.model('commission', commissionSchema);

module.exports = Commission;
