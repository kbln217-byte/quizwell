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
exports.wrongQuestionRouter = void 0;
const express_1 = require("express");
const service = __importStar(require("./WrongQuestion.service"));
exports.wrongQuestionRouter = (0, express_1.Router)();
// POST /wrong-questions
exports.wrongQuestionRouter.post("/", async (req, res, next) => {
    try {
        const body = (req.body ?? {});
        const { userId, questionId, selectedChoiceId } = body;
        if (!Number.isInteger(userId) || userId <= 0) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "userId must be a positive integer",
                },
            });
            return;
        }
        if (!Number.isInteger(questionId) || questionId <= 0) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "questionId must be a positive integer",
                },
            });
            return;
        }
        if (selectedChoiceId != null &&
            (!Number.isInteger(selectedChoiceId) || selectedChoiceId <= 0)) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "selectedChoiceId must be a positive integer",
                },
            });
            return;
        }
    }
    catch (e) {
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
exports.wrongQuestionRouter.get("/", async (req, res, next) => {
    try {
        const wrongQuestions = await service.getAllWrongQuestions();
        res.status(200).json({ wrongQuestions });
    }
    catch (error) {
        next(error);
    }
});
// GET /wrong-questions/:id
exports.wrongQuestionRouter.get("/:id", async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=WrongQuestion.routes.js.map