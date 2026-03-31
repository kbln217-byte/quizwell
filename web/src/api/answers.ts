import { buildApiUrl } from "./client"

export async function submitAnswer(input: {
  userId: number
  questionId: number
  selectedChoiceId: number
}) {
  const res = await fetch(buildApiUrl("/answers"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`回答送信失敗: ${res.status} ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
