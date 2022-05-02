import { executeQuery } from "../database/database.js";

const addAnswer = async (userId, qId, oId) => {
    await executeQuery(
        "INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES ($1, $2, $3)", userId, qId, oId
    );    
    const result = await executeQuery("SELECT * FROM question_answers WHERE user_id = $1 AND question_id = $2 AND question_answer_option_id = $3", qId, qId, oId)
    return result.rows[0];
};

const deleteAnswer = async (qId, oId) => {
    await executeQuery(
        "DELETE FROM question_answers WHERE question_id = $1 AND question_answer_option_id = $2", qId, oId
    );
};

const fetchNumberOfAnswers = async () => {
    const result = await executeQuery(
        "SELECT * FROM question_answers"
    );
    return result.rows.length
};

const fetchAnswerByAid = async (aId)=> {
    const result = await executeQuery(
        "SELECT * FROM question_answers WHERE id = $1", aId
    );
    return result.rows;
}


export { addAnswer, deleteAnswer, fetchNumberOfAnswers, fetchAnswerByAid }