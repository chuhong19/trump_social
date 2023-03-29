const Post = require('../models/Post');
const Account = require('../models/Account');
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const { comment } = require('./PostController');

class SiteController {
  index(req, res, next) {
    res.render('home');
  }

  welcome(req, res, next) {
    Post.find({})
      .populate('comments')
      .then((posts) => {
        res.render('welcome', {
          posts: mutipleMongooseToObject(posts),
        });
      });
  }

  info(req, res, next) {
    res.render('info');
  }

  wall(req, res, next) {
    const userId = req.session.userId;
    Account.findOne({ _id: userId })
      .then((account) => {
        Post.find({ authorId: userId }).then((posts) => {
          res.render('wall', {
            posts: mutipleMongooseToObject(posts),
            account: mongooseToObject(account),
          });
        });
      })
      .catch();
  }

  profile(req, res, next) {
    const userId = req.session.userId;
    Account.findOne({ _id: userId }).then((data) => {
      data: mongooseToObject(data);
      res.render('profile', {
        data: mongooseToObject(data),
      });
    });
  }
}

module.exports = new SiteController();
