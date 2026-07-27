/**
 * Active impairments aligned to current red/yellow catalog names
 * and to MOCK_SITE_ALERTS trouble sites.
 */
export interface ActiveImpairment {
  storeId: string
  impairment: string
  activeSince: string
}

export const MOCK_ACTIVE_IMPAIRMENTS: ActiveImpairment[] = [
  // Red impairments
  {
    storeId: '0464',
    impairment: 'Engine Failed to Start',
    activeSince: '2026-07-07T22:15:00',
  },
  {
    storeId: '6807',
    impairment: 'Phase Failure',
    activeSince: '2026-07-08T01:00:00',
  },
  {
    storeId: '3302',
    impairment: 'Main Switch in Off',
    activeSince: '2026-07-07T18:20:00',
  },
  // Yellow diesel
  {
    storeId: '6669',
    impairment: 'AC Power Off',
    activeSince: '2026-07-08T02:10:00',
  },
  {
    storeId: '1907',
    impairment: 'Engine Oil Pressure Low',
    activeSince: '2026-07-08T07:55:00',
  },
  {
    storeId: '6827',
    impairment: 'Low Pump Room Temp',
    activeSince: '2026-07-08T10:40:00',
  },
  // Yellow electric
  {
    storeId: '4618',
    impairment: 'Under Voltage',
    activeSince: '2026-07-08T09:30:00',
  },
  {
    storeId: '3863',
    impairment: 'Motor Overload',
    activeSince: '2026-07-08T11:15:00',
  },
  {
    storeId: '0568',
    impairment: 'Pressure Transmitter Failure',
    activeSince: '2026-07-08T05:00:00',
  },
  // Yellow jockey
  {
    storeId: '0489',
    impairment: 'Excessive Jockey Daily Starts',
    activeSince: '2026-07-07T18:45:00',
  },
  {
    storeId: '6213',
    impairment: 'Jockey Switch is Off',
    activeSince: '2026-07-08T03:30:00',
  },
]

export function getActiveImpairmentCount(): number {
  return MOCK_ACTIVE_IMPAIRMENTS.length
}
