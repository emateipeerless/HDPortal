import type { ReactNode } from 'react'

interface DetailViewLayoutProps {
  title: string
  subtitle: string
  accentClass?: string
  onBack: () => void
  backLabel?: string
  children: ReactNode
}

export function DetailViewLayout({
  title,
  subtitle,
  accentClass = '',
  onBack,
  backLabel = 'Dashboard',
  children,
}: DetailViewLayoutProps) {
  return (
    <main className={`detail-view ${accentClass}`}>
      <div className="detail-view__header">
        <button type="button" className="detail-view__back" onClick={onBack}>
          ← Back to {backLabel}
        </button>
        <div>
          <h2 className="detail-view__title">{title}</h2>
          <p className="detail-view__subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="detail-view__body">{children}</div>
    </main>
  )
}
