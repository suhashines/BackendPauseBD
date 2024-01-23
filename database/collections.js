const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({

  name : {
    type: String ,
    required : true ,
    unique : true
  } ,
  portrait : {
    type : [String],
    required : true
  },
  landscape : {
    type : [String],
    required : true
  } ,
  date: {
    type:Date,
    default: function(){
      const date = new Date();
      return date ;
    }
  },
  order : {
    type: Number,
    default: 0 
  },
  isFeatured : {
    type: Boolean ,
    default: false
  },
  description:String

},{collection:'collections'},
{ suppressReservedKeysWarning: true }
) 


const collections = mongoose.model('collections',collectionSchema)

module.exports = collections ;