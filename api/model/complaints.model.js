const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaint: {
        type: String,
        required: true,
        trim: true
    },
    media: {
        type: String, // stores the filename of image or video
        required: false,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);