const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({ 
  email: {
    type: String,
    required: true,
    unique: true, // Assuming each admin should have a unique email
  },
  password: {
    type: String,
    required: true,
  }
}, {collection: 'admins'});

const Admin = mongoose.model('admins', adminSchema);

module.exports = Admin;
