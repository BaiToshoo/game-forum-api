const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { postController } = require('../controllers');

// middleware that is specific to this router

router.get('/', postController.getLatestsPosts);
router.get('/theme/:themeId', auth(), postController.getPostsByTheme);


module.exports = router
