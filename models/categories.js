const  mongoose  = require('mongoose');
// Define the Vendor schema
const categoriesSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true,
    },
    foods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foods",
      },
    ],
  },{
      timestamps:true,
    });

const Category = mongoose.model("categories", categoriesSchema);

// Export the models
module.exports = Category;