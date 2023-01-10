const Account = require('../models/Account');
const Post = require('../models/Post');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');

class AccountController {

    register (req, res, next) {
        res.render('accounts/register');
    }

    confirmRegister (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var retypepassword = req.body.retypepassword;
        if (!username || !password || !retypepassword || password!== retypepassword) {
            res.json('Failed to register');
            return;
        }
        Account.findOne({ username: username })
        .then(data=>{
            if (!data) {
                const account = new Account(req.body);
                account.save()
                    .then(() => res.redirect('/home'))
                    .catch(next); 
            } else {
                res.json('Username already registered');
            }
        }).catch(err=>{
            res.json('Server error: ' + err);
        });
    }

    confirmLogin (req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        Account.findOne({username, password})
            .then(data => {
                    if (data) {
                        var token = jwt.sign({_id: data._id}, 'mk');
                        res.cookie('token', token);
                        res.redirect('/welcome');
                    }
                    else {
                        res.json('Wrong username or password');
                    }
                })
            .catch(err => res.json('Server error: ' + err));
    }

    create (req, res, next) {
        res.render('posts/create');
    }

    store (req, res, next) {
        try {
            var token = req.cookies.token;
            var authorId = jwt.verify(token, 'mk');
            const post = new Post(req.body);
            post.authorId = authorId;
            post.save()
                .then(
                    () => res.redirect('/welcome')
                )
                .catch(next);
        } catch (err) {
            res.json('Please login first');
        }
    }

    logout (req, res, next) {
        res.clearCookie('token');
        res.redirect('/');
    }

    editprofile (req, res, next) {
        res.render('editprofile');
    }

    confirmeditprofile (req, res, next) {
        var id = jwt.verify(req.cookies.token, 'mk');
        Account.updateOne({ _id: id }, req.body)
            .then(() => res.redirect('/wall'))
            .catch(next);
    }
}

module.exports = new AccountController();
