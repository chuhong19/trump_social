const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const accountController = require('../app/controllers/AccountController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/register', accountController.register);
router.post('/register', accountController.confirmRegister);
router.post('/login', accountController.confirmLogin);
router.get('/logout', authMiddleware.requireAuth, accountController.logout);
router.get(
  '/editprofile',
  authMiddleware.requireAuth,
  accountController.editProfile
);
router.put(
  '/confirmeditprofile',
  authMiddleware.requireAuth,
  accountController.confirmEditProfile
);

router.get('/createpost', authMiddleware.requireAuth, accountController.createPost);
router.post('/storepost', authMiddleware.requireAuth, accountController.storePost);
router.get('/:id/editpost', authMiddleware.requireAuth, accountController.editPost);
router.put('/:id', authMiddleware.requireAuth, accountController.updatePost);
router.delete('/:id', authMiddleware.requireAuth, accountController.deletePost)

module.exports = router;
