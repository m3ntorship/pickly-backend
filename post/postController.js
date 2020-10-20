const multer = require('multer');
const AppError = require('../util/appError');
const cloudinaryStorage = require('../util/cloudinary-custom-storage');
const { postService } = require('./post.service');

exports.getPost = postService.get('resources');
exports.createPost = postService.create();
exports.updatePost = postService.update();
exports.deletePost = postService.delete();
exports.getAllPosts = postService.getAll({
	getRecentFirst: true,
	populateResources: true,
	populateAuthor: true,
});