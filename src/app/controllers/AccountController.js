const Account = require('../models/Account');
const Post = require('../models/Post');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');

class AccountController {
  register(req, res, next) {
    res.render('accounts/register');
  }

  confirmRegister(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const retypepassword = req.body.retypepassword;
    if (
      !username ||
      !password ||
      !retypepassword ||
      password !== retypepassword
    ) {
      res.json('Failed to register');
      return;
    }
    Account.findOne({ username: username })
      .then((data) => {
        if (!data) {
          const account = new Account(req.body);
          account
            .save()
            .then(() => res.redirect('/home'))
            .catch(next);
        } else {
          res.json('Username already registered');
        }
      })
      .catch((err) => {
        res.json('Server error: ' + err);
      });
  }

  confirmLogin(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    Account.findOne({ username, password })
      .then((data) => {
        if (data) {
          const token = jwt.sign({ _id: data._id }, 'mk');
          res.cookie('token', token);
          const userId = jwt.verify(token, 'mk')._id;
          req.session.userId = userId;
          res.redirect('/welcome');
        } else {
          res.json('Wrong username or password');
        }
      })
      .catch((err) => res.json('Server error: ' + err));
  }

  createPost(req, res, next) {
    res.render('posts/create');
  }

  storePost(req, res, next) {
    const userId = req.session.userId;
    Account.findById(userId)
      .then((author) => {
        const authorName = author.fullname;
        const post = new Post(req.body);
        post.authorId = userId;
        post.authorName = authorName;
        return post.save();
      })
      .then(() => {
        res.redirect('/welcome');
      })
      .catch((err) => {
        res.json(err);
      });
  }

  editPost(req, res, next) {
    Post.findById(req.params.id)
      .then(post => res.render('posts/edit', {
        post: mongooseToObject(post)
      }))
      .catch(next);
  }

  updatePost(req, res, next) {
    Post.updateOne({_id: req.params.id}, req.body)
      .then(() => res.redirect('/welcome'))
      .catch(next);
  }

  deletePost(req, res, next) {
    Post.deleteOne({_id: req.params.id})
      .then(() => res.redirect('/wall'))
      .catch(next);
  }

  logout(req, res, next) {
    res.clearCookie('token');
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  }

  editprofile(req, res, next) {
    const userId = req.session.userId;
    Account.findById(userId)
      .then((user) => {
        res.render('editprofile', {
          user: mongooseToObject(user),
        });
      })
      .catch(next);
  }

  confirmeditprofile(req, res, next) {
    const userId = req.session.userId;
    Account.updateOne({ _id: userId }, req.body)
      .then(() => res.redirect('/wall'))
      .catch(next);
  }
}

module.exports = new AccountController();
