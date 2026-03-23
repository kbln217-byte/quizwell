import express from "express";
import { usersRouter } from "./users/users.routes";
import { sessionsRouter } from "./examSessions/examSessions.routes";
import { answerRouter } from "./answer/answer.routes";
import { questionsRouter } from "./questions/questions.routes";
import { reviewRouter } from "./review/review.routes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ここでAPIを登録
app.use("/users", usersRouter);
app.use("/sessions", sessionsRouter);
app.use("/questions", questionsRouter);
app.use("/answers", answerRouter);
app.use("/review", reviewRouter);

app.get("/", (_req, res) => {
  res.send("hello");
});

app.use((err: any, _req: any, res: any, _next: any) => {
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

export default app;

