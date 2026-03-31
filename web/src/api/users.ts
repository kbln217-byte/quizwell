import { buildApiUrl } from "./client"

export async function createUser(input: {
  name: string
  email: string
}): Promise<any> {
  const res = await fetch(buildApiUrl("/users"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`ユーザー作成失敗: ${res.status} ${text}`)
  }

  return JSON.parse(text)
}
