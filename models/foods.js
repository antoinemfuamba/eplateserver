const mongoose = require('mongoose');
// Define the Product schema
const foodSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      
    },
    image: {
      type: String,
    },
    variations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "variations",
      },
    ],
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories'
    },
  ],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurants",
     
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },{
    timestamps:true,
  });

  const Food = mongoose.model("foods", foodSchema);

// Export the models
module.exports = Food;