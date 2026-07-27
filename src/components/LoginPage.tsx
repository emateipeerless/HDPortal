import { useState, type FormEvent } from 'react'
import { authenticateLocal } from '../data/credentials'
import { SESSION_TIMEOUT_MS, formatSessionTimeout } from '../auth/session'
import fcLogo from '../assets/FClogo.png'

interface LoginPageProps {
  onLogin: (username: string, displayName: string) => void
  timeoutMessage?: string | null
}

export function LoginPage({ onLogin, timeoutMessage }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const user = authenticateLocal(username, password)
    if (!user) {
      setError('Invalid username or password.')
      return
    }
    setError(null)
    onLogin(user.username, user.displayName)
  }

  return (
    <div className="login-page">
      <div className="login-page__card">
        <div className="login-page__brand">
          <img
            className="login-page__logo"
            src={fcLogo}
            alt="FireConnect logo"
            width={1000}
            height={500}
          />
          <div>
            <h1 className="login-page__title">Home Depot Fleet Portal</h1>
            <p className="login-page__subtitle">Sign in to view portfolio analytics</p>
          </div>
        </div>

        {timeoutMessage && <p className="login-page__timeout">{timeoutMessage}</p>}

        <form className="login-page__form" onSubmit={handleSubmit}>
          <label className="login-page__label" htmlFor="login-username">
            Username
          </label>
          <input
            id="login-username"
            className="login-page__input"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label className="login-page__label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            className="login-page__input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="login-page__error">{error}</p>}

          <button type="submit" className="login-page__submit">
            Sign in
          </button>
        </form>

        <p className="login-page__hint">
          Session expires after {formatSessionTimeout(SESSION_TIMEOUT_MS)} of inactivity.
        </p>
      </div>
    </div>
  )
}
