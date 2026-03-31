const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") ?? ""

export function buildApiUrl(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const rawUrl = configuredApiUrl ? `${configuredApiUrl}${normalizedPath}` : normalizedPath
  const url = new URL(rawUrl, window.location.origin)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") {
        continue
      }

      url.searchParams.set(key, String(value))
    }
  }

  return configuredApiUrl ? url.toString() : `${url.pathname}${url.search}`
}
