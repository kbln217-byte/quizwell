import { prisma } from "../db";

export async function findFlaggedQuestionIdsByUserId(userId: number) {
  const items = await prisma.questionFlag.findMany({
    where: { userId },
    select: { questionId: true },
    orderBy: { questionId: "asc" },
  });

  return items.map((item) => item.questionId);
}

export async function findFlag(userId: number, questionId: number) {
  return prisma.questionFlag.findUnique({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
  });
}

export async function createFlag(userId: number, questionId: number) {
  return prisma.questionFlag.create({
    data: {
      userId,
      questionId,
    },
  });
}

export async function deleteFlag(userId: number, questionId: number) {
  return prisma.questionFlag.delete({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
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