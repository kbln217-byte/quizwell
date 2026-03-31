import { use } from "react";
import {
  createAnswer,
  findAllAnswers,
  findAnswerById,
  findUserById,
  findQuestionById,
  findChoiceById,
  findWrongQuestion,
  createWrongQuestion,
  resolveWrongQuestion,
} from "./answer.repo";

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function getAllAnswers() {
  return await findAllAnswers();
}

export async function getAnswerById(id: number) {
  const answer = await findAnswerById(id);

  if (!answer) {
    throw new HttpError(404, "NOT_FOUND", "answer not found");
  }

  return answer;
}

export async function registerAnswer(input: {
  userId?: number;
  questionId?: number;
  selectedChoiceId?: number;
}) {

//バリデーションを作る

  if (!input.userId || !Number.isInteger(input.userId) || input.userId <= 0) {
    throw new HttpError(
      400,
      "VALIDATION_ERROR",
      "userId must be a positive integer"
    );
  }

  if (!input.questionId || !Number.isInteger(input.questionId) || input.questionId <= 0) {
    throw new HttpError(
      400,
      "VALIDATION_ERROR",
      "questionId must be a positive integer"
    );
  }

  if (
    input.selectedChoiceId != null &&
    (!Number.isInteger(input.selectedChoiceId) || input.selectedChoiceId <= 0)
  ) {
    throw new HttpError(
      400,
      "VALIDATION_ERROR",
      "selectedChoiceId must be a positive integer"
    );
  }

//ここまでバリデーションを作る
  const user = await findUserById(input.userId);
  if (!user) {
    throw new HttpError(404, "NOT_FOUND", "user not found");
  }

  const question = await findQuestionById(input.questionId);
  if (!question) {
    throw new HttpError(404, "NOT_FOUND", "question not found");
  }

  let isCorrect = false;

  if (input.selectedChoiceId != null) {
    const choice = await findChoiceById(input.selectedChoiceId);

    if (!choice) {
      throw new HttpError(404, "NOT_FOUND", "choice not found");
    }

    if (choice.questionId !== input.questionId) {
      throw new HttpError(
        400,
        "VALIDATION_ERROR",
        "selectedChoiceId does not belong to questionId"
      );
    }

    isCorrect = choice.isCorrect;
  }

  const wrong = await findWrongQuestion(user.id, question.id);

if (!isCorrect) {
  if (!wrong) {
    await createWrongQuestion(user.id, question.id);
  }
} else {
  if (wrong && !wrong.resolvedAt) {
    await resolveWrongQuestion(wrong.id);
  }
}

  return await createAnswer({
    userId: input.userId,
    questionId: input.questionId,
    selectedChoiceId: input.selectedChoiceId,
    isCorrect,
  });
  


}