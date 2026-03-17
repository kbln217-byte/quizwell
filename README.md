ログインするならユーザーテーブルが必要
一覧でランダム回答か年度回答かを選択する




### 画面一覧作成

## ログイン画面

**表示項目**
メールアドレス／ パスワード／ ログインボタン


## ユーザー登録画面

**表示項目**
名前／ メールアドレス／ パスワード／ 登録ボタン


## ホーム画面

**表示内容**
* 回次別に学習する
* 学習履歴を見る
* 学習統計を見る
* これまでの総解答数
* 正答率
* 未復習の間違い問題数


## 回次一覧画面
＞過去問を「第◯回」単位で選ぶ

**表示項目**
回次名／ 実施年／ 問題／ 解答済み数／ 正答率


## 問題一覧画面
**表示項目**
問題番号／　問題／ 解答済み or 未解答／ 前回の結果（正解 or 不正解


## 問題解答画面
**表示項目**
回次名／ 問題番号／ 問題文／ 選択肢／ 解答番号ボタン（回答したら次の画面（正解判定）に遷移

**解答後に表示**
自分の解答／ 正解 or 不正解／ 正解の選択肢／ 解説
**仕様**
不正解なら自動で「間違えた問題」として記録


## 結果画面
**表示項目**
問題数／ 正答数／ 正答率／ 問題ごとの正誤一覧（今回間違えた問題数・間違えた問題だけ復習するボタン）


## 間違えた問題一覧画面
**表示項目**
回次名／ 問題番号／ 最後に間違えた日／ 間違えた回数／ 最後の復習日／ 復習状態（未復習 / 復習中 / 復習済み）

**絞り込み条件の例**
未復習のみ／ 回次別／ 分野別／ 間違えた回数が多い順／ 最近間違えた順


## 間違えた問題の復習画面
「間違えた問題一覧」から遷移して、復習専用で解く
**表示内容**
問題文／ 選択肢／ 自分が前回どれを選んだか／ 前回いつ間違えたか／ 解答結果／ 解説

復習で正解したら「復習済み」にできる
再度間違えたら「間違えた回数」を増やす


## 学習履歴画面
**表示項目**
学習日／ 解いた問題数／ 正答率／ 間違えた問題数


## 学習統計画面
**表示項目**
総解答数／ 総正答率／ 間違えた問題数／ 未復習数／ 復習完了数


## 管理画面（管理者用）
問題データを登録・修正するための画面です。
**機能**
回次登録／　問題登録／ 選択肢登録／ 正解登録／ 解説登録／ 分野設定／ テキスト / CSV / JSON 取り込み


# 画面遷移イメージ
ログイン → ホーム → 回次一覧 → 問題一覧 → 問題解答 → 結果**

ログイン → ホーム → 間違えた問題一覧 → 復習画面**







### DB設計









### API設計


### API実装
ー単体テスト

### UIを作成
ー単体テスト

###　APIとUIを結合



node parse-questions.js raw/2025-round31-questions.
//raw以降は外套のファイル

node parse-answers.js raw/2025-round31-answers.txt
先に答えと問題をテキストに、
次に下を実行しJSONを作成する

node merge.js parsed/2025-round31-questions.json parsed/2025-round31-answers.json







# 3. DB設計

## 3-1. users

ユーザー情報

| カラム名          | 型        | 説明         |
| ------------- | -------- | ---------- |
| id            | bigint   | PK         |
| name          | varchar  | ユーザー名      |
| email         | varchar  | メールアドレス    |
| password_hash | varchar  | ハッシュ化パスワード |
| created_at    | datetime | 作成日時       |
| updated_at    | datetime | 更新日時       |

---

## 3-2. exam_sets

試験回情報

| カラム名        | 型        | 説明          |
| ----------- | -------- | ----------- |
| id          | bigint   | PK          |
| exam_type   | varchar  | 例: written  |
| title       | varchar  | 例: 第25回学科試験 |
| exam_year   | int      | 実施年         |
| exam_no     | int      | 回次          |
| exam_date   | date     | 実施日         |
| description | text     | 補足          |
| created_at  | datetime | 作成日時        |

---

## 3-3. categories

分野マスタ

| カラム名       | 型       | 説明  |
| ---------- | ------- | --- |
| id         | bigint  | PK  |
| name       | varchar | 分野名 |
| sort_order | int     | 並び順 |

---

## 3-4. questions

問題本体

| カラム名          | 型        | 説明   |
| ------------- | -------- | ---- |
| id            | bigint   | PK   |
| exam_set_id   | bigint   | FK   |
| category_id   | bigint   | FK   |
| question_no   | int      | 問題番号 |
| question_text | text     | 問題文  |
| explanation   | text     | 解説   |
| created_at    | datetime | 作成日時 |
| updated_at    | datetime | 更新日時 |

---

## 3-5. choices

選択肢

| カラム名        | 型        | 説明      |
| ----------- | -------- | ------- |
| id          | bigint   | PK      |
| question_id | bigint   | FK      |
| choice_no   | int      | 1,2,3,4 |
| choice_text | text     | 選択肢本文   |
| is_correct  | boolean  | 正解かどうか  |
| created_at  | datetime | 作成日時    |

---

## 3-6. answer_histories

解答履歴
ユーザーがいつ何を選んだかを残します。

| カラム名               | 型        | 説明              |
| ------------------ | -------- | --------------- |
| id                 | bigint   | PK              |
| user_id            | bigint   | FK              |
| question_id        | bigint   | FK              |
| selected_choice_id | bigint   | FK              |
| is_correct         | boolean  | 正誤              |
| answered_at        | datetime | 解答日時            |
| mode               | varchar  | normal / review |

**補足**

* `mode` を持たせると、通常学習なのか復習なのか区別できます

---

## 3-7. wrong_question_statuses

**間違えた問題を管理するための中核テーブル**です。

「今このユーザーにとって、その問題は復習対象なのか」を持たせます。

| カラム名             | 型        | 説明                                |
| ---------------- | -------- | --------------------------------- |
| id               | bigint   | PK                                |
| user_id          | bigint   | FK                                |
| question_id      | bigint   | FK                                |
| wrong_count      | int      | 間違えた累計回数                          |
| last_wrong_at    | datetime | 最後に間違えた日時                         |
| last_reviewed_at | datetime | 最後に復習した日時                         |
| status           | varchar  | unreviewed / reviewing / mastered |
| created_at       | datetime | 作成日時                              |
| updated_at       | datetime | 更新日時                              |

---

# 4. 間違えた問題管理の考え方

このテーブルが重要です。

## 不正解だったとき

* `wrong_question_statuses` がなければ新規作成
* あれば `wrong_count + 1`
* `last_wrong_at = now`
* `status = unreviewed`

## 復習で再挑戦したとき

* 正解したら

  * `last_reviewed_at = now`
  * `status = mastered` または `reviewing`
* 間違えたら

  * `wrong_count + 1`
  * `last_wrong_at = now`
  * `status = unreviewed`

---

# 5. 復習状態の設計案

状態は3つにすると扱いやすいです。

## unreviewed

* 間違えたあと、まだ十分復習していない状態

## reviewing

* 復習中。再挑戦したが、まだ定着確認途中

## mastered

* 復習して正解し、いったん克服した状態

最初はもっとシンプルにしても大丈夫です。
たとえば最初は

* `needs_review`
* `reviewed`

の2段階でも十分です。

---

# 6. リレーション

* users 1 : N answer_histories
* questions 1 : N answer_histories
* exam_sets 1 : N questions
* categories 1 : N questions
* questions 1 : N choices
* users 1 : N wrong_question_statuses
* questions 1 : N wrong_question_statuses

---

# 7. API設計

## 7-1. 認証系

### POST /auth/register

ユーザー登録

**request**

```json
{
  "name": "waka",
  "email": "waka@example.com",
  "password": "pass1234"
}
```

**response**

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "waka",
      "email": "waka@example.com"
    }
  }
}
```

---

### POST /auth/login

ログイン

**request**

```json
{
  "email": "waka@example.com",
  "password": "pass1234"
}
```

**response**

```json
{
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "waka",
      "email": "waka@example.com"
    }
  }
}
```

---

## 7-2. 試験回取得

### GET /exam-sets

回次一覧取得

**response**

```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "title": "第25回 学科試験",
        "examYear": 2024,
        "examNo": 25,
        "examDate": "2024-03-01",
        "questionCount": 50,
        "answeredCount": 20,
        "accuracyRate": 70
      }
    ]
  }
}
```

---

### GET /exam-sets/:id/questions

指定回の問題一覧取得

**response**

```json
{
  "data": {
    "items": [
      {
        "id": 101,
        "questionNo": 1,
        "categoryName": "キャリア理論",
        "isAnswered": true,
        "latestIsCorrect": false,
        "needsReview": true,
        "reviewStatus": "unreviewed"
      }
    ]
  }
}
```

---

## 7-3. 問題取得

### GET /questions/:id

問題詳細取得

**response**

```json
{
  "data": {
    "id": 101,
    "examSetId": 1,
    "questionNo": 1,
    "questionText": "キャリアコンサルタントの役割として適切なものを1つ選べ。",
    "explanation": null,
    "category": {
      "id": 2,
      "name": "キャリア理論"
    },
    "choices": [
      { "id": 1001, "choiceNo": 1, "choiceText": "..." },
      { "id": 1002, "choiceNo": 2, "choiceText": "..." },
      { "id": 1003, "choiceNo": 3, "choiceText": "..." },
      { "id": 1004, "choiceNo": 4, "choiceText": "..." }
    ]
  }
}
```

---

## 7-4. 解答登録

### POST /questions/:id/answer

通常学習で回答するAPIです。

**request**

```json
{
  "selectedChoiceId": 1002
}
```

**response**

```json
{
  "data": {
    "questionId": 101,
    "selectedChoiceId": 1002,
    "isCorrect": false,
    "correctChoiceId": 1004,
    "explanation": "この問題では〜",
    "reviewStatus": {
      "needsReview": true,
      "status": "unreviewed",
      "wrongCount": 3
    }
  }
}
```

**サーバ側処理**

* answer_histories に保存
* 不正解なら wrong_question_statuses を更新
* 正解なら必要に応じて復習状態を更新しない、または後述ルールに従う

---

## 7-5. 間違えた問題一覧取得

### GET /me/wrong-questions

自分の復習対象問題一覧を取得

**query例**

* `?status=unreviewed`
* `?categoryId=2`
* `?examSetId=1`

**response**

```json
{
  "data": {
    "items": [
      {
        "questionId": 101,
        "examSetTitle": "第25回 学科試験",
        "questionNo": 1,
        "categoryName": "キャリア理論",
        "wrongCount": 3,
        "lastWrongAt": "2026-03-17T12:00:00Z",
        "lastReviewedAt": "2026-03-18T09:00:00Z",
        "status": "unreviewed"
      }
    ]
  }
}
```

---

## 7-6. 間違えた問題の復習用詳細取得

### GET /me/wrong-questions/:questionId

復習対象としての問題詳細を取得

**response**

```json
{
  "data": {
    "questionId": 101,
    "questionNo": 1,
    "questionText": "〜",
    "choices": [
      { "id": 1001, "choiceNo": 1, "choiceText": "..." },
      { "id": 1002, "choiceNo": 2, "choiceText": "..." }
    ],
    "wrongStatus": {
      "wrongCount": 3,
      "lastWrongAt": "2026-03-17T12:00:00Z",
      "status": "unreviewed"
    },
    "lastAnswer": {
      "selectedChoiceId": 1002,
      "isCorrect": false,
      "answeredAt": "2026-03-17T12:00:00Z"
    }
  }
}
```

---

## 7-7. 復習回答API

### POST /me/wrong-questions/:questionId/review-answer

復習として解答するAPIです。

**request**

```json
{
  "selectedChoiceId": 1004
}
```

**response**

```json
{
  "data": {
    "questionId": 101,
    "selectedChoiceId": 1004,
    "isCorrect": true,
    "correctChoiceId": 1004,
    "explanation": "この問題では〜",
    "reviewStatus": {
      "needsReview": false,
      "status": "mastered",
      "wrongCount": 3,
      "lastReviewedAt": "2026-03-18T10:00:00Z"
    }
  }
}
```

---

## 7-8. 学習履歴取得

### GET /me/answers

自分の解答履歴を取得

**query例**

* `?mode=normal`
* `?mode=review`
* `?isCorrect=false`

---

## 7-9. 学習統計取得

### GET /me/stats

統計情報を返す

**response**

```json
{
  "data": {
    "totalAnswered": 120,
    "totalCorrect": 90,
    "accuracyRate": 75,
    "wrongQuestionCount": 18,
    "unreviewedCount": 10,
    "masteredCount": 8,
    "categoryStats": [
      {
        "categoryId": 1,
        "categoryName": "キャリア理論",
        "answered": 30,
        "correct": 18,
        "accuracyRate": 60
      }
    ]
  }
}
```

---

## 7-10. 管理者系API

### POST /admin/exam-sets

回次登録

### POST /admin/questions

問題登録

### POST /admin/questions/:id/choices

選択肢登録

### PUT /admin/questions/:id

問題更新

### DELETE /admin/questions/:id

問題削除

### POST /admin/import

取り込み用API

---

# 8. APIレスポンスの統一ルール

## 成功

```json
{
  "data": {}
}
```

## エラー

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力が不正です",
    "details": [
      { "field": "selectedChoiceId", "reason": "required" }
    ]
  }
}
```

---

# 9. 復習機能のルール案

設計時に先に決めておくと実装しやすいです。

## 案A: 1回正解したら復習済み

* 不正解 → `unreviewed`
* 復習で1回正解 → `mastered`

**特徴**

* シンプル
* 実装しやすい

## 案B: 2回連続正解で復習済み

* 不正解 → `unreviewed`
* 復習1回正解 → `reviewing`
* 復習2回連続正解 → `mastered`

**特徴**

* 定着確認としては自然
* 少し実装が複雑

最初は **案A** がおすすめです。

---

# 10. 最小構成で必要なテーブル

今回の要件なら、最小でこの7テーブルです。

* users
* exam_sets
* categories
* questions
* choices
* answer_histories
* wrong_question_statuses

---

# 11. 実装順のおすすめ

## 第1段階

* `exam_sets`
* `questions`
* `choices`
* 一覧表示と問題表示

## 第2段階

* `POST /questions/:id/answer`
* 正誤判定
* 解説表示
* `answer_histories`

## 第3段階

* `wrong_question_statuses`
* 間違えた問題一覧
* 復習画面
* 復習API

## 第4段階

* 学習履歴
* 統計画面

---

# 12. かなり実務的な設計の要点

今回の要件では、特に大事なのはこの2つです。

## 1. 解答履歴と復習状態は分ける

* `answer_histories` は「事実の記録」
* `wrong_question_statuses` は「現在の管理状態」

この2つを分けると、後で集計しやすいです。

## 2. 復習対象は自動で決まる

ブックマークのように手動で管理するのではなく、
**間違えた瞬間に自動で復習対象にする** のが今回の核です。

---

# 13. まとめ

## 画面

* ログイン
* ユーザー登録
* ホーム
* 回次一覧
* 問題一覧
* 問題解答
* 結果
* **間違えた問題一覧**
* **復習画面**
* 学習履歴
* 学習統計
* 管理画面

## DB

* users
* exam_sets
* categories
* questions
* choices
* answer_histories
* **wrong_question_statuses**

## API

* auth系
* exam_sets取得
* questions取得
* answer登録
* **wrong-questions取得**
* **review-answer登録**
* stats取得

---

次はこの内容をもとに、
**Prismaのschema設計** か **API仕様書の表形式版** まで落とし込むのが進めやすいです。


