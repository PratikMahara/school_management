const mongoose = require("mongoose");

const entrance = new mongoose.Schema({
    name: { type: String, require: true },
    address: { type: String, require: true },
    phoneno: { type: String, require: true, unique: true },
    email: { type: String, required: true, },
    classId: { type: Number, required: true },
    preschool: { type: String, required: true }
});

module.exports = mongoose.model("Entrance" , entrance);