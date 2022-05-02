import * as optionService from "../../services/optionService.js";
import * as answerService from "../../services/answerService.js";
import * as questionService from "../../services/questionService.js";


const getData = async (request, topicId, qId) => {
    const data = {
        userId: undefined,
        topicId: topicId,
        questionId: qId,
        optionText: undefined,
        isCorrect: undefined,
        options: await optionService.listOptions(qId),
        questionName: (await questionService.fetchQuestionByQid(qId))[0].question_text,
        errors: [],
    }
    if (request) {
        const body = request.body({ type: "form" });
        const params = await body.value;
        data.optionText = params.get("option_text")
        data.isCorrect = params.get("is_correct") === "on"
        data.userId = params.get("user_id")
    }
    return data
}

const validate = (data) => {
    const errors = [];
    if (!data.optionText || data.optionText == 0 || data.optionText < 1 || data.optionText == " " || data.optionText == "  ") {
        errors.push("Option must have at least 1 character.")
    }
    return errors;
};



const submitFormOption = async ({ request, response, render, params, user }) => {
    const data = await getData(request, params.topic_id, params.qId);
    data.errors = validate(data);
    data.userId = user.id
    
    
    if (data.errors.length === 0) {
        await optionService.addOption(
            data.questionId,
            data.optionText,
            data.isCorrect,
        )
        
        response.redirect(`/topics/${Number(data.topicId)}/questions/${Number(data.questionId)}`)
    } else {
        render("options.eta", data);
    }
}


const listOptions = async ({ render, params, request, user }) => {
    const data = await getData(request, params.topic_id, params.qId);

    render("options.eta", { questionName: data.questionName, options: await optionService.listOptions(params.qId), questionId: params.qId, topicId: params.topic_id })
};

const deleteOption = async ({ request, params, response }) => {
    const data = await getData(request, params.topic_id, params.qId);
    const oId = params.oId
    await optionService.deleteOption(oId);
    await answerService.deleteAnswer(undefined, params.qId, oId)
    response.redirect(`/topics/${Number(data.topicId)}/questions/${Number(data.questionId)}`)
}

export { listOptions, submitFormOption, deleteOption };