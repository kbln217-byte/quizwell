import { prisma } from "../db";

export async function findWrongQuestions() {
  return prisma.wrongQuestion.findMany({
    orderBy: { id: "asc" },
    include: {
      user: true,
      question: true,
    },
  });
}

export async function findWrongQuestionById(id: number) {
  return prisma.wrongQuestion.findUnique({
    where: { id },
    include: {
      user: true,
      question: true,
    },
  });
}

export async function findAnswerById(id: number) {
  return prisma.userQuestionAnswer.findUnique({
    where: { id },
    include: {
      user: true,
      question: true,
      selectedChoice: true,
    },
  });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findQuestionById(id: number) {
  return prisma.question.findUnique({
    where: { id },
  });
}

export async function findChoiceById(id: number) {
  return prisma.choice.findUnique({
    where: { id },
  });
}