const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  promotionCode: {
    type: String,
    required: true,
    unique: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  associatedProducts: {
    type: [String],
    required: true
  }
},{
    timestamps:true,
  });

const Promotion = mongoose.model('promotions', promotionSchema);

module.exports = Promotion;
