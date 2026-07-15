import { STORES } from './stores'

export type AlertSeverity = 'red' | 'yellow'

export interface SiteAlert {
  storeId: string
  severity: AlertSeverity
  reason: string
  currentCondition: string
  flaggedSince: string
}

export const MOCK_SITE_ALERTS: SiteAlert[] = [
  {
    storeId: '0464',
    severity: 'red',
    reason: 'Impairment active for more than 10 hours',
    currentCondition: 'Engine Failed to Start — active 14 hours',
    flaggedSince: '2026-07-07T22:15:00',
  },
  {
    storeId: '6986',
    severity: 'red',
    reason: 'Pump room temperature below 50°F',
    currentCondition: 'Pump room temp 46°F',
    flaggedSince: '2026-07-08T04:30:00',
  },
  {
    storeId: '6525',
    severity: 'red',
    reason: 'Excessive run events',
    currentCondition: '9 run events this month (normal: 3–5)',
    flaggedSince: '2026-07-08T08:00:00',
  },
  {
    storeId: '0489',
    severity: 'yellow',
    reason: 'Excessive jockey pump run events',
    currentCondition: '9 jockey pump runs in the last 24 hours',
    flaggedSince: '2026-07-07T18:45:00',
  },
  {
    storeId: '6669',
    severity: 'yellow',
    reason: 'AC power quality low',
    currentCondition: 'Voltage sag detected — 108V on leg A',
    flaggedSince: '2026-07-08T02:10:00',
  },
  {
    storeId: '1907',
    severity: 'yellow',
    reason: 'Recurring controller alarm (lower severity)',
    currentCondition: 'Battery #2 Trouble — active 6 hours',
    flaggedSince: '2026-07-08T07:55:00',
  },
  {
    storeId: '3863',
    severity: 'yellow',
    reason: 'Excessive jockey pump run events',
    currentCondition: '7 jockey pump runs in the last 24 hours',
    flaggedSince: '2026-07-06T11:20:00',
  },
  {
    storeId: '6827',
    severity: 'yellow',
    reason: 'AC power quality low',
    currentCondition: 'Frequency deviation — 59.2 Hz sustained',
    flaggedSince: '2026-07-07T15:40:00',
  },
  {
    storeId: '4618',
    severity: 'yellow',
    reason: 'Recurring controller alarm (lower severity)',
    currentCondition: 'Monitoring Failure — active 4 hours',
    flaggedSince: '2026-07-08T09:30:00',
  },
  {
    storeId: '6213',
    severity: 'yellow',
    reason: 'Recurring controller alarm (lower severity)',
    currentCondition: 'Interlock On — active 3 hours',
    flaggedSince: '2026-07-08T10:05:00',
  },
]

export function getAlertsBySeverity(severity: AlertSeverity): SiteAlert[] {
  return MOCK_SITE_ALERTS.filter((alert) => alert.severity === severity)
}

export function getAlertCountBySeverity(severity: AlertSeverity): number {
  return getAlertsBySeverity(severity).length
}

export function getNoActionRequiredCount(): number {
  const flaggedStoreIds = new Set(MOCK_SITE_ALERTS.map((alert) => alert.storeId))
  return STORES.length - flaggedStoreIds.size
}
