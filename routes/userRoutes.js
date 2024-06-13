const express = require('express');
const { getUsers, getUser, updateUser, deleteUser ,createUser} = require('../Controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUser);
router.post('/', createUser);  // Add this line
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
