"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFlaggedQuestionIdsByUserId = findFlaggedQuestionIdsByUserId;
exports.findFlag = findFlag;
exports.createFlag = createFlag;
exports.deleteFlag = deleteFlag;
exports.findByIdQuestion = findByIdQuestion;
const db_1 = require("../db");
async function findFlaggedQuestionIdsByUserId(userId) {
    const items = await db_1.prisma.questionFlag.findMany({
        where: { userId },
        select: { questionId: true },
        orderBy: { questionId: "asc" },
    });
    return items.map((item) => item.questionId);
}
async function findFlag(userId, questionId) {
    return db_1.prisma.questionFlag.findUnique({
        where: {
            userId_questionId: {
                userId,
                questionId,
            },
        },
    });
}
async function createFlag(userId, questionId) {
    return db_1.prisma.questionFlag.create({
        data: {
            userId,
            questionId,
        },
    });
}
async function deleteFlag(userId, questionId) {
    return db_1.prisma.questionFlag.delete({
        where: {
            userId_questionId: {
                userId,
                questionId,
            },
        },
    });
}
async function findByIdQuestion(id) {
    return db_1.prisma.question.findUnique({
        where: { id },
        include: {
            choices: {
                orderBy: { id: "asc" },
            },
            examSession: true,
        },
    });
}
//# sourceMappingURL=questionFlags.repo.js.map