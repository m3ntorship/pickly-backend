const { Router } = require('express');
const imageContorller = require('./option.controller');
const router = Router();

router.route('/:optionId').get(imageContorller.getImage);

router.route('/:optionId/votes').put(imageContorller.upvoteImage);

module.exports = router;
