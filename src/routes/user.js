const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const userController = require('../app/controllers/UserController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/received', authMiddleware.requireAuth, userController.showReceivedFriendRequest);
router.get('/request', authMiddleware.requireAuth, userController.showRequestSent);
router.get('/friends', authMiddleware.requireAuth, userController.showFriendList);
router.get('/:id/addfriend', authMiddleware.requireAuth, userController.addFriendUser);
router.get('/:id/acceptRequest', authMiddleware.requireAuth, userController.acceptRequest);
router.get('/:id/declineRequest', authMiddleware.requireAuth, userController.declineRequest);
router.get('/:id/removeRequest', authMiddleware.requireAuth, userController.removeRequest);
router.get('/:id/unfriend', authMiddleware.requireAuth, userController.unfriend);
router.get('/:id', authMiddleware.requireAuth, userController.viewUser);

module.exports = router;
