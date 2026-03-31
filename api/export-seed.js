const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

function loadDatabaseUrlFromEnvFile() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const envText = fs.readFileSync(envPath, "utf-8");
  const match = envText.match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?\s*$/m);

  if (match) {
    process.env.DATABASE_URL = match[1];
  }
}

loadDatabaseUrlFromEnvFile();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in the environment.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
  errorFormat: "pretty",
});

const outputDir = path.join(__dirname, "seed-data");

function formatDateOnly(value) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

function writeJsonFile(fileName, payload) {
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  console.log(`Exported ${fileName}`);
}

async function exportQuestionData() {
  const sessions = await prisma.examSession.findMany({
    orderBy: [{ examYear: "asc" }, { examRound: "asc" }],
    include: {
      questions: {
        orderBy: [{ questionNumber: "asc" }],
        include: {
          choices: {
            orderBy: [{ label: "asc" }],
          },
        },
      },
    },
  });

  for (const session of sessions) {
    const payload = session.questions.map((question) => {
      const correctChoice = question.choices.find((choice) => choice.isCorrect) ?? null;

      return {
        examYear: session.examYear,
        examRound: session.examRound,
        examDate: formatDateOnly(session.examDate),
        title: session.title,
        status: session.status,
        questionNumber: question.questionNumber,
        body: question.body,
        explanation: question.explanation,
        correctLabel: correctChoice?.label ?? null,
        choices: question.choices.map((choice) => ({
          label: choice.label,
          text: choice.text,
          isCorrect: choice.isCorrect,
        })),
      };
    });

    writeJsonFile(`${session.examYear}-round${session.examRound}-merged.json`, payload);
  }
}

async function exportUserData() {
  const users = await prisma.user.findMany({
    orderBy: [{ id: "asc" }],
  });

  writeJsonFile(
    "users.json",
    users.map((user) => ({
      name: user.name,
      email: user.email,
    }))
  );
}

async function exportUserQuestionAnswers() {
  const answers = await prisma.userQuestionAnswer.findMany({
    orderBy: [{ userId: "asc" }, { answeredAt: "asc" }, { id: "asc" }],
    include: {
      user: true,
      question: {
        include: {
          examSession: true,
        },
      },
      selectedChoice: true,
    },
  });

  writeJsonFile(
    "user-question-answers.json",
    answers.map((answer) => ({
      userEmail: answer.user.email,
      examYear: answer.question.examSession.examYear,
      examRound: answer.question.examSession.examRound,
      questionNumber: answer.question.questionNumber,
      selectedChoiceLabel: answer.selectedChoice?.label ?? null,
      isCorrect: answer.isCorrect,
      answeredAt: formatDateTime(answer.answeredAt),
    }))
  );
}

async function exportWrongQuestions() {
  const wrongQuestions = await prisma.wrongQuestion.findMany({
    orderBy: [{ userId: "asc" }, { questionId: "asc" }],
    include: {
      user: true,
      question: {
        include: {
          examSession: true,
        },
      },
    },
  });

  writeJsonFile(
    "wrong-questions.json",
    wrongQuestions.map((item) => ({
      userEmail: item.user.email,
      examYear: item.question.examSession.examYear,
      examRound: item.question.examSession.examRound,
      questionNumber: item.question.questionNumber,
      createdAt: formatDateTime(item.createdAt),
      resolvedAt: formatDateTime(item.resolvedAt),
    }))
  );
}

async function exportQuestionFlags() {
  const flags = await prisma.questionFlag.findMany({
    orderBy: [{ userId: "asc" }, { questionId: "asc" }],
    include: {
      user: true,
      question: {
        include: {
          examSession: true,
        },
      },
    },
  });

  writeJsonFile(
    "question-flags.json",
    flags.map((item) => ({
      userEmail: item.user.email,
      examYear: item.question.examSession.examYear,
      examRound: item.question.examSession.examRound,
      questionNumber: item.question.questionNumber,
      createdAt: formatDateTime(item.createdAt),
    }))
  );
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  await exportQuestionData();
  await exportUserData();
  await exportUserQuestionAnswers();
  await exportWrongQuestions();
  await exportQuestionFlags();
}

main()
  .catch((error) => {
    console.error("Failed to export seed data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
