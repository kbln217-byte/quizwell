const USER_ID_KEY = "userId"
const TOKEN_KEY = "token"

export function saveAuth(auth: { userId: number; token: string }) {
  localStorage.setItem(USER_ID_KEY, String(auth.userId))
  localStorage.setItem(TOKEN_KEY, auth.token)
}

export function clearAuth() {
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export function getUserId(): number | null {
  const raw = localStorage.getItem(USER_ID_KEY)
  if (!raw) return null

  const userId = Number(raw)
  if (!Number.isInteger(userId) || userId <= 0) return null

  return userId
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return !!getToken() && getUserId() !== null
}