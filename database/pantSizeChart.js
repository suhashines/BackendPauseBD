const mongoose = require('mongoose');


const pantSizeChartSchema = new mongoose.Schema({

size : {
    type : String ,
    required : true,
    unique : true
} ,

waist : {
    type : Number ,
    required : true
} ,

outseam : {
    type : Number ,
    required : true
} ,

inseam : {
    type : Number ,
    required : true
}

},
 {collection: 'pantSizeChart'}   )


const pantSizeChart = mongoose.model('pantSizeChart',pantSizeChartSchema);


module.exports = pantSizeChart ;