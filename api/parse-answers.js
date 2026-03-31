//答えのテキストをJSONに

const fs = require("fs");
const path = require("path");

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

function toHalfWidth(str) {
  return str.replace(/[０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
}

function extractExamMeta(text) {
  const normalized = text.replace(/[ \t]+/g, " ");
  const yearRoundMatch = normalized.match(/(\d{4})\s*年度\s*第\s*(\d+)\s*回/);

  if (yearRoundMatch) {
    return {
      examYear: Number(yearRoundMatch[1]),
      examRound: Number(yearRoundMatch[2]),
    };
  }

  return null;
}

function guessMetaFromFilename(filePath) {
  const base = path.basename(filePath);
  const match = base.match(/(\d{4})-round(\d+)-answers\.txt$/);
  if (!match) return null;

  return {
    examYear: Number(match[1]),
    examRound: Number(match[2]),
  };
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("使い方: node parse-answers.js raw/2025-round31-answers.txt");
  process.exit(1);
}

console.log("start parse answers");
console.log("input:", inputFile);

const raw = fs.readFileSync(inputFile, "utf-8");
const text = normalizeText(toHalfWidth(raw));

let examMeta = extractExamMeta(text);
if (!examMeta) {
  examMeta = guessMetaFromFilename(inputFile);
}
if (!examMeta) {
  throw new Error("年度・回次が取得できません。answers.txt内またはファイル名に情報が必要です。");
}

console.log("examMeta:", examMeta);

// 最初の「問1」以降だけを対象にする
const startIndex = text.search(/問\s*1\b/);
if (startIndex === -1) {
  throw new Error("answers.txt 内に 問1 が見つかりません");
}
const target = text.slice(startIndex);

// 「問◯」または単独の 1〜4 をトークンとして拾う
// 例: 問1 4 問11 3 ...
const tokens = target.match(/問\s*\d+|[1-4]/g) || [];

const answers = [];
let currentQuestionNumber = null;

for (const token of tokens) {
  const qMatch = token.match(/^問\s*(\d+)$/);

  if (qMatch) {
    currentQuestionNumber = Number(qMatch[1]);
    continue;
  }

  // currentQuestionNumber があるときだけ、次の 1〜4 を正答として採用
  if (currentQuestionNumber !== null && /^[1-4]$/.test(token)) {
    answers.push({
      examYear: examMeta.examYear,
      examRound: examMeta.examRound,
      questionNumber: currentQuestionNumber,
      correctLabel: token,
    });
    currentQuestionNumber = null;
  }
}

// questionNumber で重複除去（念のため）
const uniqueMap = new Map();
for (const a of answers) {
  if (!uniqueMap.has(a.questionNumber)) {
    uniqueMap.set(a.questionNumber, a);
  }
}

const uniqueAnswers = [...uniqueMap.values()].sort(
  (a, b) => a.questionNumber - b.questionNumber
);

const outputDir = path.join(process.cwd(), "parsed");
ensureDir(outputDir);

const outputFile = path.join(
  outputDir,
  `${examMeta.examYear}-round${examMeta.examRound}-answers.json`
);

fs.writeFileSync(outputFile, JSON.stringify(uniqueAnswers, null, 2), "utf-8");

console.log("answers.json created:", outputFile);
console.log("count:", uniqueAnswers.length);
console.log("first:", uniqueAnswers[0]);
console.log("last:", uniqueAnswers[uniqueAnswers.length - 1]);