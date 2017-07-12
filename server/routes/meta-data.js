const express = require('express');
const metaDataController = require('../controllers/meta-data.js');

const router = express.Router();

router.get('/english-levels', metaDataController.getEnglishLevels);
router.get('/locations', metaDataController.getLocations);
router.get('/skills', metaDataController.getSkills);
router.get('/candidate-statuses', metaDataController.getCandidateStatuses);
router.get('/other-skills', metaDataController.getOtherSkills);
router.get('/vacancy-statuses', metaDataController.getVacancyStatuses);

module.exports = router;
