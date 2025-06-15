const mongoose = require('mongoose');

const LeaveApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: ['Sick', 'Personal', 'Emergency', 'Other']
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    }, 
    description: {
        type: String, 
        required: true,
        trim: true
    }
    // reviewedBy: {// not necessary right now. useful later on when application is reviewed .
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Staff'
    // },
}, {
    timestamps: true,
});

module.exports = mongoose.model('LeaveApplication', LeaveApplicationSchema);