const  mongoose  = require('mongoose');
// Define the Vendor schema
const zoneSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    description: {
        type: String,  
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'location'
    },
  isActive: {
    type: Boolean,
    default: true,
  },
  tax: {
    type: String,
  },

  });

  // Create a 2dsphere compound index on the "location.coordinates" field
zoneSchema.index({ "location.coordinates": "2dsphere" });


const Zone = mongoose.model('zone', zoneSchema);

// Export the models
module.exports = Zone;