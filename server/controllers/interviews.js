const interviewService = require('../services/interviews.js');

function insert(req, res) {
  interviewService.insert(req.body, (error) => {
    if (error) {
      throw error;
    }
    return res.sendStatus(200);
  });
}
function getByUserId(req, res) {
  interviewService.getByUserId(req.params.id, (error, result) => {
    if (error) {
      throw error;
    }
    return res.status(200).send(result);
  });
}
function getByCandidateId(req, res) {
  interviewService.getByCandidateId(req.params.id, (error, result) => {
    if (error) {
      throw error;
    }
    return res.status(200).send(result);
  });
}

module.exports = {
  insert,
  getByUserId,
  getByCandidateId,
};