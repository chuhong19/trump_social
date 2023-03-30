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
    likedCount: { type: Number, default: 0 },
    commentsCount: { type: Number },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', Post);
