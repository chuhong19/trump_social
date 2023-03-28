const Account = require('../models/Account');
const Post = require('../models/Post');
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');

class PostController {
  like(req, res, next) {
    const myId = req.session.userId;
    Post.updateOne(
      {
        _id: req.params.id,
        liked: { $not: { $elemMatch: { accountId: myId } } },
      },
      {
        $push: {
          liked: { accountId: myId },
        },
        $inc: {
          likedCount: 1,
        }
      } 
    )
    .then(() => {
      res.redirect('back')
    })
    .catch(next);
  }
}

module.exports = new PostController();
