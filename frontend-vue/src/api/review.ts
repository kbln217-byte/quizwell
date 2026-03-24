const BASE_URL = "http://localhost:3000"

export async function getReviewQuestions(userId: number) {
  const res = await fetch(`${BASE_URL}/review/questions?userId=${userId}`)

  if (!res.ok) {
    throw new Error("復習問題取得失敗")
  }

  return res.json()
}
