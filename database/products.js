const mongoose = require('mongoose');

// Define the schema for the "Product" collection
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories', // Reference to the "Category" collection
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collections', // Reference to the "Collection" collection
  },
  colors: [
    {
      name: String,
      sizes: [
        {
          size: String,
          inStock: Number,
        },
      ],
      frontImage: [String],
      backImage: [String],
    },
  ],
  thumbnail : String ,
  description : String ,
  price: Number,
  discount: Number,
  type : String,
  order : {
    type:Number,
    default : 0
  },
  date: {
    type:Date,
    default: function(){
      const date = new Date();
      return date ;
    }
  }
},
{collection:'products'});

// Create a model for the "Product" collection
const Product = mongoose.model('products', productSchema);

module.exports = Product;
