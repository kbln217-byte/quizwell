"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = require("express");
const review_service_1 = require("./review.service");
exports.reviewRouter = (0, express_1.Router)();
exports.reviewRouter.get("/questions", async (req, res, next) => {
    try {
        const userId = Number(req.query.userId);
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const items = await (0, review_service_1.getReviewQuestions)(userId);
        res.json({ items });
    }
    catch (error) {
        next(error);
    }
});
exports.reviewRouter.get("/count", async (req, res, next) => {
    try {
        const userId = Number(req.query.userId);
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const count = await (0, review_service_1.getReviewCount)(userId);
        res.json({ count });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=review.routes.js.map