const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'unread'],
    required: true
  }
},{
    timestamps:true,
  });

const Notification = mongoose.model('notifications', notificationSchema);

module.exports = Notification;
