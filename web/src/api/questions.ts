import { buildApiUrl } from "./client"

export async function getQuestions(userId?: number) {
  const res = await fetch(
    buildApiUrl("/questions", typeof userId === "number" ? { userId } : undefined)
  )

  if (!res.ok) {
    throw new Error("問題取得失敗")
  }

  return res.json()
}

export async function getQuestionById(id: number | string, userId?: number) {
  const res = await fetch(
    buildApiUrl(`/questions/${id}`, typeof userId === "number" ? { userId } : undefined)
  )

  if (!res.ok) {
    throw new Error("問題詳細取得失敗")
  }

  return res.json()
}
