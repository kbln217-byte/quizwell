const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") ?? ""

function isLoopbackHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

function getSafeApiBaseUrl() {
  if (!configuredApiUrl) {
    return ""
  }

  const configuredUrl = new URL(configuredApiUrl, window.location.origin)

  // Ignore a localhost API URL when the current page is not running locally.
  if (
    isLoopbackHostname(configuredUrl.hostname) &&
    !isLoopbackHostname(window.location.hostname)
  ) {
    return ""
  }

  // If the configured API is on the same hostname, prefer the current origin path
  // so that the frontend can use the local nginx reverse proxy instead of
  // calling the backend port directly.
  if (configuredUrl.hostname === window.location.hostname) {
    return ""
  }

  return configuredUrl.toString().replace(/\/+$/, "")
}

const safeApiBaseUrl = getSafeApiBaseUrl()

export function buildApiUrl(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const rawUrl = safeApiBaseUrl ? `${safeApiBaseUrl}${normalizedPath}` : normalizedPath
  const url = new URL(rawUrl, window.location.origin)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") {
        continue
      }

      url.searchParams.set(key, String(value))
    }
  }

  return safeApiBaseUrl ? url.toString() : `${url.pathname}${url.search}`
}
