import { MOCK_RESOLUTION_TREND, isResolutionTrendPositive } from '../data/mockResolutionTime'

interface SparklineProps {
  points: number[]
  positive: boolean
}

function Sparkline({ points, positive }: SparklineProps) {
  const width = 88
  const height = 36
  const padding = 2
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const coords = points.map((point, index) => {
    const x = padding + (index / (points.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (point - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <polyline
        className={positive ? 'sparkline__line sparkline__line--positive' : 'sparkline__line sparkline__line--negative'}
        points={coords.join(' ')}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ResolutionTimeCard() {
  const { currentDisplay, previousMonthChangePercent, sparklinePoints } = MOCK_RESOLUTION_TREND
  const isPositive = isResolutionTrendPositive()
  const changePrefix = previousMonthChangePercent > 0 ? '+' : ''
  const trendClass = isPositive
    ? 'resolution-card__trend resolution-card__trend--positive'
    : 'resolution-card__trend resolution-card__trend--negative'

  return (
    <article className="metric-card metric-card--grey resolution-card">
      <div className="resolution-card__top">
        <h2 className="metric-card__title">Average Resolution Time</h2>
        <div className="resolution-card__preview">
          <Sparkline points={sparklinePoints} positive={isPositive} />
          <span className={trendClass}>
            {changePrefix}
            {previousMonthChangePercent}% vs last month
          </span>
        </div>
      </div>
      <p className="metric-card__value">{currentDisplay}</p>
    </article>
  )
}
