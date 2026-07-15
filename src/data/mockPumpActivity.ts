export type PumpType = 'jockey' | 'fire'

export interface PumpActivityRecord {
  storeId: string
  pumpType: PumpType
  startsThisMonth: number
  percentChangeFromLastMonth: number
  monthOverMonth: number
  monthOverSixMonths: number
}

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
    storeId: '3863',
    pumpType: 'jockey',
    startsThisMonth: 118,
    percentChangeFromLastMonth: 24,
    monthOverMonth: 1.24,
    monthOverSixMonths: 1.41,
  },
  {
    storeId: '6525',
    pumpType: 'jockey',
    startsThisMonth: 156,
    percentChangeFromLastMonth: 45,
    monthOverMonth: 1.45,
    monthOverSixMonths: 1.78,
  },
  {
    storeId: '6213',
    pumpType: 'jockey',
    startsThisMonth: 97,
    percentChangeFromLastMonth: 19,
    monthOverMonth: 1.19,
    monthOverSixMonths: 1.33,
  },
  {
    storeId: '1701',
    pumpType: 'jockey',
    startsThisMonth: 131,
    percentChangeFromLastMonth: 31,
    monthOverMonth: 1.31,
    monthOverSixMonths: 1.55,
  },
  {
    storeId: '4925',
    pumpType: 'jockey',
    startsThisMonth: 108,
    percentChangeFromLastMonth: 27,
    monthOverMonth: 1.27,
    monthOverSixMonths: 1.48,
  },
]

/** Normal fire pump month is ~3–5 starts; excessive flagged sites are ~6–9. */
export const MOCK_FIRE_PUMP_ACTIVITY: PumpActivityRecord[] = [
  {
    storeId: '6525',
    pumpType: 'fire',
    startsThisMonth: 9,
    percentChangeFromLastMonth: 50,
    monthOverMonth: 1.50,
    monthOverSixMonths: 2.10,
  },
  {
    storeId: '6986',
    pumpType: 'fire',
    startsThisMonth: 8,
    percentChangeFromLastMonth: 33,
    monthOverMonth: 1.33,
    monthOverSixMonths: 1.70,
  },
  {
    storeId: '6807',
    pumpType: 'fire',
    startsThisMonth: 7,
    percentChangeFromLastMonth: 40,
    monthOverMonth: 1.40,
    monthOverSixMonths: 1.55,
  },
  {
    storeId: '6669',
    pumpType: 'fire',
    startsThisMonth: 9,
    percentChangeFromLastMonth: 50,
    monthOverMonth: 1.50,
    monthOverSixMonths: 1.95,
  },
  {
    storeId: '0568',
    pumpType: 'fire',
    startsThisMonth: 6,
    percentChangeFromLastMonth: 20,
    monthOverMonth: 1.20,
    monthOverSixMonths: 1.40,
  },
  {
    storeId: '1907',
    pumpType: 'fire',
    startsThisMonth: 8,
    percentChangeFromLastMonth: 33,
    monthOverMonth: 1.33,
    monthOverSixMonths: 1.85,
  },
  {
    storeId: '4618',
    pumpType: 'fire',
    startsThisMonth: 6,
    percentChangeFromLastMonth: 20,
    monthOverMonth: 1.20,
    monthOverSixMonths: 1.35,
  },
  {
    storeId: '3302',
    pumpType: 'fire',
    startsThisMonth: 7,
    percentChangeFromLastMonth: 40,
    monthOverMonth: 1.40,
    monthOverSixMonths: 1.75,
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
