const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
