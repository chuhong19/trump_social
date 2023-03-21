const Account = require('../models/Account');
const Post = require('../models/Post');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');

class AccountController {
  register(req, res, next) {
    res.render('accounts/register');
  }

  confirmRegister(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var retypepassword = req.body.retypepassword;
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
          var token = jwt.sign({ _id: data._id }, 'mk');
          res.cookie('token', token);
          res.redirect('/welcome');
        } else {
          res.json('Wrong username or password');
        }
      })
      .catch((err) => res.json('Server error: ' + err));
  }

  create(req, res, next) {
    res.render('posts/create');
  }

  store(req, res, next) {
    var token = req.cookies.token;
    var authorId = jwt.verify(token, 'mk');
    Account.findById(authorId)
      .then((author) => {
        let authorName = author.fullname;
        const post = new Post(req.body);
        post.authorId = authorId;
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

  logout(req, res, next) {
    res.clearCookie('token');
    res.redirect('/');
  }

  editprofile(req, res, next) {
    const token = req.cookies.token;
    const myId = jwt.verify(token, 'mk')._id;
    Account.findById(myId)
      .then((user) => {
        console.log(user);
        res.render('editprofile', {
          user: mongooseToObject(user),
        });
      })
      .catch(next);
  }

  confirmeditprofile(req, res, next) {
    var id = jwt.verify(req.cookies.token, 'mk');
    Account.updateOne({ _id: id }, req.body)
      .then(() => res.redirect('/wall'))
      .catch(next);
  }
}

module.exports = new AccountController();
