const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const userController = require('../app/controllers/UserController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/:id', userController.viewUser);
router.get('/:id/addfriend', userController.addFriendUser)

module.exports = router;