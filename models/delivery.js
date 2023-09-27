const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryBounds: {
    type: {coordinates: [[[Number]]]}
  },
  location: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'location'
}
]
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
