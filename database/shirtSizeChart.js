const mongoose = require('mongoose');

// Define the schema for the "teeSizeChart" collection
const shirtSizeChartSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    unique: true, // Assuming each size should be unique
  },
  width: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  sleeve :{
    type : Number ,
    required: true
  }
} , 

  {collection: 'shirtSizeChart'}

);

// Create a model for the "shirtSizeChart" collection
const shirtSizeChart = mongoose.model('shirtSizeChart', shirtSizeChartSchema);

module.exports = shirtSizeChart;
