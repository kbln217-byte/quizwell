import { Router } from "express";
import * as service from "./questions.service";

export const questionsRouter = Router();

// 一覧取得
questionsRouter.get("/", async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 200);
    const userId = Number(req.query.userId ?? 2);

    if (!Number.isInteger(page) || page <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "page must be a positive integer",
        },
      });
      return;
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "limit must be a positive integer",
        },
      });
      return;
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "userId must be a positive integer",
        },
      });
      return;
    }

    const result = await service.getQuestions({ q, page, limit, userId });
    res.status(200).json({ questions: result.items, total: result.total });
  } catch (error) {
    next(error);
  }
});

// 詳細取得
questionsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.query.userId ?? 2);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "id must be a positive integer",
        },
      });
      return;
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "userId must be a positive integer",
        },
      });
      return;
    }

    const question = await service.getQuestionById(id, userId);
    res.status(200).json({ question });
  } catch (error) {
    next(error);
  }
});