const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
  },
});

const Coupon = mongoose.model('coupons', couponSchema);

module.exports = Coupon;
