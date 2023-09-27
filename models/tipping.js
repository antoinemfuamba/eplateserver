// tippingModel.js

const mongoose = require('mongoose');

const tippingSchema = new mongoose.Schema({
  tipVariations: {
    type: [Number],
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
  },
});

const Tipping = mongoose.model('tipping', tippingSchema);

module.exports = Tipping;
