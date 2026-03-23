export async function getQuestions() {
  const res = await fetch("http://localhost:3000/questions")

  if (!res.ok) {
    throw new Error("問題取得失敗")
  }

  return res.json()
}

export async function getQuestionById(id: number | string) {
  const res = await fetch(`http://localhost:3000/questions/${id}`)

  if (!res.ok) {
    throw new Error("問題詳細取得失敗")
  }

  return res.json()
}