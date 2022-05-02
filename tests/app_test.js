import { assertEquals } from "https://deno.land/std@0.120.0/testing/asserts.ts";
import * as topicService from "../services/topicService.js";
import * as questionService from "../services/questionService.js";
import * as optionService from "../services/optionService.js";
import * as userService from "../services/userService.js";
import * as answerService from "../services/answerService.js";
import "../database/database.js"
import { superoak } from "https://deno.land/x/superoak@4.6.0/mod.ts";

Deno.test("checkAnswer should return 'true' for correct answer", () => {
    questionService.pickRandomQuestion().then((question) => {
        optionService.fetchCorrectAnswer(question.id).then((correctOption) => {
            optionService.checkAnswer(correctOption.id, question.id).then((answer) => {
                assertEquals(answer, true);
            })
        })
    })
});

Deno.test("addQuestion should add question to database", () => {
    userService.deleteUser("TEST USER").then(() => {
        userService.addUser("TEST USER", "").then((user) => {
            questionService.addQuestion(user.id, 8888, "TEST QUESTION").then((newQuestion) => {
                questionService.fetchQuestionByQid(newQuestion.id).then((question) => {
                    assertEquals(question.question_text, "TEST QUESTION");
                })
            });
        })
    })
});

Deno.test("addTopic should add topic to database", async () => {
    userService.deleteUser("TEST USER").then(() => {
        userService.addUser("TEST USER", "").then((user) => {
            topicService.addTopic(user.id, 8888, "TEST TOPIC").then((newTopic) => {
                topicService.fetchTopicByTid(newTopic.id).then((topic) => {
                    assertEquals(topic.name, "TEST TOPIC");
                })
            });
        })
    })
});

Deno.test("addOption should add option to database", async () => {
    userService.deleteUser("TEST USER").then(() => {
        userService.addUser("TEST USER", "").then((user) => {
            topicService.addTopic(user.id, 8888, "TEST TOPIC").then((newTopic) => {
                questionService.addQuestion(user.id, newTopic.id, "NEW QUESTION").then((newQuestion) => {
                    optionService.addOption(newQuestion.id, "TEST OPTION", false).then((newOption) => {
                        optionService.fetchOptionByOid(newOption.id).then((option) => {
                            assertEquals(option.id, "TEST OPTION")
                        })
                    })
                })
            });
        })
    })
})

Deno.test("addAnswer should add answer to database", async () => {
    userService.deleteUser("TEST USER").then(() => {
        userService.addUser("TEST USER", "").then((user) => {
            topicService.addTopic(user.id, 8888, "TEST TOPIC").then((newTopic) => {
                questionService.addQuestion(user.id, newTopic.id, "NEW QUESTION").then((newQuestion) => {
                    optionService.addOption(newQuestion.id, "TEST OPTION", false).then((newOption) => {
                        answerService.addAnswer(user.id, newQuestion.id, newOption.id).then((newAnswer) => {
                            answerService.fetchAnswerByAid(newAnswer.id).then((answer) => {
                                assertEquals(answer.option_id, newAnswer.option_id)
                            })
                        })
                    })
                })
            });
        })
    })
})

Deno.test("addTopic should not add topic with unknown user_id", async () => {
    topicService.addTopic(9988, "TEST TOPIC").then((newTopic) => {
        topicService.fetchTopicByTid(newTopic.id).then((topic) => {
            assertEquals(topic.id, false)
        })
    })
})

Deno.test("addQuestion should not add question with unknown topic_id", async () => {
    userService.addUser("TEST USER", "").then((user) => {
        questionService.addQuestion(user.id, 7777, "TEST QUESTION").then((newQuestion) => {
            questionService.fetchQuestionByQid(newQuestion.id).then((question) => {
                assertEquals(question.id, false)
            })
        })
    })
})

Deno.test("addOption should not add option with unknown question_id", async () => {
    optionService.addOption(6666, "TEST OPTION", false).then((newOption) => {
        optionService.fetchOptionByOid(newOption.id).then((option) => {
            assertEquals(option.id, false)
        })
    })
})

Deno.test("addAnswer should not add answer with unknown option_id", async () => {
    userService.addUser("TEST USER", "").then((user) => {
        topicService.addTopic(user.id, 8888, "TEST TOPIC").then((newTopic) => {
            questionService.addQuestion(user.id, newTopic.id, "TEST QUESTION").then((newQuestion) => {
                answerService.addAnswer(user.id, newQuestion.id, 5555).then((newAnswer) => {
                    answerService.fetchAnswerByAid(newAnswer.id).then((answer) => {
                        assertEquals(answer.id, false)
                    })
                })
            })
        })    
    })
})

Deno.test("deleteTopic should delete all related questions", async () => {
    userService.addUser("TEST USER", "").then((user) => {
        topicService.addTopic(user.id, "TEST TOPIC").then((newTopic) => {
            questionService.addQuestion(user.id, newTopic.id, "TEST QUESTION").then(() => {
                topicService.deleteTopic(newTopic.id).then(() => {
                    questionService.listQuestions(newTopic.id).then((questions) => {
                        assertEquals(questions, [])
                    })
                })
            })
        })
    })
})