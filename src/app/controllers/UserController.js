const Account = require('../models/Account');
const Post = require('../models/Post');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');

class UserController {

    viewUser(req, res, next) {
        var token = req.cookies.token;
        var myId = jwt.verify(token, 'mk')._id;
        Post.find({authorId: req.params.id})
            .then(post => {
                res.render('users/viewuser', {post: mutipleMongooseToObject(post)});   
            })
            .catch(next);
    }

    addFriendUser(req, res, next) {
        var token = req.cookies.token;
        var myId = jwt.verify(token, 'mk')._id;
        Account.findByIdAndUpdate(myId, { $push: {friendlist: req.params.id}})
    }

}

module.exports = new UserController();
