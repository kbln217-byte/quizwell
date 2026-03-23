import { Prisma } from "@prisma/client";
import { prisma } from "../db";


export async function findAllQuestions() {
  return prisma.question.findMany({
    orderBy: { id: "asc" },
  });
}

export async function findByIdQuestion(id: number) {
  return prisma.question.findUnique({
    where: { id },
    include: {
        choices: {
            orderBy: { id: "asc" },
        },
        examSession: true,
    },
  });
}

export async function listQuestions(params: {
  q?: string;
  page: number;
  limit: number;
}) {
  const { q, page, limit } = params;
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
      
      orderBy: [
        { examSessionId: "asc" },
        { questionNumber: "asc" },
      ],
    }),
    prisma.question.count({ where }),
  ]);
  return { items, total };
}

export async function findReviewCount(userId: number) {
  return prisma.wrongQuestion.count({
    where: {
      userId,
      resolvedAt: null,
    },
  });
}


