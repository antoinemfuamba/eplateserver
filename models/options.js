const  mongoose  = require('mongoose');
// Define the Vendor schema
const optionsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    
  });

const Option = mongoose.model("options", optionsSchema);

// Export the models
module.exports = Option;