import { buildApiUrl } from "./client"

export async function getReviewQuestions(userId: number) {
  const res = await fetch(buildApiUrl("/review/questions", { userId }))

  if (!res.ok) {
    throw new Error("復習問題取得失敗")
  }

  return res.json()
}

export async function getReviewCount(userId: number) {
  const res = await fetch(buildApiUrl("/review/count", { userId }))

  if (!res.ok) {
    throw new Error("復習件数の取得に失敗しました")
  }

  return res.json() as Promise<{ count: number }>
}
