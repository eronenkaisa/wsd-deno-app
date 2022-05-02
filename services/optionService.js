import { executeQuery } from "../database/database.js";
import * as answerService from "../services/answerService.js";

const listOptions = async (qId) => {
    const result = await executeQuery(
        "SELECT * FROM question_answer_options WHERE question_id = $1", qId
    );
    return result.rows;
}

const addOption = async (qId, optionText, isCorrect) => {
    await executeQuery(
        "INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)", qId, optionText, isCorrect
    );
    const result = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1 AND option_text = $2 AND is_correct = $3", qId, optionText, isCorrect)
    return result.rows[0];
};

const deleteOption = async (oId) => {
    const answers = await executeQuery("SELECT * FROM question_answers WHERE question_answer_option_id = $1", oId)

    for (const answer of answers.rows) {
        await answerService.deleteAnswer(answer.question_id, answer.question_answer_option_id)
    }

    await executeQuery(
        "DELETE FROM question_answer_options WHERE id = $1", oId
    );
};

const checkAnswer = async (oId, qId) => {
    const isCorrect = (await executeQuery("SELECT is_correct FROM question_answer_options WHERE id = $1 AND question_id = $2", oId, qId)).rows[0]
    if (isCorrect) { 
        return true
    } else {
        return false
    }
};

const fetchCorrectAnswer = async (qId) => {
    const result = await executeQuery(
        "SELECT * FROM question_answer_options WHERE question_id = $1 AND is_correct = $2", qId, true
    ); 
    return result.rows[0];
};

const fetchOptionByOid = async (oId) => {
    const result = await executeQuery(
        "SELECT * FROM question_answer_options WHERE id = $1", oId
    );
    return result.rows;
}

export { listOptions, addOption, deleteOption, checkAnswer, fetchCorrectAnswer, fetchOptionByOid }; 