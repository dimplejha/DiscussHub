const express = require('express');
const {
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getDiscussionsByTag,
  getDiscussionsByText,
  getAllDiscussions,
  getDiscussion,
  upload // Add this import
} = require('../Controllers/discussionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, upload, createDiscussion); // Update to use multer
router.put('/:id', authMiddleware, updateDiscussion);
router.delete('/:id', authMiddleware, deleteDiscussion);
router.get('/tag/:tag', authMiddleware, getDiscussionsByTag);
router.get('/text/:text', authMiddleware, getDiscussionsByText);
router.get('/', authMiddleware, getAllDiscussions);
router.get('/:id', authMiddleware, getDiscussion);


module.exports = router;
