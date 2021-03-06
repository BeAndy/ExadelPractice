const metaphone = require('metaphone');
const async = require('async');
const json2xls = require('json2xls');

const candidatesModel = require('../dao/candidates');
const utils = require('../../utils');

const defaultCapacity = 10;

function mapRes(error, result, callback) {
  if (result) {
    result = utils.namesEditor.editArr(utils.toCamel(result));
  }
  callback(error, result);
}

function get(paramsCamel, callback) {
  const params = utils.dateFormatter.format(utils.toSnake(paramsCamel));
  const skip = paramsCamel.skip;
  const amount = paramsCamel.amount;
  let filter = params;
  delete filter.skip;
  delete filter.amount;
  utils.clearFields(filter);
  if (Object.keys(filter).length === 0) {
    filter = undefined;
  }
  candidatesModel.get(skip, amount, filter, (err, res) => mapRes(err, res, callback));
}

function getById(id, callback) {
  candidatesModel.getById(id, (error, result) => {
    const item = result.map(val => val[0]);
    let res = item[0][0];
    if (!res) {
      result = 'No such candidate';
      return callback(error, result);
    }
    res = utils.toCamel(res);
    utils.namesEditor.mapNames(res);
    res.emails = item[1].map(val => val.email);
    res.secSkills = item[2];
    res.otherSkills = item[3];
    callback(error, utils.clearFields(utils.toCamel(res)));
  });
}

function insert(candidateCamel, user, callback) {
  const candidate = utils.dateFormatter.format(utils.toSnake(candidateCamel));
  const emails = candidate.emails || [];
  const secSkills = candidate.sec_skills || [];
  const oSkills = candidate.other_skills || [];
  const item = candidate;
  const firstName = utils.translit(item.eng_first_name);
  const changes = {};
  changes.user_id = user;
  if (firstName !== item.eng_first_name) {
    item.ru_first_name = item.eng_first_name;
    item.ru_second_name = item.eng_second_name;
    item.eng_first_name = firstName;
    item.eng_second_name = utils.translit(item.eng_second_name);
  }
  const meta = {
    first: metaphone(item.eng_first_name),
    second: metaphone(item.eng_second_name),
  };
  delete item.emails;
  delete item.sec_skills;
  delete item.other_skills;
  candidatesModel.insert(item, emails, secSkills, oSkills, meta, changes, callback);
}

function validate(email, callback) {
  candidatesModel.validate(email, (err, res) => {
    if (err) {
      return callback(err);
    }
    if (res[0]) {
      return callback(err, 406);
    }
    callback(err, 200);
  });
}

function update(id, candidateCamel, user, callback) {
  const candidate = utils.dateFormatter.format(utils.toSnake(candidateCamel));
  const changes = {};
  Object.keys(candidate).forEach((key) => {
    changes[`${key}`] = 1;
  });
  if (candidate.primary_skill_lvl) {
    delete changes.primary_skill_lvl;
    changes.primary_skill = 1;
  }
  changes.candidate_id = id;
  changes.user_id = user;
  const emails = candidate.emails || [];
  const secSkills = candidate.sec_skills || [];
  const oSkills = candidate.other_skills || [];
  const item = candidate;
  const firstName = utils.translit(item.eng_first_name);
  let meta = {};
  if (firstName) {
    if (firstName !== item.eng_first_name) {
      item.ru_first_name = item.eng_first_name;
      item.ru_second_name = item.eng_second_name;
      item.eng_first_name = firstName;
      item.eng_second_name = utils.translit(item.eng_second_name);
    }
    meta = {
      first: metaphone(item.eng_first_name),
      second: metaphone(item.eng_second_name),
      candidate_id: id,
    };
  }
  delete item.emails;
  delete item.sec_skills;
  delete item.other_skills;
  delete item.change_date;
  candidatesModel.update(id, item, emails, secSkills, oSkills, changes, meta, callback);
}

function search(query, bodyCamel, callback) {
  if (!query.q) {
    return get(bodyCamel, callback);
  }
  const body = utils.dateFormatter.format(utils.toSnake(bodyCamel));
  const skip = bodyCamel.skip;
  const amount = bodyCamel.amount;
  let filter = body;
  delete filter.skip;
  delete filter.amount;
  utils.clearFields(filter);
  let params = query.q.split(' ');
  if (params.length > 2) {
    params = params.slice(1, 3);
  }
  const paramsName = params.map(val => metaphone(utils.translit(val)));
  if (Object.keys(filter).length === 0) {
    filter = undefined;
  }
  async.parallel([
    call => candidatesModel.search(paramsName, skip, amount, filter, (err, res) =>
      mapRes(err, res, call)),
    call => candidatesModel.searchByEmail(params[0], skip, amount, filter, (err, res) =>
      mapRes(err, res, call)),
    call => candidatesModel.searchBySkype(params[0], skip, amount, filter, (err, res) =>
      mapRes(err, res, call))],
    (err, res) => {
      if (err) {
        callback(err);
        throw err;
      }
      let result = [];
      res.forEach((val) => {
        result = result.concat(val);
      });
      callback(err, result);
    });
}

function report(paramsCamel, callback) {
  paramsCamel.expYear = paramsCamel.expYear ? new Date(+paramsCamel.expYear) : undefined;
  if (paramsCamel.span) {
    paramsCamel.span.from = paramsCamel.span.from ? new Date(+paramsCamel.span.from) : undefined;
    paramsCamel.span.to = paramsCamel.span.to ? new Date(+paramsCamel.span.to) : undefined;
  }
  const params = utils.dateFormatter.format(utils.toSnake(paramsCamel));
  const span = paramsCamel.span ? utils.dateFormatter.format(paramsCamel.span) : undefined;
  let filter = params;
  delete filter.span;
  if (Object.keys(filter).length === 0) {
    filter = undefined;
  }
  candidatesModel.report(span, filter, (err, res) => {
    if (res) {
      res = utils.namesEditor.editArr(utils.toCamel(res));
    }
    if (res) {
      res = json2xls(res, {
        fields: [
          'candidateName', 'status', 'primarySkill', 'primarySkillLvl', 'expYear', 'englishLvl',
          'email', 'city', 'phone', 'skype', 'salaryWish', 'linkedIn', 'contactDate',
        ],
      });
    }
    callback(err, res);
  });
}


function getHistory(req, callback) {
  const skip = Number(req.query.skip) || 0;
  const capacity = Number(req.query.capacity) || defaultCapacity;
  const id = req.params.id;
  candidatesModel.getHistory(id, (err, res) => {
    let number = 0;
    let result = [];
    res = utils.toCamel(res);
    res.map((item) => {
      let isEmpty = true;
      Object.keys(item).forEach((key) => {
        if (item[`${key}`] === 1) {
          result.push({
            user: `${item.firstName} ${item.secondName}`,
            cahngeDate: item.changeDate,
            change: utils.formChange(`${key}`),
          });
          number += 1;
          isEmpty = false;
        }
      });
      if (isEmpty) {
        result.push({
          user: `${item.firstName} ${item.secondName}`,
          cahngeDate: new Date(item.changeDate),
          change: 'Candidate was added',
        });
        number += 1;
      }
      return item;
    });
    result = result.slice(skip, skip + capacity);
    result.unshift(number);
    callback(err, result);
  });
}

module.exports = {
  get,
  getById,
  getHistory,
  insert,
  validate,
  update,
  search,
  report,
};
