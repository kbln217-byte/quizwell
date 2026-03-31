import { buildApiUrl } from "./client"

export async function getSessions() {
  const res = await fetch(buildApiUrl("/sessions"))

  if (!res.ok) {
    throw new Error("回次取得失敗")
  }

  return res.json()
}
