const { reportService } = require('./reports.service');

exports.postReport = reportService.create();
exports.getAllReports = reportService.getAll();
