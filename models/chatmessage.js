const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add a virtual property for formatted createdAt date
chatMessageSchema.virtual('formattedCreatedAt').get(function () {
  return new Date(this.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
