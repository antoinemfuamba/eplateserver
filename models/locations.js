const  mongoose  = require('mongoose');
// Define the Vendor schema
const LocationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
   
  },
  coordinates:{
    type: [[[Number]]],
  }
    
 
  });

const Location = mongoose.model('location', LocationSchema);

// Export the models
module.exports = Location;