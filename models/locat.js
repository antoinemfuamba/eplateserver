const  mongoose  = require('mongoose');
// Define the Vendor schema
const LocatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
   
  },
  coordinates:{
    type: [Number],
  }
    
 
  });

const Locat = mongoose.model('locat', LocatSchema);

// Export the models
module.exports = Locat;