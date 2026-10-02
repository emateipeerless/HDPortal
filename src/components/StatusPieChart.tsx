interface StatusPieChartProps {
  red: number
  yellow: number
  green: number
  onRedClick: () => void
  onYellowClick: () => void
}

const COLORS = {
  red: '#dc2626',
  yellow: '#ca8a04',
  green: '#16a34a',
} as const

type SliceKey = keyof typeof COLORS

interface Slice {
  key: SliceKey
  label: string
  value: number
  color: string
  onClick?: () => void
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

function describeSlice(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle
  if (sweep <= 0) return ''
  if (sweep >= 359.999) {
    return [
      `M ${cx} ${cy - radius}`,
      `A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius}`,
      `A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`,
      'Z',
    ].join(' ')
  }

  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArc = sweep > 180 ? 1 : 0
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

export function StatusPieChart({
  red,
  yellow,
  green,
  onRedClick,
  onYellowClick,
}: StatusPieChartProps) {
  const slices: Slice[] = [
    {
      key: 'red',
      label: 'Immediate Attention Required',
      value: red,
      color: COLORS.red,
      onClick: onRedClick,
    },
    {
      key: 'yellow',
      label: 'Monitor Closely',
      value: yellow,
      color: COLORS.yellow,
      onClick: onYellowClick,
    },
    {
      key: 'green',
      label: 'No Action Required',
      value: green,
      color: COLORS.green,
    },
  ]

  const total = slices.reduce((sum, slice) => sum + Math.max(0, slice.value), 0)
  const size = 220
  const cx = size / 2
  const cy = size / 2
  const radius = 92

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
        path: describeSlice(cx, cy, radius, startAngle, endAngle),
      }
    })

  return (
    <article className="status-pie-card" aria-label="Fleet status distribution">
      <h3 className="status-pie-card__title">Fleet Status Mix</h3>
      <div className="status-pie-card__body">
        {total === 0 ? (
          <p className="status-pie-card__empty">No fleet status data available.</p>
        ) : (
          <svg
            className="status-pie-card__chart"
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={`Fleet status: ${red} red, ${yellow} yellow, ${green} green`}
          >
            {rendered.map((slice) => {
              const clickable = Boolean(slice.onClick)
              if (clickable) {
                return (
                  <path
                    key={slice.key}
                    d={slice.path}
                    fill={slice.color}
                    className="status-pie-card__slice status-pie-card__slice--clickable"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${slice.label} (${slice.value})`}
                    onClick={slice.onClick}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        slice.onClick?.()
                      }
                    }}
                  />
                )
              }
              return (
                <path
                  key={slice.key}
                  d={slice.path}
                  fill={slice.color}
                  className="status-pie-card__slice"
                  aria-label={`${slice.label}: ${slice.value}`}
                />
              )
            })}
          </svg>
        )}

        <ul className="status-pie-card__legend">
          {slices.map((slice) => (
            <li key={slice.key} className="status-pie-card__legend-item">
              <span
                className="status-pie-card__swatch"
                style={{ background: slice.color }}
                aria-hidden="true"
              />
              <span className="status-pie-card__legend-label">{slice.label}</span>
              <span className="status-pie-card__legend-value">{slice.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="status-pie-card__hint">Click red or yellow slices to open those lists</p>
    </article>
  )
}
