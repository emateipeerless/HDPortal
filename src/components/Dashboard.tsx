import type { ReactNode } from 'react'
import { getConnectivityCounts, getItmCounts } from '../data/dashboardCharts'
import { mockMetrics } from '../data/mockMetrics'
import { getStoreStatus } from '../data/storeProfile'
import { STORE_COORDINATES } from '../data/storeCoordinates'
import { STORES } from '../data/stores'
import { DonutChart } from './DonutChart'
import { KeyFleetMetrics } from './KeyFleetMetrics'
import { MetricCard } from './MetricCard'
import { SiteHealthTrend } from './SiteHealthTrend'
import { UsSiteMap } from './UsSiteMap'

interface DashboardProps {
  onViewRedAlerts: () => void
  onViewYellowAlerts: () => void
  onViewPredictiveStats: () => void
  onViewJockeyPump: () => void
  onViewFirePump: () => void
  onSelectStore: (storeId: string) => void
}

function StatusIcon({ children }: { children: ReactNode }) {
  return <span className="metric-card__icon">{children}</span>
}

export function Dashboard({
  onViewRedAlerts,
  onViewYellowAlerts,
  onViewPredictiveStats,
  onViewJockeyPump,
  onViewFirePump,
  onSelectStore,
}: DashboardProps) {
  const connectivity = getConnectivityCounts()
  const itm = getItmCounts()
  const sites = STORES.flatMap((store) => {
    const coordinates = STORE_COORDINATES[store.id]
    if (!coordinates) return []
    return [
      {
        id: store.id,
        location: store.location,
        status: getStoreStatus(store.id),
        lat: coordinates.lat,
        lon: coordinates.lon,
      },
    ]
  })

  return (
    <main className="dashboard">
      <section className="dashboard__kpis" aria-label="Portfolio status">
        <MetricCard
          compact
          title="Immediate Attention Required"
          value={mockMetrics.immediateAttention}
          variant="red"
          onClick={onViewRedAlerts}
          hint="View flagged sites"
          icon={
            <StatusIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path fill="currentColor" d="M11 7h2v7h-2zm0 8h2v2h-2z" />
              </svg>
            </StatusIcon>
          }
        />
        <MetricCard
          compact
          title="Monitor Closely"
          value={mockMetrics.monitorClosely}
          variant="yellow"
          onClick={onViewYellowAlerts}
          hint="View flagged sites"
          icon={
            <StatusIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 4 3 19h18L12 4zm0 5 5.2 8H6.8L12 9zm-1 3h2v3h-2zm0 4h2v2h-2z" />
              </svg>
            </StatusIcon>
          }
        />
        <MetricCard
          compact
          title="No Action Required"
          value={mockMetrics.noActionRequired}
          variant="green"
          icon={
            <StatusIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path fill="none" stroke="currentColor" strokeWidth="2" d="m8 12.2 2.4 2.4L16 9.2" />
              </svg>
            </StatusIcon>
          }
        />
        <MetricCard
          compact
          title="Overall Portfolio Grade"
          value={`${mockMetrics.overallPortfolioGrade.grade} ${mockMetrics.overallPortfolioGrade.percentage}%`}
          variant="blue"
          icon={
            <StatusIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M5 19h3V10H5zm5.5 0h3V5h-3zM16 19h3v-7h-3z" />
              </svg>
            </StatusIcon>
          }
        />
      </section>

      <section className="dashboard__layout" aria-label="Fleet overview">
        <div className="dashboard__status">
          <DonutChart
            title="Fleet Status Mix"
            ariaLabel="Fleet status mix"
            slices={[
              {
                key: 'red',
                label: 'Immediate Attention',
                value: mockMetrics.immediateAttention,
                color: '#dc2626',
                onClick: onViewRedAlerts,
              },
              {
                key: 'yellow',
                label: 'Monitor Closely',
                value: mockMetrics.monitorClosely,
                color: '#eab308',
                onClick: onViewYellowAlerts,
              },
              {
                key: 'green',
                label: 'No Action Required',
                value: mockMetrics.noActionRequired,
                color: '#22c55e',
              },
            ]}
          />
        </div>
        <div className="dashboard__map">
          <UsSiteMap sites={sites} onSelectStore={onSelectStore} />
        </div>
        <div className="dashboard__metrics">
          <KeyFleetMetrics
            jockeyPumpActivity={mockMetrics.jockeyPumpActivity}
            firePumpActivity={mockMetrics.firePumpActivity}
            predictiveStatistics={mockMetrics.predictiveStatistics}
            onViewJockeyPump={onViewJockeyPump}
            onViewFirePump={onViewFirePump}
            onViewPredictiveStats={onViewPredictiveStats}
          />
        </div>
        <div className="dashboard__connect">
          <DonutChart
            title="Site Connectivity"
            ariaLabel="Site connectivity"
            slices={[
              {
                key: 'offline',
                label: 'Offline',
                value: connectivity.offline,
                color: '#f3a8b8',
              },
              {
                key: 'online',
                label: 'Online',
                value: connectivity.online,
                color: '#8ed4ae',
              },
            ]}
          />
        </div>
        <div className="dashboard__trend">
          <SiteHealthTrend
            red={mockMetrics.immediateAttention}
            yellow={mockMetrics.monitorClosely}
            green={mockMetrics.noActionRequired}
          />
        </div>
        <div className="dashboard__itm">
          <DonutChart
            title="ITM Compliance"
            ariaLabel="ITM compliance"
            slices={[
              {
                key: 'compliant',
                label: 'Compliant',
                value: itm.compliant,
                color: '#6d7cff',
              },
              {
                key: 'noncompliant',
                label: 'Non-compliant',
                value: itm.nonCompliant,
                color: '#f0b44c',
              },
            ]}
          />
        </div>
      </section>
    </main>
  )
}
