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
exports.questionsRouter = void 0;
const express_1 = require("express");
const service = __importStar(require("./questions.service"));
exports.questionsRouter = (0, express_1.Router)();
// 一覧取得
exports.questionsRouter.get("/", async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
});
// 詳細取得
exports.questionsRouter.get("/:id", async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=questions.routes.js.map