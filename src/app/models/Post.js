const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema(
  {
    title: { type: String, require: true },
    text: { type: String, require: true },
    authorId: { type: String, require: true },
    authorName: { type: String, require: true },
    liked: [
      {
        accountId: { type: String },
      },
    ],
    likedCount: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', Post);
