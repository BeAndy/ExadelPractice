function getById(id) {
  return `SELECT
  u.first_name, u.second_name,
  v.name,
  i.date,
  s.skill_name,
  t_f.primary_skill_lvl, t_f.other, t_f.id,
  c.ru_first_name, c.ru_second_name,
  c.eng_first_name, c.eng_second_name,
  g.change_date AS creation_date
  FROM ts_feedback t_f
  LEFT JOIN interview i ON i.id = t_f.interview_id
  LEFT JOIN skills s ON t_f.primary_skill_id = s.id
  LEFT JOIN candidate c ON i.candidate_id = c.id
  LEFT JOIN users u ON i.user_id = u.id
  LEFT JOIN vacancy v ON v.id = i.vacancy_id
  LEFT JOIN general_history g ON t_f.id = g.ts_feedback_id
  WHERE ${id} = t_f.id
  ORDER BY g.change_date DESC`;
}

function getByCandidateId(id) {
  return `SELECT
  t_f.id,
  u.first_name, u.second_name,
  i.date,
  v.name,
  s.skill_name,
  g.change_date AS creation_date
  FROM ts_feedback t_f
  LEFT JOIN interview i ON i.id = t_f.interview_id
  LEFT JOIN users u ON i.user_id = u.id
  LEFT JOIN vacancy v ON v.id = i.vacancy_id
  LEFT JOIN skills s ON t_f.primary_skill_id = s.id
  LEFT JOIN candidate c ON c.id = i.candidate_id
  LEFT JOIN general_history g ON t_f.id = g.ts_feedback_id
  WHERE ${id} = i.candidate_id
  ORDER BY g.change_date DESC`;
}

function getSecondarySkillsByTsFeedbackId(id) {
  return `SELECT
  skills.skill_name,
  ts_secondary_skills.skill_lvl
  FROM ts_secondary_skills
  INNER JOIN skills ON ts_secondary_skills.skill_id = skills.id
  WHERE ${id} = ts_secondary_skills.ts_feedback_id`;
}

function insert(object) {
  return `INSERT INTO ts_feedback
  (primary_skill_id, primary_skill_lvl, interview_id, other)
  VALUES
  ('${object.primary_skill_id}', '${object.primary_skill_lvl}',
  '${object.interview_id}', '${object.other}')`;
}

function insertTsSecondarySkills(item, id) {
  return `INSERT INTO ts_secondary_skills
  (ts_feedback_id, skill_lvl, skill_id)
  VALUES
  ('${id}', '${item.skill_lvl}', '${item.skill_id}')`;
}

function updateInterviewStatus(object) {
  return `UPDATE interview
  SET done = 1
  WHERE ${object.interview_id} = id`;
}

function insertEventToGeneralHistory(id) {
  return `INSERT INTO general_history
  (ts_feedback_id)
  VALUES ('${id}')`;
}

module.exports = {
  getById,
  getByCandidateId,
  insert,
  insertTsSecondarySkills,
  insertEventToGeneralHistory,
  getSecondarySkillsByTsFeedbackId,
  updateInterviewStatus,
};

