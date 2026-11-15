/**
 * Minimal JWT payload decoder (no signature verification — that's the
 * server's job). Used only to read non-sensitive claims like role/email
 * for UI purposes such as showing the admin nav or the user's name.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
