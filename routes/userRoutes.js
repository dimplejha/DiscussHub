const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, followUser, unfollowUser } = require('../Controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.post('/follow/:id', authMiddleware, followUser);
router.post('/unfollow/:id', authMiddleware, unfollowUser);

module.exports = router;
