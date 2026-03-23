import { Router } from "express";
import * as service from "./examSessions.service";


export const sessionsRouter = Router();

// 一覧取得
sessionsRouter.get("/", async (req, res, next) => {
  try {
    const sessions = await service.getAllSessions();
    res.status(200).json({ sessions });
  } catch (error) {
    next(error);
  }
});

// 詳細取得
sessionsRouter.get("/:id", async (req, res, next) => {
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

    const session = await service.getSessionById(id);
    res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
});

