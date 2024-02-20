const mongoose = require('mongoose');
const adminschema = new mongoose.Schema({
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

const Admin = mongoose.model("admins",adminschema);
module.exports = Admin