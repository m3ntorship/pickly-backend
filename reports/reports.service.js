const Report = require('./reports.model');
const schema = require('./report.schema');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
let Ajv = require('ajv');
let ajv = new Ajv({ allErrors: true });

exports.reportService = {
  create() {
    return catchAsync(async (req, res, next) => {
      const data = {
        resourceId: req.body.resourceId,
        reporterId: req.body.reporterId,
        type: req.body.type
      };

      let validate = ajv.compile(schema);
      let valid = validate(data);
      if (!valid) {
        let errorsMesssage = '';
        const errors = validate.errors;
        console.log(errors);
        for (let error of errors) {
          errorsMesssage += error.dataPath + ': ' + error.message + ', ';
        }
        return next(new AppError(errorsMesssage, 400, errors));
      }

      if (req.body.reporterId.toString() === req.user.mongouser._id.toString())
        return next(new AppError("User can't report his post", 403));

      const result = await Report.create({
        resourceId: req.body.resourceId,
        reporterId: req.body.reporterId,
        type: req.body.type
      });
      res.status(201).json({ status: 'success', data: result });
    });
  },
  getAll() {
    return catchAsync(async (req, res) => {
      const reports = await Report.find();
      res.status(200).json({ status: 'success', data: reports });
    });
  }
};
