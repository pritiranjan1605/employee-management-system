const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    topic: String,
    brief: String,
    fileurl:{
        type:String
    }
},{timestamps:true});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;