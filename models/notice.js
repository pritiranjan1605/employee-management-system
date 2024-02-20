const mongoose = require('mongoose');
const noticeschema = new mongoose.Schema({
    heading:{
        type:String
    },
    body:{
        type:String
    }
},{timestamps:true})

const Notice = mongoose.model("notices",noticeschema);
module.exports = Notice