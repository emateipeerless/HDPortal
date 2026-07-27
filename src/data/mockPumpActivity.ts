export type PumpType = 'jockey' | 'fire'

export interface PumpActivityRecord {
  storeId: string
  pumpType: PumpType
  startsThisMonth: number
  percentChangeFromLastMonth: number
  monthOverMonth: number
  monthOverSixMonths: number
}

/** Excessive / trouble jockey sites only — kept small. */
export const MOCK_JOCKEY_PUMP_ACTIVITY: PumpActivityRecord[] = [
  {
    storeId: '0489',
    pumpType: 'jockey',
    startsThisMonth: 142,
    percentChangeFromLastMonth: 38,
    monthOverMonth: 1.38,
    monthOverSixMonths: 1.62,
  },
  {
    storeId: '6213',
    pumpType: 'jockey',
    startsThisMonth: 95,
    percentChangeFromLastMonth: 18,
    monthOverMonth: 1.18,
    monthOverSixMonths: 1.32,
  },
  {
    storeId: '1701',
    pumpType: 'jockey',
    startsThisMonth: 118,
    percentChangeFromLastMonth: 24,
    monthOverMonth: 1.24,
    monthOverSixMonths: 1.41,
  },
]

/** Normal fire pump month is ~3–5 starts; excessive flagged sites are ~6–9. */
export const MOCK_FIRE_PUMP_ACTIVITY: PumpActivityRecord[] = [
  {
    storeId: '6525',
    pumpType: 'fire',
    startsThisMonth: 9,
    percentChangeFromLastMonth: 50,
    monthOverMonth: 1.5,
    monthOverSixMonths: 2.1,
  },
  {
    storeId: '6669',
    pumpType: 'fire',
    startsThisMonth: 7,
    percentChangeFromLastMonth: 40,
    monthOverMonth: 1.4,
    monthOverSixMonths: 1.75,
  },
  {
    storeId: '1907',
    pumpType: 'fire',
    startsThisMonth: 6,
    percentChangeFromLastMonth: 20,
    monthOverMonth: 1.2,
    monthOverSixMonths: 1.4,
  },
]

export function getPumpActivityCount(pumpType: PumpType): number {
  return pumpType === 'jockey'
    ? MOCK_JOCKEY_PUMP_ACTIVITY.length
    : MOCK_FIRE_PUMP_ACTIVITY.length
}

export function getPumpActivityRecords(pumpType: PumpType): PumpActivityRecord[] {
  return pumpType === 'jockey' ? MOCK_JOCKEY_PUMP_ACTIVITY : MOCK_FIRE_PUMP_ACTIVITY
}

export function formatPercentChange(value: number): string {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value}%`
}

export function formatRatio(value: number): string {
  return `${value.toFixed(2)}x`
}
