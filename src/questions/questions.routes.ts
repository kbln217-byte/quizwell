import { Router } from "express";
import * as service from "./questions.service";

export const questionsRouter = Router();

// 一覧取得
questionsRouter.get("/", async (req, res, next) => {
  try {
    const questions = await service.getAllQuestions();
    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
});

// 詳細取得
questionsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "id must be a positive integer",
        },
      });
      return;
    }

    const question = await service.getQuestionById(id);
    res.status(200).json({ question });
  } catch (error) {
    next(error);
  }
});