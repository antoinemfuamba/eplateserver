const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    
  },
  coordinates: [[[Number]]]
});
const Coordinates = mongoose.model('coordinates', coordinatesSchema);

module.exports = Coordinates;
