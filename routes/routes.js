import { Router } from "../deps.js";
import { listTopics } from "../services/topicService.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as optionController from "./controllers/optionController.js";

import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as answerController from "./controllers/answerController.js";

import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.listTopics);
router.post("/topics", topicController.submitFormTopic);

router.post("/topics/:topic_id/delete", topicController.deleteTopic);



router.get("/topics/:topic_id", questionController.listQuestions);
router.post("/topics/:topic_id/questions", questionController.submitFormQuestion);
router.post("/topics/:topic_id/questions/:qId/delete", questionController.deleteQuestion);

router.get("/topics/:topic_id/questions/:qId", optionController.listOptions);
router.post("/topics/:topic_id/questions/:qId/options", optionController.submitFormOption);
router.post("/topics/:topic_id/questions/:qId/options/:oId/delete", optionController.deleteOption);


router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/quiz", quizController.listTopics);
router.get("/quiz/:tId", quizController.pickRandomQuestionById);
router.get("/quiz/:tId/questions/:qId", quizController.showRandomQuestion);
router.post("/quiz/:tId/questions/:qId/options/:oId", answerController.addAnswerAndCheck);

router.get("/quiz/:tId/questions/:qId/correct", answerController.showCorrectPage);
router.get("/quiz/:tId/questions/:qId/incorrect", answerController.showIncorrectPage);

router.get("/api/questions/random", questionApi.pickRandomQuestion);
router.post("/api/questions/answer", questionApi.checkAnswer)

export { router };
