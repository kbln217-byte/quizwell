import { buildApiUrl } from "./client"

export async function createUser(input: {
  email: string
  password: string
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
    const json = JSON.parse(text)
    throw new Error(json.error?.message ?? "ユーザー作成失敗")
  }

  return JSON.parse(text)
}
