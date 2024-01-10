const mongoose = require('mongoose')

const orderChartSchema = new mongoose.Schema({
    insideDhaka: Number,
    outsideDhaka: Number,
    phone : {
        type:String ,
        default: "01625285922"
    }
},
{orderChart:'orderChart'})

const orderChart = mongoose.model('orderChart',orderChartSchema);

module.exports = orderChart ;