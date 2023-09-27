const  mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const JwtConfig = require("../config/config.json").development;
// Define the Vendor schema
const restaurantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    }, 
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    orderId: {
      type: Number,
      default: 1,
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
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    location: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'locat',
      },
    
    address: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: Number,
      
    },
    minimumOrder: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 10,
    },
    salesTax: {
      type: Number,
      
    },
    reviewData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviewData",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
      },
    ],
    deliveryBounds: {
      type: {
        coordinates: [[[Number]]],
    
      },
    },
    
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
    owner: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
      },
    
    zone:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zone",
      },
    
    rating: {
      type: String,

    },

    foods: [
      
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'foods'
        },
        // Other fields related to the food
      
    ],
    commissionRate: {
      type: String,
      
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
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


  restaurantSchema.pre('save', async function (next) {
    const user = this;
  
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    if (!user.token) {
      const token = jwt.sign({ id: user.id }, JwtConfig.JWT_SECRET, { expiresIn: '2h' });
      user.token = token;
    }
  
    next();
  });
const Restaurant = mongoose.model("restaurants", restaurantSchema);

// Export the models
module.exports = Restaurant;