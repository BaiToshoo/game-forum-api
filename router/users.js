const express = require('express');
const router = express.Router();
const { authController, userController} = require('../controllers');
const { auth } = require('../utils');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/profile', auth(),authController.getProfileInfo);
router.put('/profile', auth(),authController.editProfileInfo);

router.get('/all', auth(), userController.getAllUsers);

module.exports = router
