const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    school:{type:mongoose.Schema.ObjectId, ref:'School'},
    email:{type:String, required:true},
    name:{type:String, required:true},
    student_class:{type:mongoose.Schema.ObjectId, ref:"Class"},
    age:{type:String, required:true},
    gender:{type:String, required:true},
    guardian:{type:String, required:true},
    guardian_phone:{type:String, required:true},
    student_image:{type:String,  required:true},
    createdAt:{type:Date, default: new Date()},
    password:{type:String, required:true},
    roll:{type:Number, required:true},
    admitCard: {// later on we change the admit card to be a boolean value
    name: { type: String },//so that we can check if the admit card is issued or not without redundancy
    class: { type: String },
    section: { type: String },
    roll: { type: Number },
    exam: { type: String },
    year: { type: Number },
    issuedAt: { type: Date, default: Date.now }
  }

})

module.exports = mongoose.model("Student", studentSchema)
