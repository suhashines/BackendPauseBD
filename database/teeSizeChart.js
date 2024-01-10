const mongoose = require('mongoose');

// Define the schema for the "teeSizeChart" collection
const teeSizeChartSchema = new mongoose.Schema({
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
  }
} , 

  {collection: 'teeSizeChart'}

);

// Create a model for the "teeSizeChart" collection
const TeeSizeChart = mongoose.model('teeSizeChart', teeSizeChartSchema);

module.exports = TeeSizeChart;
