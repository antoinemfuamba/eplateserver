const  mongoose  = require('mongoose');
// Define the Vendor schema
const sectionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
    restaurants:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
      },
    ],

  });

const Section = mongoose.model("sections", sectionSchema);

// Export the models
module.exports = Section;