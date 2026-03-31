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

const apiDir = __dirname;
const repoRoot = path.resolve(apiDir, "..");
const seedDataDir = path.join(apiDir, "seed-data");
const parsedDir = path.join(repoRoot, "parsed");
const validSeedModes = new Set(["master", "user-state", "all"]);

function parseSeedArgs() {
  const cliArgs = process.argv.slice(2);
  const firstArg = cliArgs[0];
  const mode = validSeedModes.has(firstArg) ? firstArg : "master";
  const fileArgs = validSeedModes.has(firstArg) ? cliArgs.slice(1) : cliArgs;

  return { mode, fileArgs };
}

function resolveQuestionFiles(fileArgs) {
  const cliFiles = fileArgs;

  if (cliFiles.length > 0) {
    return cliFiles.map((filePath) => path.resolve(process.cwd(), filePath));
  }

  const seedFiles = fs.existsSync(seedDataDir)
    ? fs
        .readdirSync(seedDataDir)
        .filter((fileName) => fileName.endsWith("-merged.json"))
        .sort()
        .map((fileName) => path.join(seedDataDir, fileName))
    : [];

  if (seedFiles.length > 0) {
    return seedFiles;
  }

  return [
    path.join(parsedDir, "2024-round28-merged.json"),
    path.join(parsedDir, "2025-round29-merged.json"),
    path.join(parsedDir, "2025-round30-merged.json"),
    path.join(parsedDir, "2025-round31-merged.json"),
  ];
}

function readJsonIfExists(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    return fallbackValue;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function toNullableDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getSessionKey(examYear, examRound) {
  return `${examYear}:${examRound}`;
}

function getQuestionKey(examYear, examRound, questionNumber) {
  return `${examYear}:${examRound}:${questionNumber}`;
}

function getChoiceKey(examYear, examRound, questionNumber, label) {
  return `${examYear}:${examRound}:${questionNumber}:${label}`;
}

async function seedQuestions(fileArgs = []) {
  const inputFiles = resolveQuestionFiles(fileArgs);

  console.log("Starting question seeding...");
  console.log(`Using ${inputFiles.length} file(s).`);

  for (const filePath of inputFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping missing file: ${filePath}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(data) || data.length === 0) {
      console.log(`Skipping empty file: ${filePath}`);
      continue;
    }

    const firstQuestion = data[0];
    const examSession = await prisma.examSession.upsert({
      where: {
        examYear_examRound: {
          examYear: firstQuestion.examYear,
          examRound: firstQuestion.examRound,
        },
      },
      update: {
        examDate: toNullableDate(firstQuestion.examDate),
        title: firstQuestion.title ?? null,
        status:
          typeof firstQuestion.status === "boolean" ? firstQuestion.status : true,
      },
      create: {
        examYear: firstQuestion.examYear,
        examRound: firstQuestion.examRound,
        examDate: toNullableDate(firstQuestion.examDate),
        title: firstQuestion.title ?? null,
        status:
          typeof firstQuestion.status === "boolean" ? firstQuestion.status : true,
      },
    });

    let questionCount = 0;
    let choiceCount = 0;

    for (const question of data) {
      if (!question.questionNumber || !question.body || !Array.isArray(question.choices)) {
        console.log(`Skipping invalid question: ${question.questionNumber ?? "unknown"}`);
        continue;
      }

      const savedQuestion = await prisma.question.upsert({
        where: {
          examSessionId_questionNumber: {
            examSessionId: examSession.id,
            questionNumber: question.questionNumber,
          },
        },
        update: {
          body: question.body,
          explanation: question.explanation || null,
        },
        create: {
          examSessionId: examSession.id,
          questionNumber: question.questionNumber,
          body: question.body,
          explanation: question.explanation || null,
        },
      });

      for (const choice of question.choices) {
        await prisma.choice.upsert({
          where: {
            questionId_label: {
              questionId: savedQuestion.id,
              label: choice.label,
            },
          },
          update: {
            text: choice.text,
            isCorrect: Boolean(choice.isCorrect),
          },
          create: {
            questionId: savedQuestion.id,
            label: choice.label,
            text: choice.text,
            isCorrect: Boolean(choice.isCorrect),
          },
        });

        choiceCount += 1;
      }

      questionCount += 1;
    }

    console.log(
      `Seeded session ${examSession.examYear}-round${examSession.examRound}: ${questionCount} questions / ${choiceCount} choices`
    );
  }
}

async function buildReferenceMaps() {
  const sessions = await prisma.examSession.findMany({
    include: {
      questions: {
        include: {
          choices: true,
        },
      },
    },
  });

  const sessionMap = new Map();
  const questionMap = new Map();
  const choiceMap = new Map();

  for (const session of sessions) {
    sessionMap.set(getSessionKey(session.examYear, session.examRound), session);

    for (const question of session.questions) {
      const questionKey = getQuestionKey(
        session.examYear,
        session.examRound,
        question.questionNumber
      );

      questionMap.set(questionKey, question);

      for (const choice of question.choices) {
        choiceMap.set(
          getChoiceKey(session.examYear, session.examRound, question.questionNumber, choice.label),
          choice
        );
      }
    }
  }

  return { sessionMap, questionMap, choiceMap };
}

async function seedUsers() {
  const usersPath = path.join(seedDataDir, "users.json");
  const users = readJsonIfExists(usersPath, []);

  if (!Array.isArray(users) || users.length === 0) {
    console.log("No users.json found. Skipping user-related seed.");
    return new Map();
  }

  const userMap = new Map();

  for (const user of users) {
    if (!user?.email || !user?.name) {
      continue;
    }

    const savedUser = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
      },
      create: {
        name: user.name,
        email: user.email,
      },
    });

    userMap.set(savedUser.email, savedUser);
  }

  console.log(`Seeded ${userMap.size} users.`);
  return userMap;
}

async function reseedUserStateTables(userMap, referenceMaps) {
  const { questionMap, choiceMap } = referenceMaps;
  const userIds = [...userMap.values()].map((user) => user.id);

  if (userIds.length === 0) {
    return;
  }

  const answersPath = path.join(seedDataDir, "user-question-answers.json");
  const wrongQuestionsPath = path.join(seedDataDir, "wrong-questions.json");
  const flagsPath = path.join(seedDataDir, "question-flags.json");

  const answers = readJsonIfExists(answersPath, []);
  const wrongQuestions = readJsonIfExists(wrongQuestionsPath, []);
  const flags = readJsonIfExists(flagsPath, []);

  await prisma.userQuestionAnswer.deleteMany({
    where: {
      userId: { in: userIds },
    },
  });

  await prisma.wrongQuestion.deleteMany({
    where: {
      userId: { in: userIds },
    },
  });

  await prisma.questionFlag.deleteMany({
    where: {
      userId: { in: userIds },
    },
  });

  let answerCount = 0;
  for (const answer of answers) {
    const user = userMap.get(answer.userEmail);
    const question = questionMap.get(
      getQuestionKey(answer.examYear, answer.examRound, answer.questionNumber)
    );

    if (!user || !question) {
      continue;
    }

    const selectedChoice =
      answer.selectedChoiceLabel == null
        ? null
        : choiceMap.get(
            getChoiceKey(
              answer.examYear,
              answer.examRound,
              answer.questionNumber,
              answer.selectedChoiceLabel
            )
          ) ?? null;

    await prisma.userQuestionAnswer.create({
      data: {
        userId: user.id,
        questionId: question.id,
        selectedChoiceId: selectedChoice?.id ?? null,
        isCorrect: Boolean(answer.isCorrect),
        answeredAt: toNullableDate(answer.answeredAt) ?? new Date(),
      },
    });

    answerCount += 1;
  }

  let wrongQuestionCount = 0;
  for (const item of wrongQuestions) {
    const user = userMap.get(item.userEmail);
    const question = questionMap.get(
      getQuestionKey(item.examYear, item.examRound, item.questionNumber)
    );

    if (!user || !question) {
      continue;
    }

    await prisma.wrongQuestion.create({
      data: {
        userId: user.id,
        questionId: question.id,
        createdAt: toNullableDate(item.createdAt) ?? new Date(),
        resolvedAt: toNullableDate(item.resolvedAt),
      },
    });

    wrongQuestionCount += 1;
  }

  let flagCount = 0;
  for (const item of flags) {
    const user = userMap.get(item.userEmail);
    const question = questionMap.get(
      getQuestionKey(item.examYear, item.examRound, item.questionNumber)
    );

    if (!user || !question) {
      continue;
    }

    await prisma.questionFlag.create({
      data: {
        userId: user.id,
        questionId: question.id,
        createdAt: toNullableDate(item.createdAt) ?? new Date(),
      },
    });

    flagCount += 1;
  }

  console.log(
    `Seeded user state: ${answerCount} answers / ${wrongQuestionCount} wrong questions / ${flagCount} flags`
  );
}

async function main() {
  const { mode, fileArgs } = parseSeedArgs();

  if (mode === "master" || mode === "all") {
    await seedQuestions(fileArgs);
  }

  if (mode === "user-state" || mode === "all") {
    const referenceMaps = await buildReferenceMaps();
    const userMap = await seedUsers();
    await reseedUserStateTables(userMap, referenceMaps);
  }

  console.log("Database seeding completed.");
}

main()
  .catch((error) => {
    console.error("Fatal error during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
