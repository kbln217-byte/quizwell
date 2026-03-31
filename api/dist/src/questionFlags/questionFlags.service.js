"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlaggedQuestionIds = getFlaggedQuestionIds;
exports.getFlagStatus = getFlagStatus;
exports.toggleFlag = toggleFlag;
exports.getQuestionById = getQuestionById;
const questionFlags_repo_1 = require("./questionFlags.repo");
async function getFlaggedQuestionIds(userId) {
    return (0, questionFlags_repo_1.findFlaggedQuestionIdsByUserId)(userId);
}
async function getFlagStatus(userId, questionId) {
    const flag = await (0, questionFlags_repo_1.findFlag)(userId, questionId);
    return { flagged: !!flag };
}
async function toggleFlag(userId, questionId) {
    const existing = await (0, questionFlags_repo_1.findFlag)(userId, questionId);
    if (existing) {
        await (0, questionFlags_repo_1.deleteFlag)(userId, questionId);
        return { flagged: false };
    }
    await (0, questionFlags_repo_1.createFlag)(userId, questionId);
    return { flagged: true };
}
async function getQuestionById(id) {
    return (0, questionFlags_repo_1.findByIdQuestion)(id);
}
//# sourceMappingURL=questionFlags.service.js.map