const  mongoose  = require('mongoose');
const chatMessageSchema = require('./chatmessage'); // Import the chatMessageSchema from the chatMessage.js file

// Define the Order schema
const orderSchema = new mongoose.Schema({
  day: {
    type: String,

  },
  amount: {
    type: Number,
  },
  status:{
    type: String,
  },
  paidAmount:{
    type: Number,
  },
  paypalOrderId: {
    type: String,
    default: null, // You can set a default value if needed
  },
  paymentMethod: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  preparationTime: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  isRinged: {
    type: Boolean,
    default:false
  },
  isRingMuted: {
    type: Boolean,
    default: false, // Initially, the ring is not muted
  },
  isRiderRinged: {
    type: Boolean,
    default:false
  },
  isPickedUp: {
    type: Boolean,
    //default: false,
  },
  addons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'addons',
    },
  ],
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'reviews',
    },
    chatMessages: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'ChatMessages',
    },
    restaurant:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'restaurants'
    },

    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "foods",
        },
        quantity: {
          type: Number,
          required: true,
        },
        variation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "variations", // Define the name of your variations model
        },
        addons: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "addons", // Define the name of your addons model
        }],
      },
    ],
    totalPrice: {
      type: Number,
      
    },
    deliveryAddress: {
      location: {
        type: {
          type: String, // GeoJSON type (Point)
          enum: ['Point'], // Only 'Point' type is allowed
          required: true,
        },
        coordinates: {
          type: [Number], // Array of two numbers: [longitude, latitude]
          required: true,
          index: '2dsphere', // Create a 2dsphere index for geospatial queries
        },
      },
    },
    address: {
      type: mongoose.Schema.Types.Mixed, // Allow mixed types (strings, objects, etc.)
      required: true,
    },
    chatMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'ChatMessage',
      },
    ],
    deliveryCharges: {
      type: Number,
    },
    tipping: {
      type: Number,
    },
    taxationAmount: {
      type: Number,
    },
    completionTime: {
      type: String,
    },
    assignedAt: {
      type: String,
    },
    deliveredAt:{
      type: String,
    },
    acceptedAt:{
      type: String,
    },
    pickedAt:{
      type: String,
    },
    reason: {
      type: String,
    
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
    },
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "zone",
    },
    orderId: {
      type: String,
    },
    orderDate: {
      type: Date,
    },
    orderAmount: {
      type: Number,
    },
    cancelledAt:{
      type: String,
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "ASSIGNED","PICKED","DELIVERED","CANCELLED"],
      default: "PENDING",
    },
  },{
    timestamps:true,
  });
  const Order = mongoose.model("orders", orderSchema);

  // Export the models
  module.exports = Order;  