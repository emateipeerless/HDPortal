import { mockMetrics } from '../data/mockMetrics'
import { MetricCard } from './MetricCard'
import { ResolutionTimeCard } from './ResolutionTimeCard'
import { StatusPieChart } from './StatusPieChart'

interface DashboardProps {
  onViewRedAlerts: () => void
  onViewYellowAlerts: () => void
  onViewPredictiveStats: () => void
  onViewJockeyPump: () => void
  onViewFirePump: () => void
}

export function Dashboard({
  onViewRedAlerts,
  onViewYellowAlerts,
  onViewPredictiveStats,
  onViewJockeyPump,
  onViewFirePump,
}: DashboardProps) {
  return (
    <main className="dashboard">
      <section className="dashboard__metrics-grid" aria-label="Fleet metrics">
        <MetricCard
          title="Immediate Attention Required"
          value={mockMetrics.immediateAttention}
          variant="red"
          onClick={onViewRedAlerts}
          hint="View flagged sites"
        />
        <MetricCard
          title="Monitor Closely"
          value={mockMetrics.monitorClosely}
          variant="yellow"
          onClick={onViewYellowAlerts}
          hint="View flagged sites"
        />
        <MetricCard
          title="No Action Required"
          value={mockMetrics.noActionRequired}
          variant="green"
        />
        <MetricCard
          title="Predictive Statistics"
          value={mockMetrics.predictiveStatistics}
          variant="blue"
          onClick={onViewPredictiveStats}
        />
        <MetricCard
          title="Jockey Pump Activity"
          value={mockMetrics.jockeyPumpActivity}
          variant="blue"
          onClick={onViewJockeyPump}
        />
        <MetricCard
          title="Fire Pump Activity"
          value={mockMetrics.firePumpActivity}
          variant="blue"
          onClick={onViewFirePump}
        />
      </section>

      <section className="dashboard__row dashboard__row--summary" aria-label="Portfolio summary">
        <StatusPieChart
          red={mockMetrics.immediateAttention}
          yellow={mockMetrics.monitorClosely}
          green={mockMetrics.noActionRequired}
          onRedClick={onViewRedAlerts}
          onYellowClick={onViewYellowAlerts}
        />
        <ResolutionTimeCard />
        <MetricCard
          title="Overall Portfolio Grade"
          value={`${mockMetrics.overallPortfolioGrade.grade} ${mockMetrics.overallPortfolioGrade.percentage}%`}
          variant="grey"
        />
      </section>
    </main>
  )
}
