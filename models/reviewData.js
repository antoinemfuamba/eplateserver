const mongoose = require('mongoose');

const reviewDataSchema = new mongoose.Schema({
    total: {
        type: String,
        required: true,
      },
    ratings: {
        type: String,
        required: true,
     },  
    reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "reviews",
        },
      ],    
});

const ReviewData = new mongoose.model("reviewData", reviewDataSchema);

module.exports = ReviewData;