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
    var authorId = req.params.id;
    Post.find({ authorId: authorId })
      .then((post) => {
        res.render('users/viewuser', {
          post: mutipleMongooseToObject(post),
          authorId,
        });
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
          {
            $push: {
              friendrequest: { accountId: yourId, fullname: yourFullname },
            },
          }
        ),
        Account.updateOne(
          { _id: yourId },
          {
            $push: {
              friendreceived: { accountId: myId, fullname: myFullname },
            },
          }
        ),
      ];

      await Promise.all(promises);
      res.redirect('/user/request');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  async removeRequest(req, res, next) {
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
          {
            $pull: {
              friendrequest: { accountId: yourId, fullname: yourFullname },
            },
          }
        ),
        Account.updateOne(
          { _id: yourId },
          {
            $pull: {
              friendreceived: { accountId: myId, fullname: myFullname },
            },
          }
        ),
      ];

      await Promise.all(promises);
      res.redirect('/user/request');
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

  showRequestSent(req, res, next) {
    var token = req.cookies.token;
    var myId = jwt.verify(token, 'mk')._id;
    Account.findOne({ _id: myId })
      .then((user) => {
        let friendrequest = user.friendrequest;
        res.render('users/request', {
          friendrequest: mongooseToObject(friendrequest),
        });
      })
      .catch(next);
  }

  async acceptRequest(req, res, next) {
    try {
      var token = req.cookies.token;
      var myId = jwt.verify(token, 'mk')._id;
      const yourId = req.params.id;

      const myAccount = await Account.findById(myId);
      const myFullname = myAccount.fullname;

      const yourAccount = await Account.findById(yourId);
      const yourFullname = yourAccount.fullname;

      const promises = [
        Account.updateOne(
          { _id: myId },
          {
            $push: {
              friendlist: { accountId: yourId, fullname: yourFullname },
            },
          }
        ),
        Account.updateOne(
          { _id: myId },
          {
            $pull: {
              friendreceived: { accountId: yourId, fullname: yourFullname },
            },
          }
        ),
        Account.updateOne(
          { _id: yourId },
          { $push: { friendlist: { accountId: myId, fullname: myFullname } } }
        ),
        Account.updateOne(
          { _id: yourId },
          {
            $pull: { friendrequest: { accountId: myId, fullname: myFullname } },
          }
        ),
      ];
      await Promise.all(promises);
      res.redirect('/user/friends');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  async declineRequest(req, res, next) {
    try {
      var token = req.cookies.token;
      var myId = jwt.verify(token, 'mk')._id;
      const yourId = req.params.id;

      const myAccount = await Account.findById(myId);
      const myFullname = myAccount.fullname;

      const yourAccount = await Account.findById(yourId);
      const yourFullname = yourAccount.fullname;

      const promises = [
        Account.updateOne(
          { _id: myId },
          {
            $pull: {
              friendreceived: { accountId: yourId, fullname: yourFullname },
            },
          }
        ),
        Account.updateOne(
          { _id: yourId },
          {
            $pull: { friendrequest: { accountId: myId, fullname: myFullname } },
          }
        ),
      ];
      await Promise.all(promises);
      res.redirect('/user/received');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  async unfriend(req, res, next) {
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
          {
            $pull: {
              friendlist: { accountId: yourId, fullname: yourFullname },
            },
          }
        ),
        Account.updateOne(
          { _id: yourId },
          {
            $pull: {
              friendlist: { accountId: myId, fullname: myFullname },
            },
          }
        ),
      ];

      await Promise.all(promises);
      res.redirect('/user/friends');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
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
