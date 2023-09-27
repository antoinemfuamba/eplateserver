const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const JwtConfig = require("../config/config.json").development;
const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: 'ADMIN',
  },

  phone: {
    type: String,
    unique: true,
  },
  token: {
    type: String,

  },
  tokenExpiration: {
    type: String,
  },
  phoneIsVerified: {
    type: String,
    
  },
  restaurants: {
    type: String,
    
  },
  emailIsVerified: {
    type: String,
   
  },
  appleId: {
    type: String,
  },
  address: {
    type: String,
    
  },

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
    },
  ],
}, {
  timestamps: true,
});

ownerSchema.pre('save', async function (next) {
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

const Owner = mongoose.model('owners', ownerSchema);

module.exports = Owner;
