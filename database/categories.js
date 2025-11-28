const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true,
        unique : true 

    }
} ,
{collection:'categories'} 
)

const categories = mongoose.model('categories',categorySchema)

module.exports = categories ;