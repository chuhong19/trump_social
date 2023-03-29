const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    accountId: { type: String, required: true },
    accountName: { type: String, required: true },
    commentContent: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', Comment);
