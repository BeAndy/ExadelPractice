const getHistory = (skip, capacity) =>
  `SELECT * FROM (
      SELECT
          vacancy_change_id, candidate_change_id, hrm_feedback_id,
          ts_feedback_id, interview_id, general_history.change_date,
          vacancy_changes.user_id, users.first_name, users.second_name,
          vacancy_changes.vacancy_id, vacancy.name
          FROM general_history
          INNER JOIN vacancy_changes ON vacancy_change_id = vacancy_changes.id 
          LEFT JOIN users ON users.id = user_id
          LEFT JOIN vacancy ON vacancy.id = vacancy_id
      UNION
        SELECT
          vacancy_change_id, candidate_change_id, hrm_feedback_id,
          ts_feedback_id, interview_id, general_history.change_date,
          candidate_changes.user_id, users.first_name, users.second_name,
          candidate_changes.candidate_id, candidate.eng_second_name
          FROM general_history
          INNER JOIN candidate_changes ON candidate_change_id = candidate_changes.id
          LEFT JOIN users ON users.id = user_id
          LEFT JOIN candidate ON candidate.id = candidate_id
      UNION
        SELECT
          vacancy_change_id, candidate_change_id, hrm_feedback_id,
          ts_feedback_id, interview_id, general_history.change_date,
          interview.user_id, users.first_name, users.second_name,
          interview.vacancy_id, vacancy.name
          FROM general_history
          INNER JOIN interview ON interview_id = interview.id
          LEFT JOIN users ON users.id = user_id
          LEFT JOIN vacancy ON vacancy.id = vacancy_id
      UNION
        SELECT
          vacancy_change_id, candidate_change_id, hrm_feedback_id,
          ts_feedback_id, general_history.interview_id, general_history.change_date,
          interview.user_id, users.first_name, users.second_name,
          interview.vacancy_id, vacancy.name
          FROM general_history
          INNER JOIN hrm_feedback ON hrm_feedback_id = hrm_feedback.id 
          LEFT JOIN interview ON hrm_feedback.interview_id = interview.id
          LEFT JOIN users ON users.id = user_id
          LEFT JOIN vacancy ON vacancy.id = vacancy_id
      UNION
        SELECT
          vacancy_change_id, candidate_change_id, hrm_feedback_id,
          ts_feedback_id, general_history.interview_id, general_history.change_date,
          interview.user_id, users.first_name, users.second_name,
          ts_feedback.interview_id, vacancy.name
          FROM general_history
          INNER JOIN ts_feedback ON ts_feedback_id = ts_feedback.id
          LEFT JOIN interview ON ts_feedback.interview_id = interview.id
          LEFT JOIN users ON users.id = user_id
          LEFT JOIN vacancy ON vacancy.id = vacancy_id
      ) as smth
      LIMIT ${skip}, ${capacity}`;

const getCandidatesNames = () =>
  `SELECT candidate_changes.id, candidate.ru_first_name, candidate.ru_second_name,
  candidate.eng_first_name, candidate.eng_second_name
  FROM candidate_changes
  LEFT JOIN candidate ON candidate.id = candidate_id`;

const getRecordsNumber = () =>
  'SELECT COUNT(*) AS total FROM general_history';

module.exports = {
  getHistory,
  getCandidatesNames,
  getRecordsNumber,
};