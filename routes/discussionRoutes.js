const express = require('express');
const {
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getDiscussionsByTag,
  getDiscussionsByText,
  getAllDiscussions,
} = require('../Controllers/discussionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createDiscussion);
router.put('/:id', authMiddleware, updateDiscussion);
router.delete('/:id', authMiddleware, deleteDiscussion);
router.get('/tag/:tag', authMiddleware, getDiscussionsByTag);
router.get('/text/:text', authMiddleware, getDiscussionsByText);
router.get('/', authMiddleware, getAllDiscussions);

module.exports = router;
