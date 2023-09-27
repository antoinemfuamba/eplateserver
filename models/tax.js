const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  taxationCharges: {
    type: Number,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
  },
});

const Tax = mongoose.model('Tax', taxSchema);

module.exports = Tax;
