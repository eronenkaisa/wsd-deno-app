import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import * as topicService from "../../services/topicService.js";



const showMain = async ({ render }) => {
  render("main.eta", { numberOfTopics: await topicService.fetchNumberOfTopics(), numberOfQuestions: await questionService.fetchNumberOfQuestions(), numberOfAnswers: await answerService.fetchNumberOfAnswers() });
};

export { showMain };
