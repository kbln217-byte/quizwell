import { prisma } from "../db";

export async function createAnswer(input: {
  userId: number;
  questionId: number;
  selectedChoiceId?: number;
  isCorrect: boolean;
}) {
  return prisma.userQuestionAnswer.create({
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

export async function findAllAnswers() {
  return prisma.userQuestionAnswer.findMany({
    orderBy: { id: "asc" },
    include: {
      user: true,
      question: true,
      selectedChoice: true,
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

export async function findWrongQuestion(userId: number, questionId: number) {
  return prisma.wrongQuestion.findUnique({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
  });
}

export async function createWrongQuestion(userId: number, questionId: number) {
  return prisma.wrongQuestion.create({
    data: {
      userId,
      questionId,
    },
  });
}

export async function resolveWrongQuestion(id: number) {
  return prisma.wrongQuestion.update({
    where: { id },
    data: {
      resolvedAt: new Date(),
    },
  });
}
