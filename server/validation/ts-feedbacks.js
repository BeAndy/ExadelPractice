const Joi = require('joi');

const getById = {
  options: {
    allowUnknownBody: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
  },
  query: {
    id: Joi.number().integer().required(),
  },
};

const getByCandidateId = {
  options: {
    allowUnknownBody: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
  },
  query: {
    id: Joi.number().integer().required(),
  },
};

const insert = {
  options: {
    allowUnknownBody: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
  },
  body: {
    primarySkillId: Joi.number().integer().required(),
    primarySkillLvl: Joi.number().integer().required(),
    interviewId: Joi.number().integer().required(),
    secondarySkills: Joi.array().required(),
  },
  query: {
    user: {
      id: Joi.number().integer().required(),
    },
  },
};

module.exports = {
  getById,
  getByCandidateId,
  insert,
};
