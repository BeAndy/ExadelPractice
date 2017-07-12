const metaDataModel = require('../models/meta-data.js');

exports.getLocations = (callback) => {
  metaDataModel.getLocations(callback);
};
exports.getEnglishLevels = (callback) => {
  metaDataModel.getEnglishLevels(callback);
};
exports.getSkills = (callback) => {
  metaDataModel.getSkills(callback);
};
exports.getCandidateStatuses = (callback) => {
  metaDataModel.getCandidateStatuses(callback);
};
exports.getOtherSkills = (callback) => {
  metaDataModel.getOtherSkills(callback);
};
exports.getVacancyStatuses = (callback) => {
  metaDataModel.getVacancyStatuses(callback);
};
