const SESSION_STORAGE_KEY = 'hdportal.session'

/** Inactivity timeout for the development session (15 minutes). */
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000

export interface AuthSession {
  username: string
  displayName: string
  lastActivityAt: number
}

export function readSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed.username || !parsed.lastActivityAt) return null
    return parsed
  } catch {
    return null
  }
}

export function writeSession(session: AuthSession): void {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

export function isSessionExpired(session: AuthSession, now = Date.now()): boolean {
  return now - session.lastActivityAt > SESSION_TIMEOUT_MS
}

export function touchSession(session: AuthSession): AuthSession {
  const next = { ...session, lastActivityAt: Date.now() }
  writeSession(next)
  return next
}

export function getSessionRemainingMs(session: AuthSession, now = Date.now()): number {
  return Math.max(0, SESSION_TIMEOUT_MS - (now - session.lastActivityAt))
}

export function formatSessionTimeout(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60000)
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
  }
  return `${totalMinutes} min`
}
