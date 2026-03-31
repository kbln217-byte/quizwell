import { buildApiUrl } from "./client"

export async function getFlaggedQuestionIds(userId: number) {
  const res = await fetch(buildApiUrl("/question-flags", { userId }))

  if (!res.ok) {
    throw new Error("目印一覧の取得に失敗しました")
  }

  return res.json() as Promise<{ questionIds: number[] }>
}

export async function getQuestionFlag(questionId: number | string, userId: number) {
  const res = await fetch(buildApiUrl(`/question-flags/${questionId}`, { userId }))

  if (!res.ok) {
    throw new Error("目印の取得に失敗しました")
  }

  return res.json() as Promise<{ flagged: boolean }>
}

export async function toggleQuestionFlag(userId: number, questionId: number) {
  const res = await fetch(buildApiUrl("/question-flags/toggle"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, questionId }),
  })

  if (!res.ok) {
    throw new Error("目印の更新に失敗しました")
  }

  return res.json() as Promise<{ flagged: boolean }>
}
