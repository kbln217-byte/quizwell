import { prisma } from "../db";

export async function findReviewCount(userId: number) {
  return await prisma.wrongQuestion.count({
    where: {
      userId,
      resolvedAt: null,
    },
  });
}

export async function findReviewQuestions(userId: number) {
  return await prisma.wrongQuestion.findMany({
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