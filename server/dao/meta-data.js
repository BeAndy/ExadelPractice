const mysql = require('mysql');
const metaDataQueries = require('../queries/meta-data-queries.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123789',
  database: 'pick_brains_db',
});

connection.connect((error) => {
  if (error) {
    console.log('Models connection error');
  }
  console.log('Meta-data model is connected');
});

exports.getEnglishLevels = (callback) => {
  connection.query(metaDataQueries.englishLevelsQuery, callback);
};
exports.getLocations = (callback) => {
  connection.query(metaDataQueries.locationQuery, callback);
};
exports.getSkills = (callback) => {
  connection.query(metaDataQueries.skillsQuery, callback);
};
exports.getCandidateStatuses = (callback) => {
  connection.query(metaDataQueries.candidateStatusesQuery, callback);
};
exports.getOtherSkills = (callback) => {
  connection.query(metaDataQueries.otherSkillsQuery, callback);
};
exports.getVacancyStatuses = (callback) => {
  connection.query(metaDataQueries.otherSkillsQuery, callback);
};
