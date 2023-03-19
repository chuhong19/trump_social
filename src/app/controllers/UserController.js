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
        console.log(myId);
        console.log(req.params.id);
        Account.updateOne({authorId: myId}, { $push: {friendlist: req.params.id}})
            .then(res.json('Success'))
            .catch(next);
    }
}

module.exports = new UserController();
