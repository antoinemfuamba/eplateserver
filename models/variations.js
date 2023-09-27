/*
const  mongoose  = require('mongoose');
// Define the Vendor schema
const variationsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discounted: {
      type: Number,
      default:0,
    },
    addons: [ String],

  },{
    timestamps:true,
  });

const Variations = mongoose.model("variations", variationsSchema);

// Export the models
module.exports = Variations;*/
const  mongoose  = require('mongoose');
// Define the Vendor schema
const variationsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discounted: {
      type: Number,
      default:0,
    },
    addons: [ {
      type: String,
      
    }],
    options: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "options",
    }],
  },{
    timestamps:true,
  });

const Variations = mongoose.model("variations", variationsSchema);

// Export the models
module.exports = Variations;