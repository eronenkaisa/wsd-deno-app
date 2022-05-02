import { executeQuery } from "../database/database.js";
import * as questionService from "../services/questionService.js";

const addTopic = async (user_id, name) => {
    await executeQuery(
        "INSERT INTO topics (user_id, name) VALUES ($1, $2)", user_id, name
    );
    const result = await executeQuery("SELECT * FROM topics WHERE user_id = $1 AND name = $2 ", user_id, name)
    return result.rows[0];
};

const listTopics = async () => {
    const result = await executeQuery(
        "SELECT * FROM topics ORDER BY name ASC"
    );
    return result.rows;
};

const deleteTopic = async (topic_id) => {
    const questions = await executeQuery("SELECT * FROM questions WHERE topic_id = $1", topic_id)

    for (const question of questions.rows) {
        await questionService.deleteQuestion(question.id)
    };
 
    await executeQuery(
        "DELETE FROM topics WHERE id = $1", topic_id
    );
};

const fetchNumberOfTopics = async () => {
    const result = await executeQuery(
        "SELECT * FROM topics"
    );
    return result.rows.length
};

const fetchTopicByTid = async (tId) => {
    const result = await executeQuery(
        "SELECT * FROM topics WHERE id = $1", tId
    );
    return result.rows[0];
};


export { addTopic, listTopics, deleteTopic, fetchNumberOfTopics, fetchTopicByTid };