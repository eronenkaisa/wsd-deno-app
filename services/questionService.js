import { executeQuery } from "../database/database.js";
import * as optionService from "../services/optionService.js";

const addQuestion = async (user_id, topic_id, question_text) => {
    await executeQuery(
        "INSERT INTO questions (user_id, topic_id, question_text) VALUES ($1, $2, $3)", user_id, topic_id, question_text
    );
    const result = await executeQuery("SELECT * FROM questions WHERE user_id = $1 AND topic_id = $2 AND question_text = $3", user_id, topic_id, question_text)
    return result.rows[0];
};

const listQuestions = async (topic_id) => {
    const result = await executeQuery(
        "SELECT * FROM questions WHERE topic_id = $1", topic_id
    );
    
    return result.rows;
};

const deleteQuestion = async (qId) => {
    const options = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1", qId)

    for (const option of options.rows) {
        await optionService.deleteOption(option.id)
    };
 
    await executeQuery(
        "DELETE FROM questions WHERE id = $1", qId
    );
};

const pickRandomQuestionById = async (tId) => {
    const result = await executeQuery(
        "SELECT * FROM questions WHERE topic_id = $1 ORDER BY RANDOM() LIMIT 1", tId
    );
    return result.rows[0]
};

const pickRandomQuestion = async () => {
    const result = await executeQuery(
        "SELECT * FROM questions ORDER BY RANDOM() LIMIT 1"
    );
    return result.rows[0]
};

const fetchNumberOfQuestions = async () => {
    const result = await executeQuery(
        "SELECT * FROM questions"
    );
    return result.rows.length
};

const fetchQuestionByQid = async (qId) => {
    const result = await executeQuery(
        "SELECT * FROM questions WHERE id = $1", qId
    );
    return result.rows;
}

export { addQuestion, listQuestions, deleteQuestion, pickRandomQuestion, pickRandomQuestionById, fetchNumberOfQuestions, fetchQuestionByQid };