const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const userController = require('../app/controllers/UserController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/received', userController.showReceivedFriendRequest);
router.get('/request', userController.showRequestSent);
router.get('/friends', userController.showFriendList);
router.get('/:id/addfriend', userController.addFriendUser)
router.get('/:id/acceptRequest', userController.acceptRequest);
router.get('/:id/declineRequest', userController.declineRequest);
router.get('/:id/removeRequest', userController.removeRequest)
router.get('/:id/unfriend', userController.unfriend)
router.get('/:id', userController.viewUser);

module.exports = router;