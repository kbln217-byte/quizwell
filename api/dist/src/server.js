"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const review_routes_1 = require("./review/review.routes");
const questions_routes_1 = require("./questions/questions.routes");
const questionFlags_routes_1 = require("./questionFlags/questionFlags.routes");
const PORT = Number(process.env.PORT) || 3000;
app_1.default.use("/review", review_routes_1.reviewRouter);
app_1.default.use("/questions", questions_routes_1.questionsRouter);
app_1.default.use("/question-flags", questionFlags_routes_1.questionFlagsRouter);
app_1.default.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map