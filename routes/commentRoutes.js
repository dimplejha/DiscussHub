const express = require('express');
const { createComment, likeComment, replyComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { updateComment, deleteComment } = require('../controllers/commentController');


router.post('/', authMiddleware, createComment);
router.post('/:id/like', authMiddleware, likeComment);
router.post('/reply', authMiddleware, replyComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
