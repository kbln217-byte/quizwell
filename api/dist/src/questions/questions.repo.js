"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllQuestions = findAllQuestions;
exports.findByIdQuestion = findByIdQuestion;
exports.listQuestions = listQuestions;
exports.findReviewCount = findReviewCount;
const db_1 = require("../db");
async function findAllQuestions() {
    return db_1.prisma.question.findMany({
        orderBy: { id: "asc" },
    });
}
async function findByIdQuestion(id, userId) {
    const question = await db_1.prisma.question.findUnique({
        where: { id },
        include: {
            choices: {
                orderBy: { id: "asc" },
            },
            examSession: true,
            flags: {
                where: { userId },
            },
        },
    });
    if (!question)
        return null;
    return {
        ...question,
        flagged: question.flags.length > 0,
    };
}
async function listQuestions(params) {
    const { q, page, limit, userId } = params;
    const skip = (page - 1) * limit;
    const where = q
        ? {
            OR: [
                { id: Number(q)
                },
            ],
        }
        : {};
    const [items, total] = await Promise.all([
        db_1.prisma.question.findMany({
            where,
            skip,
            take: limit,
            include: {
                flags: {
                    where: { userId },
                },
            },
            orderBy: [
                { examSessionId: "asc" },
                { questionNumber: "asc" },
            ],
        }),
        db_1.prisma.question.count({ where }),
    ]);
    return { items: items.map((item) => ({
            ...item,
            flagged: item.flags.length > 0,
        })),
        total,
    };
}
async function findReviewCount(userId) {
    return db_1.prisma.wrongQuestion.count({
        where: {
            userId,
            resolvedAt: null,
        },
    });
}
//# sourceMappingURL=questions.repo.js.map