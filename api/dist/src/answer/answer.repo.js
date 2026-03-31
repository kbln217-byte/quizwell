"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnswer = createAnswer;
exports.findAllAnswers = findAllAnswers;
exports.findAnswerById = findAnswerById;
exports.findUserById = findUserById;
exports.findQuestionById = findQuestionById;
exports.findChoiceById = findChoiceById;
exports.findWrongQuestion = findWrongQuestion;
exports.createWrongQuestion = createWrongQuestion;
exports.resolveWrongQuestion = resolveWrongQuestion;
const db_1 = require("../db");
async function createAnswer(input) {
    return db_1.prisma.userQuestionAnswer.create({
        data: {
            userId: input.userId,
            questionId: input.questionId,
            selectedChoiceId: input.selectedChoiceId,
            isCorrect: input.isCorrect,
        },
        include: {
            user: true,
            question: true,
            selectedChoice: true,
        },
    });
}
async function findAllAnswers() {
    return db_1.prisma.userQuestionAnswer.findMany({
        orderBy: { id: "asc" },
        include: {
            user: true,
            question: true,
            selectedChoice: true,
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
async function findWrongQuestion(userId, questionId) {
    return db_1.prisma.wrongQuestion.findUnique({
        where: {
            userId_questionId: {
                userId,
                questionId,
            },
        },
    });
}
async function createWrongQuestion(userId, questionId) {
    return db_1.prisma.wrongQuestion.create({
        data: {
            userId,
            questionId,
        },
    });
}
async function resolveWrongQuestion(id) {
    return db_1.prisma.wrongQuestion.update({
        where: { id },
        data: {
            resolvedAt: new Date(),
        },
    });
}
//# sourceMappingURL=answer.repo.js.map