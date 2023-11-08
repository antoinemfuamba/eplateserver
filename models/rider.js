const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const JwtConfig = require("../config/config.json").development;
const riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,

  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notificationToken: {
    type: String,
  },
  riderId: {
    type: String,
  
  },
  token: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  zone:
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'zone',
  },

  phone: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
 
  },
  location: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'locat',
  },
  accountNumber: {
    type: String,
  },
  currentWalletAmount: {
    type: Number,
    default: 0,
  },
  totalWalletAmount: {
    type: Number,
    default: 0,
  },
  withdrawnWalletAmount: {
    type: Number,
    default: 0,
  },
});

riderSchema.pre('save', async function (next) {
  const rider = this;

  if (rider.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    rider.password = await bcrypt.hash(rider.password, salt);
  }
  if (!rider.token) {
    const token = jwt.sign({ id: rider.id }, JwtConfig.JWT_SECRET, { expiresIn: '2h' });
    rider.token = token;
  }

  next();
});

const Rider = mongoose.model('rider', riderSchema);

module.exports = Rider;
