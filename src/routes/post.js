const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const postController = require('../app/controllers/PostController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/:id/like', postController.like);
router.get('/:id/comment', postController.comment);

module.exports = router;
