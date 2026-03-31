"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWrongQuestions = findWrongQuestions;
exports.findWrongQuestionById = findWrongQuestionById;
exports.findAnswerById = findAnswerById;
exports.findUserById = findUserById;
exports.findQuestionById = findQuestionById;
exports.findChoiceById = findChoiceById;
const db_1 = require("../db");
async function findWrongQuestions() {
    return db_1.prisma.wrongQuestion.findMany({
        orderBy: { id: "asc" },
        include: {
            user: true,
            question: true,
        },
    });
}
async function findWrongQuestionById(id) {
    return db_1.prisma.wrongQuestion.findUnique({
        where: { id },
        include: {
            user: true,
            question: true,
        },
    });
}
async function findAnswerById(id) {
    return db_1.prisma.userQuestionAnswer.findUnique({
        where: { id },
        include: {
            user: true,
            question: true,
            selectedChoice: true,
        },
    });
}
async function findUserById(id) {
    return db_1.prisma.user.findUnique({
        where: { id },
    });
}
async function findQuestionById(id) {
    return db_1.prisma.question.findUnique({
        where: { id },
    });
}
async function findChoiceById(id) {
    return db_1.prisma.choice.findUnique({
        where: { id },
    });
}
//# sourceMappingURL=WrongQuestion.repo.js.map