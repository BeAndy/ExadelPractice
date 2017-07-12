const metaServiceModel = require('../services/meta-data.js');

exports.getEnglishLevels = (req, res) => {
  metaServiceModel.getEnglishLevels((error, result) => {
    if (error) {
      console.log('getEnglishLevels error');
      throw error;
    }
    return res.status(200).send(result);
  });
};
exports.getLocations = (req, res) => {
  metaServiceModel.getLocations((error, result) => {
    if (error) {
      console.log('getLocation error');
      throw error;
    }
    return res.status(200).send(result);
  });
};
exports.getSkills = (req, res) => {
  metaServiceModel.getSkills((error, result) => {
    if (error) {
      console.log('getSkills error');
      throw error;
    }
    return res.status(200).send(result);
  });
};
exports.getCandidateStatuses = (req, res) => {
  metaServiceModel.getCandidateStatuses((error, result) => {
    if (error) {
      console.log('getCandidateStatuses error');
      throw error;
    }
    return res.status(200).send(result);
  });
};
exports.getOtherSkills = (req, res) => {
  metaServiceModel.getOtherSkills((error, result) => {
    if (error) {
      console.log('getOtherSkills error');
      throw error;
    }
    return res.status(200).send(result);
  });
};
exports.getVacancyStatuses = (req, res) => {
  metaServiceModel.getVacancyStatuses((error, result) => {
    if (error) {
      console.log('getOtherSkills error');
      throw error;
    }
    return res.status(200).send(result);
  });
};
