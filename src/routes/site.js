const express = require('express');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const multer = require('multer');

const fileUpload = multer();

const siteController = require('../app/controllers/SiteController');
const authMiddleware = require('../app/middlewares/auth');

router.use('/welcome', authMiddleware.requireAuth, siteController.welcome);
router.use('/info', siteController.info);
router.use('/wall', authMiddleware.requireAuth, siteController.wall);
router.use('/profile', siteController.profile);

router.post('/upload-image', fileUpload.single('image'), siteController.uploadImage)

router.use('/', siteController.index);

module.exports = router;
