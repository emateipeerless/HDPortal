interface KeyFleetMetricsProps {
  jockeyPumpActivity: number
  firePumpActivity: number
  predictiveStatistics: number
  onViewJockeyPump: () => void
  onViewFirePump: () => void
  onViewPredictiveStats: () => void
}

export function KeyFleetMetrics({
  jockeyPumpActivity,
  firePumpActivity,
  predictiveStatistics,
  onViewJockeyPump,
  onViewFirePump,
  onViewPredictiveStats,
}: KeyFleetMetricsProps) {
  const items = [
    {
      key: 'jockey',
      title: 'Jockey Pump Activity',
      value: jockeyPumpActivity,
      onClick: onViewJockeyPump,
      tone: 'blue',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3c2.8 3.4 4.2 5.8 4.2 8.2A4.2 4.2 0 0 1 12 15.4 4.2 4.2 0 0 1 7.8 11.2C7.8 8.8 9.2 6.4 12 3zm-5.2 13.2h10.4v1.6H6.8v-1.6zm1.4 2.8h7.6V21H8.2v-2z"
          />
        </svg>
      ),
    },
    {
      key: 'fire',
      title: 'Fire Pump Activity',
      value: firePumpActivity,
      onClick: onViewFirePump,
      tone: 'red',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2s5 4.2 5 9a5 5 0 0 1-9.3 2.5C6.4 12 7.2 9.6 9 8.2 8.8 10 10 11.2 11.2 11.6 10.2 9.4 10.4 6.8 12 2z"
          />
        </svg>
      ),
    },
    {
      key: 'predictive',
      title: 'Predictive Statistics',
      value: predictiveStatistics,
      onClick: onViewPredictiveStats,
      tone: 'purple',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 16.5 9.2 11l3.1 3.2L20 6.2l1.4 1.4-9.1 9.4-3.2-3.3L5.4 18 4 16.5z"
          />
        </svg>
      ),
    },
  ]

  return (
    <article className="panel-card fleet-metrics" aria-label="Key fleet metrics">
      <h3 className="panel-card__title">Key Fleet Metrics</h3>
      <div className="fleet-metrics__list">
        {items.map((item) => (
          <button key={item.key} type="button" className="fleet-metrics__item" onClick={item.onClick}>
            <span className={`fleet-metrics__icon fleet-metrics__icon--${item.tone}`}>{item.icon}</span>
            <span className="fleet-metrics__copy">
              <span className="fleet-metrics__label">{item.title}</span>
              <span className="fleet-metrics__value">{item.value}</span>
            </span>
            <span className="fleet-metrics__hint">View details</span>
          </button>
        ))}
      </div>
    </article>
  )
}
