import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import * as userService from "../../services/userService.js";

const getData = async (request, user) => {
    const data = {
        name: undefined,
        userId: undefined,
        topics: await topicService.listTopics(),
        errors: [],
        isAdmin: undefined
    }
    if (request) {
        const body = request.body({ type: "form" });
        const params = await body.value;
        data.name = params.get("name")
        data.userId = params.get("user_id")
    }
    return data
}

const validate = (data) => {
    const errors = [];
    if (!data.name || data.name.length == 0 || data.name.length < 1 || data.name == " " || data.name == "  ") {
        errors.push("Name for the topic must have at least 1 character.")
    }
    return errors;
};

const submitFormTopic = async ({ request, response, render, user }) => {
    const data = await getData(request);
    data.errors = validate(data);
    data.userId = user.id
    data.isAdmin = user.admin
    
    if (data.errors.length === 0) {
        if (user.admin) {
            await topicService.addTopic(
                data.userId,
                data.name,
            )
        }

        response.redirect("/topics")
    } else {
        render("topics.eta", data);
    }
}

const addTopic = async ({ request, response }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    await topicService.addTopic(
        params.get("user_id"),
        params.get("name"),
    )
    
    response.redirect("/topics")
};

const listTopics = async ({ render, state, user }) => {
    const isAdmin = user.admin
    render("topics.eta", { isAdmin: isAdmin, topics: await topicService.listTopics() });
};


const deleteTopic = async ({ request, response, params, user }) => {
    const data = getData(request);
    const topic_id = params.topic_id;
    
    if (user.admin) {
        await topicService.deleteTopic(topic_id);
    }
    
    response.redirect("/topics")
}



export { addTopic, listTopics, submitFormTopic, deleteTopic };
