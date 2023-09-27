const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'item',
  },
});

const Favourite = mongoose.model('favourite', favouriteSchema);

module.exports = Favourite;
