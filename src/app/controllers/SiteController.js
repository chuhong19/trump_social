const Post = require('../models/Post');
const Account = require('../models/Account');
const Image = require('../models/Image');
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const { comment } = require('./PostController');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class SiteController {
  index(req, res, next) {
    res.render('home');
  }

  welcome(req, res, next) {
    // Hiển thị tất cả các post
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

  uploadImage = async (req, res) => {
    try {
      const result = await streamUpload(req);
      const cloudinaryId = result.public_id;
      const imageUrl = result.url;
      const formDataUpdate = {
        cloudinaryId,
        imageUrl,
      };
      const accountId = req.session.userId;
      console.log(formDataUpdate);
      const image = new Image({
        cloudinaryId,
        imageUrl,
        avatarOf: accountId,
      });
      image.save().then(() => res.redirect('/profile'));
    } catch (err) {
      console.log('Error: ', err);
    }
  };
}

module.exports = new SiteController();
