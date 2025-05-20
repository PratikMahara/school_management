const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    resultpdf: {type: String , required: true},
    result_class: {type:mongoose.Schema.ObjectId, ref:"Class"},
    uploaded_teacher: {type:mongoose.Schema.ObjectId, ref:"Teacher"},
    examtype: {type:mongoose.Schema.ObjectId, ref:"Examination"},
    studentId: {type:mongoose.Schema.ObjectId, ref: "Student"}

});

module.exports = mongoose.model("Result" , resultSchema);

