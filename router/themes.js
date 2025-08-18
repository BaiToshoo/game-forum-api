const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { themeController, postController } = require('../controllers');

router.put('/:themeId/posts/:postId', auth(), postController.editPost);
router.delete('/:themeId/posts/:postId', auth(), postController.deletePost);

router.get('/', themeController.getThemes);
router.post('/', auth(), themeController.createTheme);
router.get('/:themeId', themeController.getTheme);
router.post('/:themeId', auth(), postController.createPost);
router.put('/:themeId/subscribe', auth(), themeController.subscribe);
router.delete('/:themeId/subscribe', auth(), themeController.unsubscribe);
router.delete('/:themeId', auth(), themeController.deleteTheme);

module.exports = router;
