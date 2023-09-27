/*
const  mongoose  = require('mongoose');
const itemSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    food: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    variation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'variations'
    },
    addons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'addons',
    },
],
  });
  
  const Item = mongoose.model('item', itemSchema);
  
  module.exports = Item;*/

  const  mongoose  = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    food: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isActive: {
        type: Boolean,
    },
    specialInstructions: {
        type: String,
    },
    variation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'variations'
    },
    addons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'addons',
    },],
    reviewData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reviewData', // Make sure it matches the model name for ReviewData
      },
},{
    timestamps:true,
  });
  
  const Item = mongoose.model('items', itemSchema);
  
  module.exports = Item;