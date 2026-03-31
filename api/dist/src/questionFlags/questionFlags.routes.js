"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsRouter = exports.questionFlagsRouter = void 0;
const express_1 = require("express");
const service = __importStar(require("./questionFlags.service"));
exports.questionFlagsRouter = (0, express_1.Router)();
// GET /question-flags?userId=2
exports.questionFlagsRouter.get("/", async (req, res) => {
    const userId = Number(req.query.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ message: "userId is required" });
    }
    const questionIds = await service.getFlaggedQuestionIds(userId);
    return res.status(200).json({ questionIds });
});
// GET /question-flags/10?userId=2
exports.questionFlagsRouter.get("/:questionId", async (req, res) => {
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
exports.questionFlagsRouter.post("/toggle", async (req, res) => {
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
exports.questionsRouter = (0, express_1.Router)();
exports.questionsRouter.get("/:id", async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=questionFlags.routes.js.map