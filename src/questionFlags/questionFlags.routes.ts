import { Router, Request, Response } from "express";
import * as service from "./questionFlags.service";

export const questionFlagsRouter = Router();


// GET /question-flags?userId=2
questionFlagsRouter.get("/", async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "userId is required" });
  }

  const questionIds = await service.getFlaggedQuestionIds(userId);
  return res.status(200).json({ questionIds });
});

// GET /question-flags/10?userId=2
questionFlagsRouter.get("/:questionId", async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  const questionId = Number(req.params.questionId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(400).json({ message: "questionId is invalid" });
  }

  const result = await service.getFlagStatus(userId, questionId);
  return res.status(200).json(result);
});

// POST /question-flags/toggle
questionFlagsRouter.post("/toggle", async (req: Request, res: Response) => {
  const userId = Number(req.body?.userId);
  const questionId = Number(req.body?.questionId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(400).json({ message: "questionId is invalid" });
  }

  const result = await service.toggleFlag(userId, questionId);
  return res.status(200).json(result);
});

export const questionsRouter = Router();

questionsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "id must be a positive integer",
        },
      })
      return
    }

    const question = await service.getQuestionById(id)
    res.status(200).json({ question })
  } catch (error) {
    next(error)
  }
})