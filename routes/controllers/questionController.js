import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";

const getData = async (request, topicId) => {
    const data = {
        userId: undefined,
        topicId: topicId,
        topicName: (await topicService.fetchTopicByTid(topicId)).name,
        question_text: undefined,
        questions: await questionService.listQuestions(topicId),
        errors: [],
    }
    if (request) {
        const body = request.body({ type: "form" });
        const params = await body.value;
        data.question_text = params.get("question_text")
        data.userId = params.get("user_id")
    }
    return data
}

const validate = (data) => {
    const errors = [];
    if (!data.question_text || data.question_text.length == 0 || data.question_text.length < 1 || data.question_text == " " || data.question_text == "  ") {
        errors.push("Question must have at least 1 character.")
    }
    return errors;
};



const submitFormQuestion = async ({ request, response, render, params, user }) => {
    const data = await getData(request, params.topic_id);
    data.errors = validate(data);
    data.userId = user.id
    
    if (data.errors.length === 0) {
        await questionService.addQuestion(
            data.userId,
            data.topicId,
            data.question_text,
        )
        
        response.redirect(`/topics/${Number(data.topicId)}`)
    } else {
        render("questions.eta", data);
    }
}

const listQuestions = async ({ render, params, request }) => {
    const data = await getData(request, params.topic_id);
    render("questions.eta", { topicName: data.topicName, questions: await questionService.listQuestions(params.topic_id), topicId: params.topic_id });
};

const deleteQuestion = async ({ request, response, params}) => {
    const data = await getData(request, params.topic_id);
    const qId = params.qId
    await questionService.deleteQuestion(qId);
    response.redirect(`/topics/${Number(data.topicId)}`);
};



export { listQuestions, submitFormQuestion, deleteQuestion };
