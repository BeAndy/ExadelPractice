const hrmFeedbackDao = require('../dao/hrm-feedbacks.js');
const convertKeys = require('./convert-keys.js');
const utils = require('../../utils.js');

function getById(id, callback) {
  hrmFeedbackDao.getById(id, (err, res) => {
    if (err) {
      throw err;
    }
    const result = convertKeys.toCamel(res);
    callback(err, utils.editNames(result));
  });
}
function getByCandidateId(id, callback) {
  hrmFeedbackDao.getByCandidateId(id, (err, res) => {
    if (err) {
      throw err;
    }
    const result = convertKeys.toCamel(res);
    callback(err, utils.editNames(result));
  });
}
function insert(object, callback) {
  hrmFeedbackDao.insert(convertKeys.toSnake(object), callback);
}

module.exports = {
  getById,
  getByCandidateId,
  insert,
};
