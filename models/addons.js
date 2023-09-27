const mongoose = require ('mongoose');

const addonsSchema = new mongoose.Schema({
  title: {
    type: String,
 
  },
  price: {
    type: Number,
 
  },
  description: {
    type: String,
  },
  quantityMinimum: {
    type: Number,
  },
  quantityMaximum: {
    type: Number,
  },
  options: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'options'
  },]
  // Add any other fields specific to addons
});
const Addon = mongoose.model('addons', addonsSchema);

module.exports = Addon;