const express = require('express');
const { signup, login } = require('../Controllers/authController');
const router = express.Router();

router.post('/signup', signup);//user creation with jwt token . exp=1h
router.post('/login', login);// after 1h user will login agin with new jwt token

module.exports = router;
