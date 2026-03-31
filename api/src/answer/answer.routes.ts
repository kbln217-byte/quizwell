import { Router } from "express";
import * as service from "./answer.service";

export const answerRouter = Router();

// POST /answers
answerRouter.post("/", async (req, res, next) => {
  try {
    console.log("req.body = ", req.body);
    const body = (req.body ?? {}) as {
      userId?: number;
      questionId?: number;
      selectedChoiceId?: number;
    };

    const { userId, questionId, selectedChoiceId } = body;

    if (!Number.isInteger(userId) || userId! <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "userId must be a positive integer",
        },
      });
      return;
    }

    if (!Number.isInteger(questionId) || questionId! <= 0) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "questionId must be a positive integer",
        },
      });
      return;
    }

    if (
      selectedChoiceId != null &&
      (!Number.isInteger(selectedChoiceId) || selectedChoiceId <= 0)
    ) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "selectedChoiceId must be a positive integer",
        },
      });
      return;
    }

    const answer = await service.registerAnswer({
      userId,
      questionId,
      selectedChoiceId,
    });

    res.status(201).json({ answer });
  } catch (error) {
    next(error);
  }
});

// GET /answers
answerRouter.get("/", async (req, res, next) => {
  try {
    const answers = await service.getAllAnswers();
    res.status(200).json({ answers });
  } catch (error) {
    next(error);
  }
});

// GET /answers/:id
answerRouter.get("/:id", async (req, res, next) => {
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

    const answer = await service.getAnswerById(id);
    res.status(200).json({ answer });
  } catch (error) {
    next(error);
  }
});