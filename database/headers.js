const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
    header1 : String ,
    header2:  String ,
    header3 : String ,
    header4 : String
},{collection:'headers'}) ;

const Headers = mongoose.model('headers',headerSchema);

module.exports = Headers;