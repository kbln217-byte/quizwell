import {
  findWrongQuestions,
  findWrongQuestionById,
  findUserById,
  findQuestionById,
  findChoiceById,
} from "./WrongQuestion.repo";

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function getAllWrongQuestions() {
  return await findWrongQuestions();
}

export async function getWrongQuestionById(id: number) {
  const wrongQuestion = await findWrongQuestionById(id);

  if (!wrongQuestion) {
    throw new HttpError(404, "NOT_FOUND", "wrong question not found");
  }

  return wrongQuestion;
}

