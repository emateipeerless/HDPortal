import { useState } from 'react'
import { AlertListView } from './components/AlertListView'
import { Dashboard } from './components/Dashboard'
import { ImpairmentsDetailView } from './components/ImpairmentsDetailView'
import { PredictiveStatsDetailView } from './components/PredictiveStatsDetailView'
import { PumpActivityDetailView } from './components/PumpActivityDetailView'
import { Sidebar } from './components/Sidebar'
import { StoreDetailView } from './components/StoreDetailView'
import { TopBar } from './components/TopBar'
import type { AlertSeverity } from './data/mockAlerts'
import './App.css'

type AppView =
  | 'dashboard'
  | 'store'
  | AlertSeverity
  | 'impairments'
  | 'predictive-statistics'
  | 'jockey-pump'
  | 'fire-pump'

export default function App() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [view, setView] = useState<AppView>('dashboard')

  const goToDashboard = () => {
    setView('dashboard')
    setSelectedStoreId(null)
  }

  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId)
    setView('store')
  }

  return (
    <div className="app">
      <Sidebar selectedStoreId={selectedStoreId} onSelectStore={handleSelectStore} />
      <div className="app__main">
        <TopBar selectedStoreId={selectedStoreId} onSelectStore={handleSelectStore} />
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
          <StoreDetailView storeId={selectedStoreId} onBack={goToDashboard} />
        )}
        {(view === 'red' || view === 'yellow') && (
          <AlertListView severity={view} onBack={goToDashboard} />
        )}
        {view === 'impairments' && <ImpairmentsDetailView onBack={goToDashboard} />}
        {view === 'predictive-statistics' && (
          <PredictiveStatsDetailView onBack={goToDashboard} />
        )}
        {view === 'jockey-pump' && (
          <PumpActivityDetailView pumpType="jockey" onBack={goToDashboard} />
        )}
        {view === 'fire-pump' && (
          <PumpActivityDetailView pumpType="fire" onBack={goToDashboard} />
        )}
      </div>
    </div>
  )
}
