import "dotenv/config";
import app from "./app";
import { reviewRouter } from "./review/review.routes";
import { questionsRouter } from "./questions/questions.routes";
import { questionFlagsRouter } from "./questionFlags/questionFlags.routes";

const PORT = Number(process.env.PORT) || 3000;

app.use("/review", reviewRouter);
app.use("/questions", questionsRouter);
app.use("/question-flags", questionFlagsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});