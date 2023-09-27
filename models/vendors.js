const  mongoose  = require('mongoose');
// Define the Vendor schema
const vendorSchema = new mongoose.Schema({
    name: {
      type: String,
      
    },
    usename: {
      type: String,
      
    },
    password: {
      type: String,
      
    },
    orderId: {
      type: String,
      
    },
    userType: {
      type: String,
      default: 'VENDOR',
    },
    orderPrefix: {
      type: String,
     
    },
    sections:  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sections",
      },
    ],
    offers:  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "offers",
      },
    ],
    slug: {
      type: String,
      
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      
    },
    location: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location",
      },
    ],
    address: {
      type: String,
      
    },
    deliveryTime: {
      type: String,
      
    },
    minimumOrder: {
      type: String,
     
    },
    tax: {
      type: String,
    },
    reviewData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviewData",
      },
    ],
    categories: [
      {
        type: String,
        ref: "categories",
      },
    ],
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "options",
      },
    ],
    addons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addons",
      },
    ],
    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
      },
    ],
    zone:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zone",
      },
    ],
    rating: {
      type: String,
      
    },
    isAvailable: {
      type: Boolean,
      
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    openingTimes:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "openingTimes",
      },
    ],

  },{
    timestamps:true,
  });

const Vendor = mongoose.model("vendors", vendorSchema);

// Export the models
module.exports = Vendor;