const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    title: { type: String, require: true },
    text: { type: String, require: true },
    authorId: { type: String, require: true }
},
{
    timestamps: true
},
  );

module.exports = mongoose.model('Post', Post);