"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewCount = getReviewCount;
exports.getReviewQuestions = getReviewQuestions;
const review_repo_1 = require("./review.repo");
async function getReviewCount(userId) {
    return await (0, review_repo_1.findReviewCount)(userId);
}
async function getReviewQuestions(userId) {
    const items = await (0, review_repo_1.findReviewQuestions)(userId);
    return items.map((item) => ({
        questionId: item.question.id,
        questionNumber: item.question.questionNumber,
        body: item.question.body,
    }));
}
//# sourceMappingURL=review.service.js.map