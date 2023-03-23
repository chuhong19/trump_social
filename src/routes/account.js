const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const accountController = require('../app/controllers/AccountController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/register', accountController.register);
router.post('/register', accountController.confirmRegister);
router.post('/login', accountController.confirmLogin);
router.get('/create', accountController.create);
router.post('/store', accountController.store);
router.get('/logout', accountController.logout);
router.get(
  '/editprofile',
  authMiddleware.requireAuth,
  accountController.editprofile
);
router.put(
  '/confirmeditprofile',
  authMiddleware.requireAuth,
  accountController.confirmeditprofile
);

module.exports = router;
