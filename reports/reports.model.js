const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reprtSchema = new Schema(
  {
    resourceId: {
      type: String,
      required: true
    },
    reporterId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reprtSchema);
module.exports = Report;
