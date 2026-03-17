//答えと問題を対応付ける

const fs = require("fs");
const path = require("path");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const questionsFile = process.argv[2];
const answersFile = process.argv[3];

if (!questionsFile || !answersFile) {
  console.error(
    "使い方: node merge.js parsed/2025-round31-questions.json parsed/2025-round31-answers.json"
  );
  process.exit(1);
}

console.log("start merge");
console.log("questionsFile:", questionsFile);
console.log("answersFile:", answersFile);

const questions = JSON.parse(fs.readFileSync(questionsFile, "utf-8"));
const answers = JSON.parse(fs.readFileSync(answersFile, "utf-8"));

if (questions.length === 0) {
  throw new Error("questions が空です");
}
if (answers.length === 0) {
  throw new Error("answers が空です");
}

const examYear = questions[0].examYear;
const examRound = questions[0].examRound;
const examDate = questions[0].examDate ?? null;

if (answers[0].examYear !== examYear || answers[0].examRound !== examRound) {
  throw new Error("questions と answers の年度・回次が一致しません");
}

const answerMap = new Map();
for (const a of answers) {
  answerMap.set(a.questionNumber, a.correctLabel);
}

const merged = questions.map((q) => {
  const correctLabel = answerMap.get(q.questionNumber);

  if (!correctLabel) {
    console.warn(`正解が見つかりません: 問${q.questionNumber}`);
  }

  return {
    examYear,
    examRound,
    examDate,
    questionNumber: q.questionNumber,
    body: q.body,
    correctLabel,
    choices: q.choices.map((c) => ({
      label: c.label,
      text: c.text,
      isCorrect: c.label === correctLabel,
    })),
  };
});

const outputDir = path.join(process.cwd(), "parsed");
ensureDir(outputDir);

const outputFile = path.join(
  outputDir,
  `${examYear}-round${examRound}-merged.json`
);

fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2), "utf-8");

console.log("merged.json created:", outputFile);
console.log("count:", merged.length);