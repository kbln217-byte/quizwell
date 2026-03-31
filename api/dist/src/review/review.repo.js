"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReviewCount = findReviewCount;
exports.findReviewQuestions = findReviewQuestions;
const db_1 = require("../db");
async function findReviewCount(userId) {
    return await db_1.prisma.wrongQuestion.count({
        where: {
            userId,
            resolvedAt: null,
        },
    });
}
async function findReviewQuestions(userId) {
    return await db_1.prisma.wrongQuestion.findMany({
        where: {
            userId,
            resolvedAt: null,
        },
        include: {
            question: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}
//# sourceMappingURL=review.repo.js.map