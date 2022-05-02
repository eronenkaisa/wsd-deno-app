import { executeQuery } from "../../database/database.js";
import * as answerService from "../../services/answerService.js";
import * as optionService from "../../services/optionService.js";
import * as questionService from "../../services/questionService.js";


const addAnswerAndCheck = async ({ render, params, response, user }) => {
    await answerService.addAnswer(user.id, params.qId, params.oId)

    const correctAnswer = await optionService.fetchCorrectAnswer(params.qId)

    if (Number(params.oId) == Number(correctAnswer.id)) {
        response.redirect(`/quiz/${Number(params.tId)}/questions/${Number(params.qId)}/correct`)
    } else {
        response.redirect(`/quiz/${Number(params.tId)}/questions/${Number(params.qId)}/incorrect`)
    }
};

const showCorrectPage = async ({ render, params, response }) => {
    
    render("correctPage.eta", { tId: await params.tId });
    
}

const showIncorrectPage = async ({ render, params, response }) => {
    const correctoptiontext = (await optionService.fetchCorrectAnswer(params.qId)).option_text
    
    render("incorrectPage.eta", { tId: await params.tId, correctOptionText: (await optionService.fetchCorrectAnswer(params.qId)).option_text });
    
}
export { addAnswerAndCheck, showCorrectPage, showIncorrectPage }
