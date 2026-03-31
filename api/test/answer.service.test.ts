import { describe, it, expect, vi, beforeEach } from "vitest";
import * as repo from "../src/answer/answer.repo";
import { registerAnswer } from "../src/answer/answer.service";

vi.mock("../src/answer/answer.repo", () => ({
  createAnswer: vi.fn(),
  findAllAnswers: vi.fn(),
  findAnswerById: vi.fn(),
  findUserById: vi.fn(),
  findQuestionById: vi.fn(),
  findChoiceById: vi.fn(),
  findWrongQuestion: vi.fn(),
  createWrongQuestion: vi.fn(),
  resolveWrongQuestion: vi.fn(),
}));

describe("registerAnswer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws 400 when userId is invalid", async () => {
    await expect(
      registerAnswer({ userId: 0, questionId: 1, selectedChoiceId: 2 })
    ).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "userId must be a positive integer",
    });
  });

  it("throws 404 when user is not found", async () => {
    vi.mocked(repo.findUserById).mockResolvedValue(null);

    await expect(
      registerAnswer({ userId: 2, questionId: 1, selectedChoiceId: 2 })
    ).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
      message: "user not found",
    });
  });

  it("creates answer when input is valid", async () => {
    vi.mocked(repo.findUserById).mockResolvedValue({
      id: 2,
      name: "maitake",
      email: "mai@example.com",
    } as any);

    vi.mocked(repo.findQuestionById).mockResolvedValue({
      id: 1,
      body: "question body",
    } as any);

    vi.mocked(repo.findChoiceById).mockResolvedValue({
      id: 2,
      questionId: 1,
      isCorrect: true,
    } as any);

    vi.mocked(repo.findWrongQuestion).mockResolvedValue(null);

    vi.mocked(repo.createAnswer).mockResolvedValue({
      id: 1,
      userId: 2,
      questionId: 1,
      selectedChoiceId: 2,
      isCorrect: true,
    } as any);

    const result = await registerAnswer({
      userId: 2,
      questionId: 1,
      selectedChoiceId: 2,
    });

    expect(repo.createAnswer).toHaveBeenCalledTimes(1);
    expect(result.isCorrect).toBe(true);
  });
});