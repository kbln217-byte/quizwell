import {
  findAllQuestions,
  findByIdQuestion,
} from "./questions.repo";

export async function getAllQuestions() {
  return await findAllQuestions();
}

export async function getQuestionById(id: number) {
  const question = await findByIdQuestion(id);

  if (!question) {
    throw new Error("question not found");
  }

  return question;
}