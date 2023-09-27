const  mongoose  = require('mongoose');
// Define the Vendor schema
const offerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    tag: {
        type: String,
        
    },
    restaurants: {
        /*type: String,*/
        type: mongoose.Schema.Types.ObjectId,
        ref:'restaurants',
    }

  });

const Offer = mongoose.model("offers", offerSchema);

// Export the models
module.exports = Offer;