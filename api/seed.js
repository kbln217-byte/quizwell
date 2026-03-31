const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env file");
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

async function main() {
  const mergedFiles = [
    "parsed/2024-round28-merged.json",
    "parsed/2025-round29-merged.json",
    "parsed/2025-round30-merged.json",
    "parsed/2025-round31-merged.json",
  ];

  console.log("🚀 Starting database seeding...\n");

  for (const file of mergedFiles) {
    try {
      console.log(`📄 Processing ${file}...`);

      // ファイルの存在確認
      if (!fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(file, "utf-8"));

      if (!Array.isArray(data) || data.length === 0) {
        console.log(`⚠️  No data found in ${file}`);
        continue;
      }

      // Get exam info from first question
      const firstQuestion = data[0];
      const examSessionData = {
        examYear: firstQuestion.examYear,
        examRound: firstQuestion.examRound,
        examDate: firstQuestion.examDate ? new Date(firstQuestion.examDate) : null,
        status: true,
      };

      // ExamSessionを作成または取得
      let examSession;
      try {
        examSession = await prisma.examSession.upsert({
          where: {
            examYear_examRound: {
              examYear: examSessionData.examYear,
              examRound: examSessionData.examRound,
            },
          },
          update: {},
          create: examSessionData,
        });

        console.log(
          `✅ ExamSession: Year ${examSession.examYear}, Round ${examSession.examRound} (ID: ${examSession.id})`
        );
      } catch (error) {
        console.error(`❌ Error creating ExamSession:`, error.message);
        continue;
      }

      // 質問と選択肢を挿入
      let questionCount = 0;
      let choiceCount = 0;

      for (const question of data) {
        if (!question.questionNumber || !question.body || !Array.isArray(question.choices)) {
          console.log(`⚠️  Skipping invalid question: ${question.questionNumber}`);
          continue;
        }

        try {
          const q = await prisma.question.upsert({
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

          // 選択肢を挿入
          for (const choice of question.choices) {
            try {
              await prisma.choice.upsert({
                where: {
                  questionId_label: {
                    questionId: q.id,
                    label: choice.label,
                  },
                },
                update: {
                  text: choice.text,
                  isCorrect: choice.isCorrect,
                },
                create: {
                  questionId: q.id,
                  label: choice.label,
                  text: choice.text,
                  isCorrect: choice.isCorrect,
                },
              });
              choiceCount++;
            } catch (error) {
              console.error(
                `❌ Error creating choice for question ${q.questionNumber}:`,
                error.message
              );
            }
          }

          questionCount++;
        } catch (error) {
          console.error(
            `❌ Error creating question ${question.questionNumber}:`,
            error.message
          );
        }
      }

      console.log(
        `✅ Inserted ${questionCount} questions with ${choiceCount} choices\n`
      );
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      continue;
    }
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error during seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
