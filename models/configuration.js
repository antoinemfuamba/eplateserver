const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema(
  {
    email: {
        type: String,
    },
    configuration_id: {
        type: String,
      },
    emailName: {
        type: String,
    },
    password: {
        type: String,

    },
    enableEmail: {
        type: Boolean,
    },

    clientId: {
        type: String,
    },

    clientSecret: {
        type: String,
    },

    sandbox: {
        type: Boolean,
    },

    publishableKey: {
        type: String,
    },

    secretKey: {
        type: String,
    },

    currency: {
      type: String,
    
    },

    currencySymbol: {
      type: String,
     
    },

    deliveryRate: {
        type: Number,
        
    }
  }
);

const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;
