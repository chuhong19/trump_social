const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Account = new Schema(
  {
    username: { type: String, require: true },
    password: { type: String, require: true },
    fullname: { type: String },
    age: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String },
    friendrequest: [
      { accountId: { type: String }, fullname: { type: String } },
    ],
    friendreceived: [
      { accountId: { type: String }, fullname: { type: String } },
    ],
    friendlist: [{ accountId: { type: String }, fullname: { type: String } }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Account', Account);
