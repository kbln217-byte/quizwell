export async function getQuestions(userId?: number) {
  const url = new URL("http://localhost:3000/questions")
  if (typeof userId === "number") {
    url.searchParams.set("userId", String(userId))
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    throw new Error("問題取得失敗")
  }

  return res.json()
}

export async function getQuestionById(id: number | string, userId?: number) {
  const url = new URL(`http://localhost:3000/questions/${id}`)
  if (typeof userId === "number") {
    url.searchParams.set("userId", String(userId))
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    throw new Error("問題詳細取得失敗")
  }

  return res.json()
}