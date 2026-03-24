const BASE_URL = "http://localhost:3000"

export async function getSessions() {
  const res = await fetch(`${BASE_URL}/sessions`)

  if (!res.ok) {
    throw new Error("回次取得失敗")
  }

  return res.json()
}
