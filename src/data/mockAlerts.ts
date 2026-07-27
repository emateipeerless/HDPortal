import { RED_REASONS, YELLOW_REASONS } from './alertCriteria'
import { STORES } from './stores'

export type AlertSeverity = 'red' | 'yellow'

export interface SiteAlert {
  storeId: string
  severity: AlertSeverity
  reason: string
  currentCondition: string
  flaggedSince: string
}

/**
 * Portfolio status mock — moderate trouble set with diverse red/yellow causes.
 * Red: diesel impairment, electric impairment, pump room temp, excessive main runs.
 * Yellow: mix of diesel, electric, and jockey trouble alerts (not jockey-only).
 */
export const MOCK_SITE_ALERTS: SiteAlert[] = [
  // --- RED ---
  {
    storeId: '0464',
    severity: 'red',
    reason: RED_REASONS.impairmentOver10Hours,
    currentCondition: 'Engine Failed to Start — active 14 hours',
    flaggedSince: '2026-07-07T22:15:00',
  },
  {
    storeId: '6807',
    severity: 'red',
    reason: RED_REASONS.impairmentOver10Hours,
    currentCondition: 'Phase Failure — active 11 hours',
    flaggedSince: '2026-07-08T01:00:00',
  },
  {
    storeId: '3302',
    severity: 'red',
    reason: RED_REASONS.impairmentOver10Hours,
    currentCondition: 'Main Switch in Off — active 16 hours',
    flaggedSince: '2026-07-07T18:20:00',
  },
  {
    storeId: '6986',
    severity: 'red',
    reason: RED_REASONS.sub50PumpRoomTemp,
    currentCondition: 'Pump room temp 46°F',
    flaggedSince: '2026-07-08T04:30:00',
  },
  {
    storeId: '6525',
    severity: 'red',
    reason: RED_REASONS.excessiveRunEvents,
    currentCondition: '9 main fire pump starts this month (normal: 3–5)',
    flaggedSince: '2026-07-08T08:00:00',
  },
  // --- YELLOW (diesel / electric / jockey mix) ---
  {
    storeId: '6669',
    severity: 'yellow',
    reason: YELLOW_REASONS.dieselTroubleAlert,
    currentCondition: 'AC Power Off — active 5 hours',
    flaggedSince: '2026-07-08T02:10:00',
  },
  {
    storeId: '1907',
    severity: 'yellow',
    reason: YELLOW_REASONS.dieselTroubleAlert,
    currentCondition: 'Engine Oil Pressure Low — active 6 hours',
    flaggedSince: '2026-07-08T07:55:00',
  },
  {
    storeId: '6827',
    severity: 'yellow',
    reason: YELLOW_REASONS.dieselTroubleAlert,
    currentCondition: 'Low Pump Room Temp — active 3 hours',
    flaggedSince: '2026-07-08T10:40:00',
  },
  {
    storeId: '4618',
    severity: 'yellow',
    reason: YELLOW_REASONS.electricTroubleAlert,
    currentCondition: 'Under Voltage — active 4 hours',
    flaggedSince: '2026-07-08T09:30:00',
  },
  {
    storeId: '3863',
    severity: 'yellow',
    reason: YELLOW_REASONS.electricTroubleAlert,
    currentCondition: 'Motor Overload — active 2 hours',
    flaggedSince: '2026-07-08T11:15:00',
  },
  {
    storeId: '0568',
    severity: 'yellow',
    reason: YELLOW_REASONS.electricTroubleAlert,
    currentCondition: 'Pressure Transmitter Failure — active 7 hours',
    flaggedSince: '2026-07-08T05:00:00',
  },
  {
    storeId: '0489',
    severity: 'yellow',
    reason: YELLOW_REASONS.jockeyTroubleAlert,
    currentCondition: 'Excessive Jockey Daily Starts — active',
    flaggedSince: '2026-07-07T18:45:00',
  },
  {
    storeId: '6213',
    severity: 'yellow',
    reason: YELLOW_REASONS.jockeyTroubleAlert,
    currentCondition: 'Jockey Switch is Off — active 8 hours',
    flaggedSince: '2026-07-08T03:30:00',
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
