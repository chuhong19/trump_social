const Account = require('../models/Account');
const Post = require('../models/Post');
const { mongooseToObject } = require('../../util/mongoose');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

class AccountController {
  register(req, res, next) {
    res.render('accounts/register');
  }

  async confirmRegister(req, res, next) {
    const { username, password, retypepassword } = req.body;
    const hashedPassword = await argon2.hash(password);
    //const hashedRetypePassword = await argon2.hash(retypepassword);
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
          const account = new Account({
            username,
            password: hashedPassword,
          });
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

  async confirmLogin(req, res, next) {
    const { username, password } = req.body;
    try {
      const user = await Account.findOne({ username });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect username or password' });

      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect username or password' });

      // Success
      const token = jwt.sign({ _id: user._id }, 'mk');
      res.cookie('token', token);
      const userId = jwt.verify(token, 'mk')._id;
      req.session.userId = userId;
      res.redirect('/welcome');
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
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
      .then((post) =>
        res.render('posts/edit', {
          post: mongooseToObject(post),
        })
      )
      .catch(next);
  }

  updatePost(req, res, next) {
    Post.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/welcome'))
      .catch(next);
  }

  deletePost(req, res, next) {
    Post.deleteOne({ _id: req.params.id })
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

  editProfile(req, res, next) {
    const userId = req.session.userId;
    Account.findById(userId)
      .then((user) => {
        res.render('editprofile', {
          user: mongooseToObject(user),
        });
      })
      .catch(next);
  }

  confirmEditProfile(req, res, next) {
    const userId = req.session.userId;
    Account.updateOne({ _id: userId }, req.body)
      .then(() => res.redirect('/wall'))
      .catch(next);
  }
}

module.exports = new AccountController();
