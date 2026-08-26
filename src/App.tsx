import { useEffect, useState } from 'react'
import {
  clearSession,
  isSessionExpired,
  readSession,
  touchSession,
  writeSession,
  type AuthSession,
} from './auth/session'
import { AlertListView } from './components/AlertListView'
import { Dashboard } from './components/Dashboard'
import { ImpairmentsDetailView } from './components/ImpairmentsDetailView'
import { LoginPage } from './components/LoginPage'
import { PredictiveStatsDetailView } from './components/PredictiveStatsDetailView'
import { PumpActivityDetailView } from './components/PumpActivityDetailView'
import { Sidebar } from './components/Sidebar'
import { StoreDetailView } from './components/StoreDetailView'
import { TopBar } from './components/TopBar'
import type { AlertSeverity } from './data/mockAlerts'
import './App.css'

type ListView =
  | AlertSeverity
  | 'impairments'
  | 'predictive-statistics'
  | 'jockey-pump'
  | 'fire-pump'

type AppView = 'dashboard' | 'store' | ListView
type ReturnView = Exclude<AppView, 'store'>

const RETURN_VIEW_LABELS: Record<ReturnView, string> = {
  dashboard: 'Dashboard',
  red: 'Immediate Attention Required',
  yellow: 'Monitor Closely',
  impairments: 'Impairments',
  'predictive-statistics': 'Predictive Statistics',
  'jockey-pump': 'Jockey Pump Activity',
  'fire-pump': 'Fire Pump Activity',
}

function loadInitialSession(): AuthSession | null {
  const existing = readSession()
  if (!existing) return null
  if (isSessionExpired(existing)) {
    clearSession()
    return null
  }
  return touchSession(existing)
}

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadInitialSession())
  const [timeoutMessage, setTimeoutMessage] = useState<string | null>(null)
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [view, setView] = useState<AppView>('dashboard')
  const [returnView, setReturnView] = useState<ReturnView>('dashboard')

  const handleLogout = (message?: string) => {
    clearSession()
    setSession(null)
    setSelectedStoreId(null)
    setView('dashboard')
    setReturnView('dashboard')
    setTimeoutMessage(message ?? null)
  }

  const handleLogin = (username: string, displayName: string) => {
    const next: AuthSession = {
      username,
      displayName,
      lastActivityAt: Date.now(),
    }
    writeSession(next)
    setSession(next)
    setTimeoutMessage(null)
  }

  const isAuthenticated = Boolean(session)

  useEffect(() => {
    if (!isAuthenticated) return

    let lastTouchWrite = Date.now()

    const refreshActivity = () => {
      const now = Date.now()
      setSession((current) => {
        if (!current) return current
        if (isSessionExpired(current, now)) {
          clearSession()
          setTimeoutMessage('Your session expired due to inactivity. Please sign in again.')
          return null
        }
        // Throttle session writes while the user is active.
        if (now - lastTouchWrite < 30_000) return current
        lastTouchWrite = now
        return touchSession(current)
      })
    }

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    for (const event of events) {
      window.addEventListener(event, refreshActivity, { passive: true })
    }

    const intervalId = window.setInterval(() => {
      setSession((current) => {
        if (!current) return current
        if (isSessionExpired(current)) {
          clearSession()
          setTimeoutMessage('Your session expired due to inactivity. Please sign in again.')
          return null
        }
        return current
      })
    }, 15_000)

    return () => {
      for (const event of events) {
        window.removeEventListener(event, refreshActivity)
      }
      window.clearInterval(intervalId)
    }
  }, [isAuthenticated])

  if (!session) {
    return <LoginPage onLogin={handleLogin} timeoutMessage={timeoutMessage} />
  }

  const goToDashboard = () => {
    setView('dashboard')
    setReturnView('dashboard')
    setSelectedStoreId(null)
  }

  const openStoreFromSidebar = (storeId: string) => {
    setReturnView('dashboard')
    setSelectedStoreId(storeId)
    setView('store')
  }

  const openStoreFromList = (storeId: string) => {
    if (view !== 'store') {
      setReturnView(view)
    }
    setSelectedStoreId(storeId)
    setView('store')
  }

  const handleStoreBack = () => {
    setView(returnView)
    if (returnView === 'dashboard') {
      setSelectedStoreId(null)
    }
  }

  return (
    <div className="app">
      <Sidebar selectedStoreId={selectedStoreId} onSelectStore={openStoreFromSidebar} />
      <div className="app__main">
        <TopBar
          selectedStoreId={selectedStoreId}
          displayName={session.displayName}
          onLogout={() => handleLogout()}
        />
        {view === 'dashboard' && (
          <Dashboard
            onViewRedAlerts={() => setView('red')}
            onViewYellowAlerts={() => setView('yellow')}
            onViewImpairments={() => setView('impairments')}
            onViewPredictiveStats={() => setView('predictive-statistics')}
            onViewJockeyPump={() => setView('jockey-pump')}
            onViewFirePump={() => setView('fire-pump')}
          />
        )}
        {view === 'store' && selectedStoreId && (
          <StoreDetailView
            storeId={selectedStoreId}
            onBack={handleStoreBack}
            backLabel={RETURN_VIEW_LABELS[returnView]}
          />
        )}
        {(view === 'red' || view === 'yellow') && (
          <AlertListView severity={view} onBack={goToDashboard} onSelectStore={openStoreFromList} />
        )}
        {view === 'impairments' && (
          <ImpairmentsDetailView onBack={goToDashboard} onSelectStore={openStoreFromList} />
        )}
        {view === 'predictive-statistics' && (
          <PredictiveStatsDetailView onBack={goToDashboard} onSelectStore={openStoreFromList} />
        )}
        {view === 'jockey-pump' && (
          <PumpActivityDetailView
            pumpType="jockey"
            onBack={goToDashboard}
            onSelectStore={openStoreFromList}
          />
        )}
        {view === 'fire-pump' && (
          <PumpActivityDetailView
            pumpType="fire"
            onBack={goToDashboard}
            onSelectStore={openStoreFromList}
          />
        )}
      </div>
    </div>
  )
}
