# Quiz API

## 概要
キャリアコンサルタント試験の過去問を解くための学習アプリ。

- 問題一覧・詳細表示
- 回答送信
- 正誤判定
- 前後の問題への遷移
- 不正解問題の記録（復習用）

---

## 起動方法
```bash
npm install
npm run dev



model ExamSession {
  id         Int        @id @default(autoincrement())
  examYear   Int
  examRound  Int
  examDate   DateTime?
  title      String?
  status     Boolean
  questions  Question[]

  @@unique([examYear, examRound])
}

model Question {
  id            Int         @id @default(autoincrement())
  examSessionId Int
  questionNumber Int
  body          String
  explanation   String?
  choices       Choice[]

  examSession   ExamSession @relation(fields: [examSessionId], references: [id])

  @@unique([examSessionId, questionNumber])
}

model Choice {
  id         Int      @id @default(autoincrement())
  questionId Int
  label      String
  text       String
  isCorrect  Boolean

  question   Question @relation(fields: [questionId], references: [id])

  @@unique([questionId, label])
}


shemaは環境構築後



model User {
  id        Int                  @id @default(autoincrement())
  name      String
  email     String               @unique
  answers   UserQuestionAnswer[]
  wrongQuestions WrongQuestion[]
}

model ExamSession {
  id         Int        @id @default(autoincrement())
  examYear   Int
  examRound  Int
  examDate   DateTime?
  title      String?
  status     Boolean
  questions  Question[]

  @@unique([examYear, examRound])
}

model Question {
  id             Int                  @id @default(autoincrement())
  examSessionId  Int
  questionNumber Int
  body           String
  explanation    String?
  choices        Choice[]
  answers        UserQuestionAnswer[]
  wrongQuestions WrongQuestion[]

  examSession    ExamSession          @relation(fields: [examSessionId], references: [id])

  @@unique([examSessionId, questionNumber])
}

model Choice {
  id              Int                  @id @default(autoincrement())
  questionId      Int
  label           String
  text            String
  isCorrect       Boolean
  selectedAnswers UserQuestionAnswer[]

  question        Question             @relation(fields: [questionId], references: [id])

  @@unique([questionId, label])
}

model UserQuestionAnswer {
  id               Int       @id @default(autoincrement())
  userId           Int
  questionId       Int
  selectedChoiceId Int?
  isCorrect        Boolean
  answeredAt       DateTime  @default(now())

  user             User      @relation(fields: [userId], references: [id])
  question         Question  @relation(fields: [questionId], references: [id])
  selectedChoice   Choice?   @relation(fields: [selectedChoiceId], references: [id])

  @@index([userId, questionId])
  @@index([userId, isCorrect])
}

model WrongQuestion {
  id          Int       @id @default(autoincrement())
  userId      Int
  questionId  Int
  createdAt   DateTime  @default(now())
  resolvedAt  DateTime?

  user        User      @relation(fields: [userId], references: [id])
  question    Question  @relation(fields: [questionId], references: [id])

  @@unique([userId, questionId])
  @@index([userId, resolvedAt])
}




# Quiz API

## 起動方法
npm install
npm run dev

## テスト
npm run test

## DB
npx prisma migrate dev
npx prisma studio

## API
POST /users
POST /answers

## 仕様
- 回答は UserQuestionAnswer に保存
- 不正解は WrongQuestion に登録
- 正解時は WrongQuestion を解決