import {
  findAllQuestions,
  findByIdQuestion,
  listQuestions
} from "./questions.repo";

export async function getAllQuestions() {
  return await findAllQuestions();
}

export async function getQuestionById(id: number, userId: number) {
  const question = await findByIdQuestion(id, userId);

  if (!question) {
    throw new Error("question not found");
  }

  return question;
}

export async function getQuestions(params: {
  q?: string;
  page: number;
  limit: number;
  userId: number;
}) {
  return await listQuestions(params);
}