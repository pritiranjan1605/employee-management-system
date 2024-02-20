const mongoose = require('mongoose');
const issueschema = new mongoose.Schema({
    user:{
        type:String
    },
    issue:{
        type:String
    },
    body:{
        type:String
    }
},{timestamps:true})

const Issue = mongoose.model("issues",issueschema);
module.exports = Issue