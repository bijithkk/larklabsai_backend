const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

// Registration
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.login); 

module.exports = router;