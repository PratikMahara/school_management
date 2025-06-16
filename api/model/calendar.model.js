const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Calendar', CalendarSchema);