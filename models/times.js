const  mongoose  = require('mongoose');
// Define the Vendor schema
const TimesSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  });

const Times = mongoose.model("times", TimesSchema);

// Export the models
module.exports = Times;