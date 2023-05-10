const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Image = new Schema(
  {
    cloudinaryId: String,
    imageUrl: String,
    avatarOf: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', Image);
