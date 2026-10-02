import type { ReactNode } from 'react'

type MetricCardVariant = 'red' | 'yellow' | 'green' | 'blue' | 'grey'

interface MetricCardProps {
  title: string
  value: ReactNode
  variant: MetricCardVariant
  onClick?: () => void
  hint?: string
  compact?: boolean
  icon?: ReactNode
}

const variantClass: Record<MetricCardVariant, string> = {
  red: 'metric-card--red',
  yellow: 'metric-card--yellow',
  green: 'metric-card--green',
  blue: 'metric-card--blue',
  grey: 'metric-card--grey',
}

export function MetricCard({
  title,
  value,
  variant,
  onClick,
  hint = 'View details',
  compact = false,
  icon,
}: MetricCardProps) {
  const isClickable = Boolean(onClick)
  const className = [
    'metric-card',
    variantClass[variant],
    compact ? 'metric-card--compact' : '',
    isClickable ? 'metric-card--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      <div className="metric-card__head">
        {icon}
        <h2 className="metric-card__title">{title}</h2>
      </div>
      <p className="metric-card__value">{value}</p>
      {isClickable && <span className="metric-card__hint">{hint}</span>}
    </>
  )

  if (isClickable) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {body}
      </button>
    )
  }

  return <article className={className}>{body}</article>
}
