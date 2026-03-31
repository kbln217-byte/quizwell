"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllQuestions = getAllQuestions;
exports.getQuestionById = getQuestionById;
exports.getQuestions = getQuestions;
const questions_repo_1 = require("./questions.repo");
async function getAllQuestions() {
    return await (0, questions_repo_1.findAllQuestions)();
}
async function getQuestionById(id, userId) {
    const question = await (0, questions_repo_1.findByIdQuestion)(id, userId);
    if (!question) {
        throw new Error("question not found");
    }
    return question;
}
async function getQuestions(params) {
    return await (0, questions_repo_1.listQuestions)(params);
}
//# sourceMappingURL=questions.service.js.map