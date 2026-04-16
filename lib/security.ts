import "server-only"

import { headers } from "next/headers"

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/i,
  /^fc/i,
  /^fd/i,
]

export function isTrustedOriginMatch(
  source: string | null | undefined,
  allowedOrigin: string | null | undefined
) {
  if (!source || !allowedOrigin) {
    return false
  }

  try {
    const sourceUrl = new URL(source)
    const allowedUrl = new URL(allowedOrigin)

    return sourceUrl.origin === allowedUrl.origin
  } catch {
    return false
  }
}

function getRequestOriginFromHeaders(headerMap: Headers) {
  const forwardedProto = headerMap.get("x-forwarded-proto") ?? "https"
  const forwardedHost = headerMap.get("x-forwarded-host")
  const host = forwardedHost?.split(",")[0]?.trim() || headerMap.get("host")

  if (!host) {
    return null
  }

  return `${forwardedProto}://${host}`
}

export async function assertTrustedOrigin() {
  const headerMap = await headers()
  const requestOrigin = getRequestOriginFromHeaders(headerMap)
  const origin = headerMap.get("origin")
  const referer = headerMap.get("referer")

  const trusted =
    isTrustedOriginMatch(origin, requestOrigin) ||
    isTrustedOriginMatch(referer, requestOrigin)

  if (!trusted) {
    throw new Error("Untrusted request origin.")
  }
}

export function isSafeExternalUrl(value: string) {
  if (value.length > 2048 || /[\u0000-\u001F\u007F]/.test(value)) {
    return false
  }

  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    return false
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return false
  }

  if (parsed.username || parsed.password) {
    return false
  }

  const hostname = parsed.hostname.trim().toLowerCase()

  if (!hostname || PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(hostname))) {
    return false
  }

  return true
}
