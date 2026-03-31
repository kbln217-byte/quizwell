import {
  findFlaggedQuestionIdsByUserId,
  findFlag,
  createFlag,
  deleteFlag,
  findByIdQuestion,
} from "./questionFlags.repo";

export async function getFlaggedQuestionIds(userId: number) {
  return findFlaggedQuestionIdsByUserId(userId);
}

export async function getFlagStatus(userId: number, questionId: number) {
  const flag = await findFlag(userId, questionId);
  return { flagged: !!flag };
}

export async function toggleFlag(userId: number, questionId: number) {
  const existing = await findFlag(userId, questionId);

  if (existing) {
    await deleteFlag(userId, questionId);
    return { flagged: false };
  }

  await createFlag(userId, questionId);
  return { flagged: true };
}

export async function getQuestionById(id: number) {
  return findByIdQuestion(id)
}

