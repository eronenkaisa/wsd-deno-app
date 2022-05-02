import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

const pickRandomQuestion = async ({ response, params }) => {
    const randomQuestion = await questionService.pickRandomQuestion();
    const randomOptions = await optionService.listOptions(randomQuestion.id);

    for (let i = 0; i < randomOptions.length; i++) {
        delete randomOptions[i].question_id;
        delete randomOptions[i].is_correct;
    };

    const result = {
        questionId: randomQuestion.id,
        questionText: randomQuestion.question_text,
        answerOptions: randomOptions          

    };
    response.body = result;
};

const checkAnswer = async ({ response, request }) => {
    const body = await request.body().value;

    const result = await optionService.checkAnswer(body.questionId, body.optionId);

    response.body = { correct: result };
}

export { pickRandomQuestion, checkAnswer }