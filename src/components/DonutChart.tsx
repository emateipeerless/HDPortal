export interface DonutSlice {
  key: string
  label: string
  value: number
  color: string
  onClick?: () => void
}

interface DonutChartProps {
  title: string
  slices: DonutSlice[]
  ariaLabel: string
  centerCaption?: string
}

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

function describeDonut(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle
  if (sweep <= 0) return ''

  if (sweep >= 359.999) {
    return [
      `M ${cx} ${cy - outerRadius}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${cy + outerRadius}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${cx} ${cy - outerRadius}`,
      `M ${cx} ${cy - innerRadius}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${cy + innerRadius}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${cy - innerRadius}`,
      'Z',
    ].join(' ')
  }

  const outerStart = polar(cx, cy, outerRadius, startAngle)
  const outerEnd = polar(cx, cy, outerRadius, endAngle)
  const innerEnd = polar(cx, cy, innerRadius, endAngle)
  const innerStart = polar(cx, cy, innerRadius, startAngle)
  const largeArc = sweep > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

export function DonutChart({
  title,
  slices,
  ariaLabel,
  centerCaption = 'Total Sites',
}: DonutChartProps) {
  const total = slices.reduce((sum, slice) => sum + Math.max(0, slice.value), 0)
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const outerRadius = 96
  const innerRadius = 60

  let angle = 0
  const rendered = slices
    .filter((slice) => slice.value > 0 && total > 0)
    .map((slice) => {
      const startAngle = angle
      const sweep = (slice.value / total) * 360
      const endAngle = angle + sweep
      angle = endAngle
      return {
        ...slice,
        path: describeDonut(cx, cy, outerRadius, innerRadius, startAngle, endAngle),
      }
    })

  return (
    <article className="panel-card donut-card" aria-label={ariaLabel}>
      <h3 className="panel-card__title">{title}</h3>
      <div className="donut-card__body">
        {total === 0 ? (
          <p className="donut-card__empty">No data available.</p>
        ) : (
          <svg className="donut-card__chart" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel}>
            {rendered.map((slice) => {
              const clickable = Boolean(slice.onClick)
              return (
                <path
                  key={slice.key}
                  d={slice.path}
                  fill={slice.color}
                  className={
                    clickable ? 'donut-card__slice donut-card__slice--clickable' : 'donut-card__slice'
                  }
                  role={clickable ? 'button' : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  aria-label={`${slice.label}: ${slice.value}`}
                  onClick={slice.onClick}
                  onKeyDown={(event) => {
                    if (!slice.onClick) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      slice.onClick()
                    }
                  }}
                />
              )
            })}
            <circle cx={cx} cy={cy} r={innerRadius - 1} fill="#ffffff" />
            <text className="donut-card__total" x={cx} y={cy - 2} textAnchor="middle">
              {total}
            </text>
            <text className="donut-card__caption" x={cx} y={cy + 16} textAnchor="middle">
              {centerCaption}
            </text>
          </svg>
        )}

        <ul className="donut-card__legend">
          {slices.map((slice) => {
            const percent = total === 0 ? 0 : Math.round((slice.value / total) * 100)
            return (
              <li key={slice.key} className="donut-card__legend-item">
                <span className="donut-card__swatch" style={{ background: slice.color }} aria-hidden="true" />
                <span className="donut-card__legend-label">{slice.label}</span>
                <span className="donut-card__legend-value">
                  {slice.value} <span className="donut-card__legend-percent">({percent}%)</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}
