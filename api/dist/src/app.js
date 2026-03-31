"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = require("./users/users.routes");
const examSessions_routes_1 = require("./examSessions/examSessions.routes");
const answer_routes_1 = require("./answer/answer.routes");
const questions_routes_1 = require("./questions/questions.routes");
const review_routes_1 = require("./review/review.routes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ここでAPIを登録
app.use("/users", users_routes_1.usersRouter);
app.use("/sessions", examSessions_routes_1.sessionsRouter);
app.use("/questions", questions_routes_1.questionsRouter);
app.use("/answers", answer_routes_1.answerRouter);
app.use("/review", review_routes_1.reviewRouter);
app.get("/", (_req, res) => {
    res.send("hello");
});
app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    const message = err.message || "Something went wrong";
    res.status(status).json({
        error: {
            code,
            message,
        },
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map