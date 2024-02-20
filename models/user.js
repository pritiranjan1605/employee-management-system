const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
    },
    lname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phoneno:{
        type:Number,
    },
    address:{
        type:String,
    }
},{timestamps:true})

const User = mongoose.model("users",userschema);
module.exports = User