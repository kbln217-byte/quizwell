import { Router } from "express";
import * as service from "./WrongQuestion.service";

export const wrongQuestionRouter = Router();

// POST /wrong-questions
wrongQuestionRouter.post("/", async (req, res, next) => {
  try {
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

  } catch (e: any) {
    if (e?.code === "23505") {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "wrong question already exists",
          },
        });
    }
    throw e;
  }

});

// GET /wrong-questions
wrongQuestionRouter.get("/", async (req, res, next) => {
  try {
    const wrongQuestions = await service.getAllWrongQuestions();
    res.status(200).json({ wrongQuestions });
  } catch (error) {
    next(error);
  }
});

// GET /wrong-questions/:id
wrongQuestionRouter.get("/:id", async (req, res, next) => {
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

    const wrongQuestion = await service.getWrongQuestionById(id);
    res.status(200).json({ wrongQuestion });
  } catch (error) {
    next(error);
  }
});