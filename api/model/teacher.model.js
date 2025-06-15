const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    email:{ type: String,  required:true },
    name:{type:String, required:true},
    qualification:{type:String, required:true},
    age:{type:String, required:true},
    gender:{type:String, required:true},
    teacher_image:{type:String,  required:false},
    createdAt:{type:Date, default: new Date()},

    password:{type:String, required:true}

})

module.exports = mongoose.model("Teacher", teacherSchema)