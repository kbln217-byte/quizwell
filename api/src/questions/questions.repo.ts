import { Prisma } from "@prisma/client";
import { prisma } from "../db";


export async function findAllQuestions() {
  return prisma.question.findMany({
    orderBy: { id: "asc" },
  });
}

export async function findByIdQuestion(id: number, userId: number) {
  const question = await prisma.question.findUnique({
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

if (!question) return null;

return {
  ...question,
  flagged: question.flags.length > 0,
};
}

export async function listQuestions(params: {
  q?: string;
  page: number;
  limit: number;
  userId: number;
}) {
  const { q, page, limit, userId } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.QuestionWhereInput = q
    ? {
        OR: [
          { id:Number(q)

           },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.question.findMany({
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
    prisma.question.count({ where }),
  ]);
  return {     items: items.map((item) => ({
      ...item,
      flagged: item.flags.length > 0,
    })),
    total,
  };
}

export async function findReviewCount(userId: number) {
  return prisma.wrongQuestion.count({
    where: {
      userId,
      resolvedAt: null,
    },
  });
}


