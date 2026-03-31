"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.getAllAnswers = getAllAnswers;
exports.getAnswerById = getAnswerById;
exports.registerAnswer = registerAnswer;
const answer_repo_1 = require("./answer.repo");
class HttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
exports.HttpError = HttpError;
async function getAllAnswers() {
    return await (0, answer_repo_1.findAllAnswers)();
}
async function getAnswerById(id) {
    const answer = await (0, answer_repo_1.findAnswerById)(id);
    if (!answer) {
        throw new HttpError(404, "NOT_FOUND", "answer not found");
    }
    return answer;
}
async function registerAnswer(input) {
    //バリデーションを作る
    if (!input.userId || !Number.isInteger(input.userId) || input.userId <= 0) {
        throw new HttpError(400, "VALIDATION_ERROR", "userId must be a positive integer");
    }
    if (!input.questionId || !Number.isInteger(input.questionId) || input.questionId <= 0) {
        throw new HttpError(400, "VALIDATION_ERROR", "questionId must be a positive integer");
    }
    if (input.selectedChoiceId != null &&
        (!Number.isInteger(input.selectedChoiceId) || input.selectedChoiceId <= 0)) {
        throw new HttpError(400, "VALIDATION_ERROR", "selectedChoiceId must be a positive integer");
    }
    //ここまでバリデーションを作る
    const user = await (0, answer_repo_1.findUserById)(input.userId);
    if (!user) {
        throw new HttpError(404, "NOT_FOUND", "user not found");
    }
    const question = await (0, answer_repo_1.findQuestionById)(input.questionId);
    if (!question) {
        throw new HttpError(404, "NOT_FOUND", "question not found");
    }
    let isCorrect = false;
    if (input.selectedChoiceId != null) {
        const choice = await (0, answer_repo_1.findChoiceById)(input.selectedChoiceId);
        if (!choice) {
            throw new HttpError(404, "NOT_FOUND", "choice not found");
        }
        if (choice.questionId !== input.questionId) {
            throw new HttpError(400, "VALIDATION_ERROR", "selectedChoiceId does not belong to questionId");
        }
        isCorrect = choice.isCorrect;
    }
    const wrong = await (0, answer_repo_1.findWrongQuestion)(user.id, question.id);
    if (!isCorrect) {
        if (!wrong) {
            await (0, answer_repo_1.createWrongQuestion)(user.id, question.id);
        }
    }
    else {
        if (wrong && !wrong.resolvedAt) {
            await (0, answer_repo_1.resolveWrongQuestion)(wrong.id);
        }
    }
    return await (0, answer_repo_1.createAnswer)({
        userId: input.userId,
        questionId: input.questionId,
        selectedChoiceId: input.selectedChoiceId,
        isCorrect,
    });
}
//# sourceMappingURL=answer.service.js.map