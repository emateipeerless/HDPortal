/**
 * Local development credentials only.
 * Replace with hashed auth (bcrypt) / identity provider before production.
 */
export interface LocalCredential {
  username: string
  password: string
  displayName: string
}

export const LOCAL_CREDENTIALS: LocalCredential[] = [
  {
    username: 'admin',
    password: 'Grundfos1!',
    displayName: 'Fleet Admin',
  },
  {
    username: 'viewer',
    password: 'HomeDepot1!',
    displayName: 'Portfolio Viewer',
  },
]

export function authenticateLocal(username: string, password: string): LocalCredential | null {
  const normalized = username.trim().toLowerCase()
  return (
    LOCAL_CREDENTIALS.find(
      (user) => user.username.toLowerCase() === normalized && user.password === password,
    ) ?? null
  )
}
