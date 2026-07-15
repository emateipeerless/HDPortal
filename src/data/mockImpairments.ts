export interface ActiveImpairment {
  storeId: string
  impairment: string
  activeSince: string
}

export const MOCK_ACTIVE_IMPAIRMENTS: ActiveImpairment[] = [
  {
    storeId: '0464',
    impairment: 'Engine Failed to Start',
    activeSince: '2026-07-07T22:15:00',
  },
  {
    storeId: '6986',
    impairment: 'AC Power Off',
    activeSince: '2026-07-08T06:40:00',
  },
  {
    storeId: '1907',
    impairment: 'Battery #2 Trouble',
    activeSince: '2026-07-08T07:55:00',
  },
  {
    storeId: '6525',
    impairment: 'Monitoring Failure',
    activeSince: '2026-07-08T03:20:00',
  },
  {
    storeId: '4618',
    impairment: 'Interlock On',
    activeSince: '2026-07-08T10:05:00',
  },
]

export function getActiveImpairmentCount(): number {
  return MOCK_ACTIVE_IMPAIRMENTS.length
}
