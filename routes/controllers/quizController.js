import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

const listTopics = async ({ render }) => {
    
    render("quiz.eta", { topics: await topicService.listTopics() });
};

const pickRandomQuestionById = async({ params, response, render }) => {
    const question =  await questionService.pickRandomQuestionById(params.tId)
    if (question == undefined) {
        render("empty.eta", { info: "There are currently no questions for this topic."});
    }

    response.redirect(`/quiz/${Number(question.topic_id)}/questions/${Number(question.id)}`)
};

const showRandomQuestion = async ({ render, params }) => {
    const question = await questionService.fetchQuestionByQid(params.qId);
    const options = await optionService.listOptions(params.qId);

    render("randomQuestion.eta", { question: question[0], options: options });
};



export { listTopics, pickRandomQuestionById, showRandomQuestion }