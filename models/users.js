/*
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const JwtConfig = require("../config/config.json").development;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  emailIsVerified: {
    type: String,
   
  },
  appleId: {
    type: String,
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'addresses',
    },
  ],

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
    },
  ],
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
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

const User = mongoose.model('users', userSchema);

module.exports = User;
*/

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const JwtConfig = require("../config/config.json").development;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  notificationToken: {
    type: String,
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
    type: Boolean,
    
  },
  chatMessages: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'ChatMessage',
  },
  emailIsVerified: {
    type: Boolean,
   
  },
  appleId: {
    type: String,
  },
  isOrderNofication: {
    type: Boolean,
  },
  isOfferNofication: {
    type: Boolean,
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'addresses',
    },
  ],

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
    },
  ],
  favourite: [    
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurants',
      },
  ],
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  if (!user.token) {
    const token = jwt.sign({ userId: user.id }, JwtConfig.JWT_SECRET, { expiresIn: '2h' });
    user.token = token;
  }

  next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;
