const async = require('async');
const query = require('../queries/history-queries');
const connection = require('./connection').connection;

function getHistory(skip, capacity, callback) {
  async.parallel(
    [
      call => connection.query(query.getHistory(skip, capacity), call),
      call => connection.query(query.getCandidatesNames(), call),
      call => connection.query(query.getRecordsNumber(), call),
    ],
    callback);
}

module.exports = {
  getHistory,
};
