"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.getAllWrongQuestions = getAllWrongQuestions;
exports.getWrongQuestionById = getWrongQuestionById;
const WrongQuestion_repo_1 = require("./WrongQuestion.repo");
class HttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
exports.HttpError = HttpError;
async function getAllWrongQuestions() {
    return await (0, WrongQuestion_repo_1.findWrongQuestions)();
}
async function getWrongQuestionById(id) {
    const wrongQuestion = await (0, WrongQuestion_repo_1.findWrongQuestionById)(id);
    if (!wrongQuestion) {
        throw new HttpError(404, "NOT_FOUND", "wrong question not found");
    }
    return wrongQuestion;
}
//# sourceMappingURL=WrongQuestion.service.js.map