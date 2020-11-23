const express = require('express');
const postController = require('./post.controller');
const imageController = require('../images/image.controller');

const router = express.Router();

router
  .route('/')
  .post(imageController.uploadImage, postController.createPost)
  .get(postController.getAllPosts);

router
  .route('/:id')
  .get(postController.getPost)
  .delete(postController.deletePost);

module.exports = router;
