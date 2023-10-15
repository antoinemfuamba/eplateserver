const  mongoose  = require('mongoose');
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
  },
  isRiderRinged: {
    type: Boolean,
  },
  isPickedUp: {
    type: Boolean,
    default: false,
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
      ref: "riders",
    },
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "zone",
    },
    orderId: {
      type: String,
    },
    orderDate: {
      type: String,
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