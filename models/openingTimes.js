const  mongoose  = require('mongoose');
// Define the Vendor schema
const openingTimesSchema = new mongoose.Schema({
    day: {
      type: String,
      enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      required: true
    },

    times: [
        {
          startTime: [String],
          endTime: [String]
        },
      ],
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurants'
    }
  },{
    timestamps:true,
  });

const OpeningTime = mongoose.model("openingTimes", openingTimesSchema);

// Export the models
module.exports = OpeningTime;