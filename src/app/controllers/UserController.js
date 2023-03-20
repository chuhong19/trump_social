const Account = require('../models/Account');
const Post = require('../models/Post');
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');

class UserController {
  viewUser(req, res, next) {
    var token = req.cookies.token;
    var myId = jwt.verify(token, 'mk')._id;
    Post.find({ authorId: req.params.id })
      .then((post) => {
        res.render('users/viewuser', { post: mutipleMongooseToObject(post) });
      })
      .catch(next);
  }

  async addFriendUser(req, res, next) {
    try {
      const token = req.cookies.token;
      const myId = jwt.verify(token, 'mk')._id;
      const yourId = req.params.id;
  
      const myAccount = await Account.findById(myId);
      const myFullname = myAccount.fullname;
  
      const yourAccount = await Account.findById(yourId);
      const yourFullname = yourAccount.fullname;
  
      const promises = [
        Account.updateOne(
          { _id: myId },
          { $push: { friendrequest: { accountId: yourId, fullname: yourFullname } } }
        ),
        Account.updateOne(
          { _id: yourId },
          { $push: { friendreceived: { accountId: myId, fullname: myFullname } } }
        ),
      ];
  
      await Promise.all(promises);
      res.json('Success');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  showReceivedFriendRequest(req, res, next) {
    var token = req.cookies.token;
    var myId = jwt.verify(token, 'mk')._id;
    Account.findOne({ _id: myId })
      .then((user) => {
        let friendreceived = user.friendreceived;
        res.render('users/received', {
          friendreceived: mongooseToObject(friendreceived),
        });
      })
      .catch(next);
  }

  acceptRequest(req, res, next) {
    var token = req.cookies.token;
    var myId = jwt.verify(token, 'mk')._id;
    let a = Account.updateOne(
      { _id: myId },
      { $push: { friendlist: req.params.id } }
    );
    let b = Account.updateOne(
      { _id: myId },
      { $pull: { friendreceived: req.params.id } }
    );
    let c = Account.updateOne(
      { _id: req.params.id },
      { $push: { friendlist: myId } }
    );
    let d = Account.updateOne(
      { _id: req.params.id },
      { $pull: { friendrequest: myId } }
    );
    Promise.all([a, b, c, d]).then(res.json('Success')).catch(next);
  }

  declineRequest(req, res, next) {
    let a = Account.updateOne(
      { _id: myId },
      { $pull: { friendreceived: req.params.id } }
    );
    let b = Account.updateOne(
      { _id: req.params.id },
      { $pull: { friendrequest: myId } }
    );
    Promise.all([a, b]).then(res.json('Decline')).catch(next);
  }

  showFriendList(req, res, next) {
    var token = req.cookies.token;
    var myId = jwt.verify(token, 'mk')._id;
    Account.find({ _id: myId })
      .then((user) => {
        var friends = user[0].friendlist;
        res.render('users/friends', { friends: mongooseToObject(friends) });
      })
      .catch(next);
  }
}

module.exports = new UserController();
