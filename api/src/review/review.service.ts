import { findReviewCount, findReviewQuestions } from "./review.repo";

export async function getReviewCount(userId: number) {
  return await findReviewCount(userId);
}

export async function getReviewQuestions(userId: number) {
  const items = await findReviewQuestions(userId);

  return items.map((item) => ({
    questionId: item.question.id,
    questionNumber: item.question.questionNumber,
    body: item.question.body,
  }));
}