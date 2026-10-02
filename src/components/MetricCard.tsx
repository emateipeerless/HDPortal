import type { ReactNode } from 'react'

type MetricCardVariant = 'red' | 'yellow' | 'green' | 'blue' | 'grey'

interface MetricCardProps {
  title: string
  value: ReactNode
  variant: MetricCardVariant
  onClick?: () => void
  hint?: string
}

const variantClass: Record<MetricCardVariant, string> = {
  red: 'metric-card--red',
  yellow: 'metric-card--yellow',
  green: 'metric-card--green',
  blue: 'metric-card--blue',
  grey: 'metric-card--grey',
}

export function MetricCard({ title, value, variant, onClick, hint = 'View details' }: MetricCardProps) {
  const isClickable = Boolean(onClick)
  const className = [
    'metric-card',
    variantClass[variant],
    isClickable ? 'metric-card--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (isClickable) {
    return (
      <button type="button" className={className} onClick={onClick}>
        <h2 className="metric-card__title">{title}</h2>
        <p className="metric-card__value">{value}</p>
        <span className="metric-card__hint">{hint}</span>
      </button>
    )
  }

  return (
    <article className={className}>
      <h2 className="metric-card__title">{title}</h2>
      <p className="metric-card__value">{value}</p>
    </article>
  )
}
