/* 
const  mongoose  = require('mongoose');
// Define the Vendor schema
const addressesSchema = new mongoose.Schema({
    location: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'location',
        },
      ],
    deliveryAddress: {
        type: String,
        
    }

  });

const Addresses = mongoose.model("address", addressesSchema);

// Export the models
module.exports = Addresses;*/

const  mongoose  = require('mongoose');
// Define the Vendor schema
const addressesSchema = new mongoose.Schema({
  location: {
    coordinates: [Number], // Change type to Number for coordinates
},
      
    deliveryAddress: {
        type: String,
        
    },
    selected: {
      type: Boolean,
      default: false,
    },
    details: {
      type: String,
    },
    label: {
      type: String,
    },
  });

const Addresses = mongoose.model("address", addressesSchema);

// Export the models
module.exports = Addresses;