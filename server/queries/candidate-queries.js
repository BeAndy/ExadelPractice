function get(skip = 0, amount = 14, filter = {}) {
  const query = [];
  let sent = 'WHERE ';
  let j = 0;
  Object.keys(filter).forEach((item, i) => {
    if (i >= 1) {
      sent = ' AND ';
    }
    if (item === 'salary_wish') {
      if (filter[item][0]) {
        query[i + j] = `${sent}candidate.${item} >= ${filter[item][0]}`;
        if (filter[item][1]) {
          j += 1;
          query[i + j] = ` AND candidate.${item} <= ${filter[item][1]}`;
        }
      }
      return;
    }
    if (item === 'exp_year') {
      query[i + j] = `${sent}candidate.${item} <= "${filter[item]}"`;
      return;
    }
    query[i + j] = `${sent}candidate.${item} IN (`;
    filter[item].forEach((val, l, arr) => {
      j += 1;
      if (l !== arr.length - 1) {
        query[i + j] = `"${val}",`;
        return;
      }
      query[i + j] = `"${val}"`;
    });
    j += 1;
    query[i + j] = ')';
  });
  return `SELECT candidate.id, candidate.ru_first_name, candidate.ru_second_name,
  candidate.eng_first_name, candidate.eng_second_name, location.city, candidate.contact_date,
  skills.skill_name, candidate_emails.email, candidate_status.status
  FROM candidate
  LEFT JOIN location ON candidate.city = location.id
  LEFT JOIN skills ON candidate.primary_skill = skills.id
  LEFT JOIN candidate_status ON candidate.status = candidate_status.id
  LEFT JOIN candidate_emails ON candidate.id = candidate_emails.candidate_id
  ${query.join('')}
  GROUP BY candidate.id
  ORDER BY candidate.contact_date DESC
  LIMIT ${skip}, ${amount}`;
}

function getById(id) {
  return `SELECT candidate.id, candidate.ru_first_name, candidate.ru_second_name,
  candidate.eng_first_name, candidate.eng_second_name, candidate.linkedin, candidate.skype,
  candidate.phone,  location.city, candidate.exp_year, candidate.salary_wish, english_lvl.lvl,
  candidate.contact_date, skills.skill_name, candidate.primary_skill_lvl,
  candidate_status.status
  FROM candidate
  LEFT JOIN location ON candidate.city = location.id
  LEFT JOIN skills ON candidate.primary_skill = skills.id
  LEFT JOIN candidate_status ON candidate.status = candidate_status.id
  LEFT JOIN english_lvl ON candidate.english_lvl = english_lvl.id
  WHERE candidate.id = ${id}`;
}

function getEmails(id) {
  return `SELECT candidate_emails.email
  FROM candidate_emails
  WHERE candidate_emails.candidate_id = ${id}`;
}

function getSecondarySkills(id) {
  return `SELECT skills.id, skills.skill_name, candidate_secondary_skills.lvl
  FROM candidate_secondary_skills
  LEFT JOIN skills ON candidate_secondary_skills.skill_id = skills.id
  WHERE candidate_secondary_skills.candidate_id = ${id}`;
}

function getOtherSkills(id) {
  return `SELECT other_skills.skill, other_skills.id
  FROM other_skills_has_candidate
  LEFT JOIN other_skills ON other_skills_has_candidate.other_skills_id = other_skills.id
  WHERE other_skills_has_candidate.candidate_id = ${id}`;
}

function insert() {
  return 'INSERT INTO candidate SET ?;';
}

function insertEmails(id, email) {
  return `INSERT INTO candidate_emails (candidate_id, email)
    VALUES (${id}, "${email}");`;
}

function insertSecSkills(id, skill) {
  return `INSERT INTO candidate_secondary_skills (candidate_id, skill_id, lvl)
    VALUES (${id}, ${skill.skill_name}, ${skill.lvl});`;
}

function insertOtherSkills(id, skill) {
  return `INSERT INTO other_skills_has_candidate (candidate_id, other_skills_id)
    VALUES (${id}, ${skill});`;
}

function insertMeta() {
  return 'INSERT INTO metaphone SET ?';
}

function update(id) {
  return `UPDATE candidate
    SET ?
    WHERE id = ${id}`;
}

function deleteRuName(id) {
  return `UPDATE candidate
    SET ru_first_name = NULL, ru_second_name = NULL
    WHERE candidate.id = ${id}`;
}

function deleteEmails(id) {
  return `DELETE FROM candidate_emails
    WHERE candidate_id = ${id};`;
}

function deleteSecSkills(id) {
  return `DELETE FROM candidate_secondary_skills
    WHERE candidate_id = ${id};`;
}

function deleteOtherSkills(id) {
  return `DELETE FROM other_skills_has_candidate
    WHERE candidate_id = ${id};`;
}

function deleteMeta(id) {
  return `DELETE FROM metaphone
    WHERE candidate_id = ${id};`;
}

function commitChanges() {
  return 'INSERT INTO candidate_changes SET ?';
}

function generalHistory(id) {
  return `INSERT INTO general_history (candidate_change_id)
    VALUES (${id});`;
}

function search(params, skip = 0, amount = 14, filter = {}) {
  const query = [];
  let index = 2;
  query[0] = `metaphone.first = "${params[0]}"`;
  if (params[1]) {
    query[1] = ` AND metaphone.second = "${params[1]}"`;
    query[3] = ` AND metaphone.first = "${params[1]}"`;
    query[2] = ` OR metaphone.second = "${params[0]}"`;
    index = 4;
  } else {
    query[1] = ` OR metaphone.second = "${params[0]}"`;
  }
  Object.keys(filter).forEach((item, i) => {
    if (item === 'salary_wish') {
      if (filter[item][0]) {
        query[i + index] = ` AND candidate.${item} >= ${filter[item][0]}`;
        if (filter[item][1]) {
          index += 1;
          query[i + index] = ` AND candidate.${item} <= ${filter[item][1]}`;
        }
      }
      return;
    }
    if (item === 'exp_year') {
      query[i + index] = ` AND candidate.${item} <= ${filter[item][0]}`;
      return;
    }
    let sent = ' AND ';
    filter[item].forEach((val, l) => {
      if (l >= 1) {
        sent = ' OR ';
        index += 1;
      }
      query[i + index] = `${sent}candidate.${item} = ${val}`;
    });
  });
  return `SELECT candidate.id, candidate.ru_first_name, candidate.ru_second_name,
  candidate.eng_first_name, candidate.eng_second_name, location.city, candidate.contact_date,
  skills.skill_name, candidate_emails.email, candidate_status.status
  FROM metaphone
  LEFT JOIN candidate ON metaphone.candidate_id = candidate.id
  LEFT JOIN location ON candidate.city = location.id
  LEFT JOIN skills ON candidate.primary_skill = skills.id
  LEFT JOIN candidate_status ON candidate.status = candidate_status.id
  LEFT JOIN candidate_emails ON candidate.id = candidate_emails.candidate_id
  WHERE ${query.join('')}
  GROUP BY candidate.id
  LIMIT ${skip}, ${amount}`;
}

function searchByEmail(params, skip = 0, amount = 14, filter = {}) {
  const query = [];
  query[0] = `candidate_emails.email = "${params}"`;
  let index = 1;
  Object.keys(filter).forEach((item, i) => {
    if (item === 'salary_wish') {
      if (filter[item][0]) {
        query[i + index] = ` AND candidate.${item} >= ${filter[item][0]}`;
        if (filter[item][1]) {
          index += 1;
          query[i + index] = ` AND candidate.${item} <= ${filter[item][1]}`;
        }
      }
      return;
    }
    if (item === 'exp_year') {
      query[i + index] = ` AND candidate.${item} <= ${filter[item][0]}`;
      return;
    }
    let sent = ' AND ';
    filter[item].forEach((val, l) => {
      if (l >= 1) {
        sent = ' OR ';
        index += 1;
      }
      query[i + index] = `${sent}candidate.${item} = ${val}`;
    });
  });
  return `SELECT candidate.id, candidate.ru_first_name, candidate.ru_second_name,
  candidate.eng_first_name, candidate.eng_second_name, location.city, candidate.contact_date,
  skills.skill_name, candidate_emails.email, candidate_status.status
  FROM candidate_emails
  LEFT JOIN candidate ON candidate_emails.candidate_id = candidate.id
  LEFT JOIN location ON candidate.city = location.id
  LEFT JOIN skills ON candidate.primary_skill = skills.id
  LEFT JOIN candidate_status ON candidate.status = candidate_status.id
  WHERE ${query.join('')}
  ORDER BY candidate.contact_date DESC
  LIMIT ${skip}, ${amount}`;
}

function searchBySkype(params, skip = 0, amount = 14, filter = {}) {
  const query = [];
  query[0] = `candidate.skype = "${params}"`;
  let index = 1;
  Object.keys(filter).forEach((item, i) => {
    if (item === 'salary_wish') {
      if (filter[item][0]) {
        query[i + index] = ` AND candidate.${item} >= ${filter[item][0]}`;
        if (filter[item][1]) {
          index += 1;
          query[i + index] = ` AND candidate.${item} <= ${filter[item][1]}`;
        }
      }
      return;
    }
    if (item === 'exp_year') {
      query[i + index] = ` AND candidate.${item} <= ${filter[item][0]}`;
      return;
    }
    let sent = ' AND ';
    filter[item].forEach((val, l) => {
      if (l >= 1) {
        sent = ' OR ';
        index += 1;
      }
      query[i + index] = `${sent}candidate.${item} = ${val}`;
    });
  });
  return `SELECT candidate.id, candidate.ru_first_name, candidate.ru_second_name,
  candidate.eng_first_name, candidate.eng_second_name, location.city, candidate.contact_date,
  skills.skill_name, candidate_emails.email, candidate_status.status
  FROM candidate
  LEFT JOIN location ON candidate.city = location.id
  LEFT JOIN skills ON candidate.primary_skill = skills.id
  LEFT JOIN candidate_status ON candidate.status = candidate_status.id
  LEFT JOIN candidate_emails ON candidate.id = candidate_emails.candidate_id
  WHERE ${query.join('')}
  GROUP BY candidate.id
  ORDER BY candidate.contact_date DESC
  LIMIT ${skip}, ${amount}`;
}

function report(span = {}, filter = {}) {
  const query = [];
  let sent = 'WHERE ';
  let j = 0;
  Object.keys(filter).forEach((item, i) => {
    if (i >= 1) {
      sent = ' AND ';
    }
    if (item === 'salary_wish') {
      if (filter[item][0]) {
        query[i + j] = `${sent}candidate.${item} >= ${filter[item][0]}`;
        if (filter[item][1]) {
          j += 1;
          query[i + j] = ` AND candidate.${item} <= ${filter[item][1]}`;
        }
      }
      return;
    }
    if (item === 'exp_year') {
      query[i + j] = `${sent}candidate.${item} <= ${filter[item][0]}`;
      return;
    }
    if (item === 'span') {
      if (filter.span.to) {
        query[i + j] = `${sent}candidate.${item} >= ${filter.span.to}`;
        if (filter.span.from) {
          j += 1;
          query[i + j] = ` AND candidate.${item} <= ${filter.span.from}`;
        }
      }
      return;
    }
    filter[item].forEach((val, l) => {
      if (l >= 1) {
        sent = ' OR ';
        j += 1;
      }
      query[i + j] = `${sent}candidate.${item} = ${val}`;
    });
  });
  return `SELECT candidate.ru_first_name, candidate.ru_second_name,
  candidate.eng_first_name, candidate.eng_second_name, location.city, candidate.contact_date,
  skills.skill_name, candidate.primary_skill_lvl, candidate_emails.email, candidate_status.status
  FROM candidate
  LEFT JOIN location ON candidate.city = location.id
  LEFT JOIN skills ON candidate.primary_skill = skills.id
  LEFT JOIN candidate_status ON candidate.status = candidate_status.id
  LEFT JOIN candidate_emails ON candidate.id = candidate_emails.candidate_id
  ${query.join('')}
  GROUP BY candidate.id
  ORDER BY candidate.contact_date DESC`;
}

module.exports = {
  get,
  getById,
  getEmails,
  getSecondarySkills,
  getOtherSkills,
  insert,
  insertEmails,
  insertSecSkills,
  insertOtherSkills,
  insertMeta,
  update,
  deleteRuName,
  deleteEmails,
  deleteSecSkills,
  deleteOtherSkills,
  deleteMeta,
  commitChanges,
  generalHistory,
  search,
  searchByEmail,
  searchBySkype,
  report,
};
