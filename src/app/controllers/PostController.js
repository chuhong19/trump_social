const Account = require('../models/Account');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
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
        },
      }
    )
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }

  comment(req, res, next) {
    const postId = req.params.id;
    const accountId = req.session.userId;
    const encodedCommentContent = req.query.content;
    const commentContent = decodeURIComponent(encodedCommentContent);

    Account.findById(accountId)
      .then((account) => {
        const accountName = account.fullname;
        const comment = new Comment({
          postId,
          accountId,
          accountName,
          commentContent,
        });
        return comment.save();
      })
      .then((comment) => {
        return Post.findByIdAndUpdate(postId, {
          $push: {
            comments: comment._id,
          },
          $inc: {
            commentsCount: 1,
          },
        });
      })
      .then(() => res.redirect('/welcome'))
      .catch(next);
  }
}

module.exports = new PostController();
