//テキストをJSONに
const fs = require("fs");
const path = require("path");

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ");
}

function compactDigits(str) {
  return str.replace(/(?<=\d)\s+(?=\d)/g, "");
}

function extractExamMeta(text) {
  const normalized = normalizeText(text);

  const yearRoundMatch = normalized.match(/(\d{4})\s*年度\s*第\s*(\d+)\s*回/);
  if (!yearRoundMatch) {
    throw new Error("年度・回次が見つかりません");
  }

  const examYear = Number(yearRoundMatch[1]);
  const examRound = Number(yearRoundMatch[2]);

  let examDate = null;
  const dateLikeMatch = normalized.match(/(\d\s*\d\s*\d\s*\d|\d{4})\s*年\s*\d+\s*月\s*\d+\s*日/);
  if (dateLikeMatch) {
    const compact = compactDigits(dateLikeMatch[0]);
    const dateMatch = compact.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
    if (dateMatch) {
      const year = dateMatch[1];
      const month = dateMatch[2].padStart(2, "0");
      const day = dateMatch[3].padStart(2, "0");
      examDate = `${year}-${month}-${day}`;
    }
  }

  return { examYear, examRound, examDate };
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("使い方: node parse-questions.js raw/2025-round31-questions.txt");
  process.exit(1);
}

console.log("start parse questions");
console.log("input:", inputFile);

const raw = fs.readFileSync(inputFile, "utf-8");
const examMeta = extractExamMeta(raw);

console.log("examMeta:", examMeta);

const startIndex = raw.search(/問\s*1/);
if (startIndex === -1) {
  throw new Error("問1 が見つかりません");
}
const text = raw.slice(startIndex);

const blocks = text
  .split(/(?=問\s*\d+)/)
  .map((b) => b.trim())
  .filter(Boolean);

const questions = blocks.map((block) => {
  const numMatch = block.match(/^問\s*(\d+)/);
  if (!numMatch) {
    throw new Error(`問題番号が取れません: ${block.slice(0, 50)}`);
  }

  const questionNumber = Number(numMatch[1]);
  const content = block.replace(/^問\s*\d+/, "").trim();

  const choiceStart = content.search(/\n\s*1\./);
  if (choiceStart === -1) {
    throw new Error(`選択肢開始が見つかりません: 問${questionNumber}`);
  }

  const body = content.slice(0, choiceStart).replace(/\s+/g, " ").trim();
  const choicePart = content.slice(choiceStart).trim();

  const choiceMatches = [
    ...choicePart.matchAll(
      /(?:^|\n)\s*([1-4])\.\s*([\s\S]*?)(?=(?:\n\s*[1-4]\.\s)|$)/g
    ),
  ];

  const choices = choiceMatches.map((m) => ({
    label: m[1],
    text: m[2].replace(/\s+/g, " ").trim(),
  }));

  return {
    ...examMeta,
    questionNumber,
    body,
    choices,
  };
});

const outputDir = path.join(process.cwd(), "parsed");
ensureDir(outputDir);

const outputFile = path.join(
  outputDir,
  `${examMeta.examYear}-round${examMeta.examRound}-questions.json`
);

fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2), "utf-8");

console.log("questions.json created:", outputFile);
console.log("count:", questions.length);