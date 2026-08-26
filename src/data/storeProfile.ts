import { MOCK_SITE_ALERTS, type AlertSeverity, type SiteAlert } from './mockAlerts'
import { MOCK_ACTIVE_IMPAIRMENTS } from './mockImpairments'
import { MOCK_PREDICTIVE_STATISTICS } from './mockPredictiveStats'
import {
  MOCK_FIRE_PUMP_ACTIVITY,
  MOCK_JOCKEY_PUMP_ACTIVITY,
} from './mockPumpActivity'
import { getControllerType, getDevicesOnlineLabel, getPumpConfiguration, getStoreById } from './stores'

export type StoreStatus = 'red' | 'yellow' | 'green'

export type FlagCategory =
  | 'status-alert'
  | 'impairment'
  | 'predictive'
  | 'jockey-pump'
  | 'fire-pump'

export interface StoreFlagEvent {
  date: string
  category: FlagCategory
  title: string
  detail: string
  severity?: AlertSeverity
  active: boolean
}

export interface StoreStatusHistoryEntry {
  severity: AlertSeverity
  reason: string
  startedAt: string
  endedAt?: string
}

export interface StoreOverallInfo {
  fireconnectDeviceId: string
  pumpConfiguration: string
  controllerType: string
  connectivityStatus: string
  pumpRoomTemp: string
  lastInspection: string
  siteGrade: string
  devicesOnline: string
}

export interface StoreProfile {
  storeId: string
  location: string
  currentStatus: StoreStatus
  currentAlert?: SiteAlert
  overallInfo: StoreOverallInfo
  activeFlags: StoreFlagEvent[]
  flagHistory: StoreFlagEvent[]
  statusHistory: StoreStatusHistoryEntry[]
}

const MOCK_STATUS_HISTORY: Record<string, StoreStatusHistoryEntry[]> = {
  '0464': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-06-12T09:00:00',
      endedAt: '2026-06-14T16:30:00',
    },
    {
      severity: 'red',
      reason: 'Impairment active for more than 10 hours',
      startedAt: '2026-07-07T22:15:00',
    },
  ],
  '6807': [
    {
      severity: 'red',
      reason: 'Impairment active for more than 10 hours',
      startedAt: '2026-07-08T01:00:00',
    },
  ],
  '3302': [
    {
      severity: 'red',
      reason: 'Impairment active for more than 10 hours',
      startedAt: '2026-07-07T18:20:00',
    },
  ],
  '0489': [
    {
      severity: 'yellow',
      reason: 'Jockey yellow trouble alert',
      startedAt: '2026-07-07T18:45:00',
    },
  ],
  '6525': [
    {
      severity: 'red',
      reason: 'Excessive run events',
      startedAt: '2026-07-08T08:00:00',
    },
    {
      severity: 'red',
      reason: 'Excessive run events',
      startedAt: '2026-04-18T14:20:00',
      endedAt: '2026-04-20T09:00:00',
    },
  ],
  '6986': [
    {
      severity: 'red',
      reason: 'Pump room temperature below 50°F',
      startedAt: '2026-07-08T04:30:00',
    },
  ],
  '1907': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-07-08T07:55:00',
    },
  ],
  '6669': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-07-08T02:10:00',
    },
  ],
  '6827': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-07-08T10:40:00',
    },
  ],
  '4618': [
    {
      severity: 'yellow',
      reason: 'Electric yellow trouble alert',
      startedAt: '2026-07-08T09:30:00',
    },
  ],
  '3863': [
    {
      severity: 'yellow',
      reason: 'Electric yellow trouble alert',
      startedAt: '2026-07-08T11:15:00',
    },
  ],
  '0568': [
    {
      severity: 'yellow',
      reason: 'Electric yellow trouble alert',
      startedAt: '2026-07-08T05:00:00',
    },
  ],
  '6213': [
    {
      severity: 'yellow',
      reason: 'Jockey yellow trouble alert',
      startedAt: '2026-07-08T03:30:00',
    },
  ],
}

const DEFAULT_OVERALL_INFO: StoreOverallInfo = {
  fireconnectDeviceId: '—',
  pumpConfiguration: 'Diesel + Jockey',
  controllerType: 'Diesel Fire Pump Controller',
  connectivityStatus: 'Online',
  pumpRoomTemp: '68°F',
  lastInspection: '2026-05-12',
  siteGrade: 'A',
  devicesOnline: '2 of 2',
}

const STORE_INFO_OVERRIDES: Record<string, Partial<StoreOverallInfo>> = {
  '0464': { pumpRoomTemp: '74°F', siteGrade: 'C', lastInspection: '2026-04-28' },
  '6525': { pumpRoomTemp: '71°F', siteGrade: 'D', lastInspection: '2026-03-15' },
  '6986': { pumpRoomTemp: '46°F', siteGrade: 'D', connectivityStatus: 'Online' },
  '6807': { pumpRoomTemp: '70°F', siteGrade: 'D' },
  '3302': { pumpRoomTemp: '72°F', siteGrade: 'D' },
  '0489': { pumpRoomTemp: '69°F', siteGrade: 'B-' },
  '6669': { pumpRoomTemp: '67°F', siteGrade: 'B' },
  '1907': { pumpRoomTemp: '70°F', siteGrade: 'B-' },
  '6827': { pumpRoomTemp: '52°F', siteGrade: 'B-' },
  '4618': { pumpRoomTemp: '68°F', siteGrade: 'B-' },
  '3863': { pumpRoomTemp: '69°F', siteGrade: 'B-' },
  '0568': { pumpRoomTemp: '71°F', siteGrade: 'B-' },
  '6213': { pumpRoomTemp: '67°F', siteGrade: 'B-' },
}

export function getStoreStatus(storeId: string): StoreStatus {
  const alert = MOCK_SITE_ALERTS.find((item) => item.storeId === storeId)
  if (!alert) return 'green'
  return alert.severity
}

export function getStoreProfile(storeId: string): StoreProfile | undefined {
  const store = getStoreById(storeId)
  if (!store) return undefined

  const currentAlert = MOCK_SITE_ALERTS.find((item) => item.storeId === storeId)
  const currentStatus = currentAlert ? currentAlert.severity : 'green'
  const flagEvents = buildFlagEvents(storeId, currentAlert)
  const activeFlags = flagEvents.filter((event) => event.active)
  const statusHistory = buildStatusHistory(storeId, currentAlert)

  return {
    storeId: store.id,
    location: store.location,
    currentStatus,
    currentAlert,
    overallInfo: {
      ...DEFAULT_OVERALL_INFO,
      fireconnectDeviceId: store.fireconnectDeviceId,
      pumpConfiguration: getPumpConfiguration(store),
      controllerType: getControllerType(store),
      devicesOnline: getDevicesOnlineLabel(store),
      ...STORE_INFO_OVERRIDES[storeId],
      siteGrade: currentStatus === 'red' ? 'D' : currentStatus === 'yellow' ? 'B-' : (STORE_INFO_OVERRIDES[storeId]?.siteGrade ?? DEFAULT_OVERALL_INFO.siteGrade),
    },
    activeFlags,
    flagHistory: flagEvents.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
    statusHistory,
  }
}

function buildFlagEvents(storeId: string, currentAlert?: SiteAlert): StoreFlagEvent[] {
  const events: StoreFlagEvent[] = []

  if (currentAlert) {
    events.push({
      date: currentAlert.flaggedSince,
      category: 'status-alert',
      title: currentAlert.reason,
      detail: currentAlert.currentCondition,
      severity: currentAlert.severity,
      active: true,
    })
  }

  for (const item of MOCK_ACTIVE_IMPAIRMENTS.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: item.activeSince,
      category: 'impairment',
      title: item.impairment,
      detail: 'Active impairment on site controller',
      severity: currentAlert?.severity ?? 'yellow',
      active: true,
    })
  }

  for (const item of MOCK_PREDICTIVE_STATISTICS.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: '2026-07-08T00:00:00',
      category: 'predictive',
      title: item.statistic,
      detail: item.prediction,
      active: true,
    })
  }

  for (const item of MOCK_JOCKEY_PUMP_ACTIVITY.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: '2026-07-01T00:00:00',
      category: 'jockey-pump',
      title: 'Excessive jockey pump activity',
      detail: `${item.startsThisMonth} starts this month (+${item.percentChangeFromLastMonth}% vs last month)`,
      severity: 'yellow',
      active: true,
    })
  }

  for (const item of MOCK_FIRE_PUMP_ACTIVITY.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: '2026-07-01T00:00:00',
      category: 'fire-pump',
      title: 'Excessive fire pump activity',
      detail: `${item.startsThisMonth} starts this month (+${item.percentChangeFromLastMonth}% vs last month)`,
      severity: currentAlert?.severity === 'red' ? 'red' : 'yellow',
      active: true,
    })
  }

  const resolvedHistory = MOCK_RESOLVED_FLAG_HISTORY[storeId] ?? []
  events.push(...resolvedHistory)

  return events
}

function buildStatusHistory(
  storeId: string,
  currentAlert?: SiteAlert,
): StoreStatusHistoryEntry[] {
  const history = [...(MOCK_STATUS_HISTORY[storeId] ?? [])]

  if (currentAlert && !history.some((entry) => !entry.endedAt && entry.startedAt === currentAlert.flaggedSince)) {
    history.unshift({
      severity: currentAlert.severity,
      reason: currentAlert.reason,
      startedAt: currentAlert.flaggedSince,
    })
  }

  return history.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )
}

const MOCK_RESOLVED_FLAG_HISTORY: Record<string, StoreFlagEvent[]> = {
  '0464': [
    {
      date: '2026-06-14T16:30:00',
      category: 'status-alert',
      title: 'Diesel yellow trouble alert',
      detail: 'Common Trouble Alarm — Cleared after 2 days',
      severity: 'yellow',
      active: false,
    },
  ],
  '0489': [
    {
      date: '2026-05-24T08:15:00',
      category: 'status-alert',
      title: 'Jockey yellow trouble alert',
      detail: 'Jockey Switch in Manual — restored to Auto',
      severity: 'yellow',
      active: false,
    },
  ],
  '6525': [
    {
      date: '2026-04-20T09:00:00',
      category: 'status-alert',
      title: 'Excessive run events',
      detail: 'Main fire pump starts returned to normal band (3–5)',
      severity: 'red',
      active: false,
    },
  ],
  '1907': [
    {
      date: '2026-06-03T12:00:00',
      category: 'status-alert',
      title: 'Diesel yellow trouble alert',
      detail: 'Low Suction Pressure — Cleared',
      severity: 'yellow',
      active: false,
    },
  ],
  '6807': [
    {
      date: '2026-05-10T14:00:00',
      category: 'status-alert',
      title: 'Electric yellow trouble alert',
      detail: 'Over Voltage — Cleared',
      severity: 'yellow',
      active: false,
    },
  ],
}

export function getStatusLabel(status: StoreStatus): string {
  if (status === 'red') return 'Immediate Attention Required'
  if (status === 'yellow') return 'Monitor Closely'
  return 'No Action Required'
}

export function getCategoryLabel(category: FlagCategory): string {
  const labels: Record<FlagCategory, string> = {
    'status-alert': 'Status Alert',
    impairment: 'Impairment',
    predictive: 'Predictive Statistic',
    'jockey-pump': 'Jockey Pump',
    'fire-pump': 'Fire Pump',
  }
  return labels[category]
}
