import { buildSiteHealthTrend } from '../data/dashboardCharts'

interface SiteHealthTrendProps {
  red: number
  yellow: number
  green: number
}

const COLORS = {
  red: '#dc2626',
  yellow: '#eab308',
  green: '#22c55e',
} as const

export function SiteHealthTrend({ red, yellow, green }: SiteHealthTrendProps) {
  const series = buildSiteHealthTrend(red, yellow, green)
  const width = 640
  const height = 280
  const padLeft = 40
  const padRight = 16
  const padTop = 12
  const padBottom = 40
  const innerWidth = width - padLeft - padRight
  const innerHeight = height - padTop - padBottom
  const peak = Math.max(...series.map((point) => point.red + point.yellow + point.green), 1)
  const maxY = Math.max(10, Math.ceil((peak * 1.15) / 10) * 10)
  const slot = innerWidth / series.length
  const barWidth = Math.min(42, slot * 0.62)

  const yFor = (value: number) => padTop + innerHeight - (value / maxY) * innerHeight
  const ticks = [0, maxY / 2, maxY]

  return (
    <article className="panel-card health-trend" aria-label="Site health trend">
      <div className="health-trend__header">
        <h3 className="panel-card__title">Site Health Trend</h3>
        <span className="health-trend__range">Weekly</span>
      </div>
      <svg className="health-trend__chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Stacked weekly site status">
        {ticks.map((tick) => {
          const y = yFor(tick)
          return (
            <g key={tick}>
              <line x1={padLeft} x2={width - padRight} y1={y} y2={y} className="health-trend__grid" />
              <text x={padLeft - 6} y={y + 4} textAnchor="end" className="health-trend__tick">
                {tick}
              </text>
            </g>
          )
        })}
        {series.map((point, index) => {
          const x = padLeft + index * slot + (slot - barWidth) / 2
          const greenHeight = (point.green / maxY) * innerHeight
          const yellowHeight = (point.yellow / maxY) * innerHeight
          const redHeight = (point.red / maxY) * innerHeight
          const greenY = yFor(point.green)
          const yellowY = yFor(point.green + point.yellow)
          const redY = yFor(point.green + point.yellow + point.red)
          const total = point.red + point.yellow + point.green
          return (
            <g key={point.label}>
              <rect x={x} y={greenY} width={barWidth} height={greenHeight} fill={COLORS.green} />
              <rect x={x} y={yellowY} width={barWidth} height={yellowHeight} fill={COLORS.yellow} />
              <rect x={x} y={redY} width={barWidth} height={redHeight} fill={COLORS.red} />
              <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" className="health-trend__label">
                {point.label}
              </text>
              <title>{`${point.label}: ${point.red} immediate, ${point.yellow} monitor, ${point.green} no action, ${total} total`}</title>
            </g>
          )
        })}
      </svg>
      <ul className="health-trend__legend">
        <li><span style={{ background: COLORS.red }} />Immediate Attention</li>
        <li><span style={{ background: COLORS.yellow }} />Monitor Closely</li>
        <li><span style={{ background: COLORS.green }} />No Action Required</li>
      </ul>
    </article>
  )
}
