import { Router } from "express";
import { getReviewCount, getReviewQuestions } from "./review.service";

export const reviewRouter = Router();

reviewRouter.get("/questions", async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const items = await getReviewQuestions(userId);
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

reviewRouter.get("/count", async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const count = await getReviewCount(userId);
    res.json({ count });
  } catch (error) {
    next(error);
  }
});