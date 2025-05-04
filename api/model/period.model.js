const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  file: {
      type: String,
      required: true,
  },
  class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
  },
  uploadedAt: {
      type: Date,
      default: Date.now,
  },
});

module.exports = mongoose.model('Period', periodSchema);
