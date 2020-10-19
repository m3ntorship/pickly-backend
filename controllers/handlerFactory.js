const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const { Image } = require('../models/imageModel');
const { Resources } = require('../models/imageModel');
const Post = require('../models/postModel');
const isTruthy = require('../util/isTruthy');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    if (!req.files.images) {
      return next(new AppError('Please Upload atleast one image', 400));
    }
    const images = req.files.images.map(image => {
      return new Image({
        name: image.originalname.replace(' ', ''),
        url: image.path,
        provider: 'cloudinary'
      });
    });

    const imagesIds = images.map(image => image._id);

    const resources = await Resources.create({ images: imagesIds });
    const { isAnonymous, caption } = req.body;
    const isAnonymousBoolean = isTruthy(isAnonymous);
    const user = req.user.mongouser;

    const doc = await Model.create({
      caption,
      resources: resources._id,
      author: user._id,
      isAnonymous: isAnonymousBoolean
    });

    images.forEach(async img => {
      img.postId = doc._id;
      await img.save();
    });

    res.status(201).json({
      status: 'success',
      data: doc.toJSONFor(req.user.mongouser)
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions)
      query = query
        .populate({
          path: popOptions,
          model: 'resources',
          populate: {
            path: 'images',
            model: 'image'
          }
        })
        .exec();
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    if (doc.author) {
      await doc.populate('author', 'name email').execPopulate();
    }

    res.status(200).json({
      status: 'success',
      data: doc.toJSONFor(req.user.mongouser)
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc.toJSONFor(req.user.mongouser)
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await Model.deleteOne({ _id: docId });
    console.log(doc);
    if (doc) return res.status(204).send();
    return next(new AppError('cannot find doc with that id', 404));
  });

exports.getAll = (Model, options) =>
  catchAsync(async (req, res, next) => {
    let data = Post.find();
    if (options.getRecentFirst) {
      data.sort('-createdAt');
    }
    if (options.populateResources) {
      data.populate('resources');
    }
    if (options.populateAuthor) {
      data.populate('author');
    }
    data = await data;

    if (!data) {
      return next(new AppError('No Polls found with that ID', 404));
    } else {
      res
        .status(200)
        .json({ data: data.map(post => post.toJSONFor(req.user.mongouser)) });
    }
  });
