const Post = require('../models/Post');
const Account = require('../models/Account');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');

class SiteController {

    index (req, res, next) {
        res.render('home');      
    }

    welcome (req, res, next) {
        Post.find({})
            .then(posts => {
                res.render('welcome', {
                    posts: mutipleMongooseToObject(posts)
                });
            })
    }

    info (req, res, next) {
        res.render('info');
    }

    wall (req, res, next) {
        var id = jwt.verify(req.cookies.token, 'mk');
        Account.findOne({_id: id})
            .then(account => {
                Post.find({authorId: id})
                    .then(posts => {
                        res.render('wall', {
                            posts: mutipleMongooseToObject(posts),
                            account: mongooseToObject(account)
                    });
                })
            })
            .catch ();
        
    }

    profile (req, res, next) {
        var id = jwt.verify(req.cookies.token, 'mk');
        Account.findOne({_id: id})
            .then(data => {
                data: mongooseToObject(data)
                res.render('profile', {
                    data: mongooseToObject(data)
                });
            })
    }

    confirmeditprofile (req, res, next) {
        res.json('abc');
    }
}

module.exports = new SiteController();
