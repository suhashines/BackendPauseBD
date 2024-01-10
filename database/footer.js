const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
    email: String, 
    phone: String,
    facebook : String ,
    twitter : String,
    instagram : String
},{collection:'footers'});

const Footers = mongoose.model('footers',footerSchema);

module.exports = Footers;