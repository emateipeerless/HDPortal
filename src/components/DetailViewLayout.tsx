import type { ReactNode } from 'react'

interface DetailViewLayoutProps {
  title: string
  subtitle: string
  accentClass?: string
  onBack: () => void
  children: ReactNode
}

export function DetailViewLayout({
  title,
  subtitle,
  accentClass = '',
  onBack,
  children,
}: DetailViewLayoutProps) {
  return (
    <main className={`detail-view ${accentClass}`}>
      <div className="detail-view__header">
        <button type="button" className="detail-view__back" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div>
          <h2 className="detail-view__title">{title}</h2>
          <p className="detail-view__subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="detail-view__table-wrap">{children}</div>
    </main>
  )
}
