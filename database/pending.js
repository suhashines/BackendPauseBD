const mongoose = require('mongoose');


const pendingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  inDhaka: {
    type: Boolean,
    required: true,
  },
  district: {
    type: String,
    required: function () {
      return !this.inDhaka;
    },
  },
  transactionId: {
    type: String,
    required: true
  },
  thana: {
    type: String,
    required: true,
  },
  road: {
    type: String,
    required: true,
  },
  building: {
    type: String,
    required: true,
  },
  otherDetails: {
    type: String,
  },
  date: {
    type:Date,
    default: function(){
      date = new Date();
      return date;
    }
  },

  cart: [
    {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },
    size: String,
    color: String,
    quantity: Number
  }  ],
  
  isDelivered : {
    type:Boolean,
    default: false
  }

}, { collection: 'pending' });

const Pending = mongoose.model('pending', pendingSchema);

module.exports = Pending;
