export interface PredictiveStatistic {
  storeId: string
  statistic: string
  prediction: string
}

export const MOCK_PREDICTIVE_STATISTICS: PredictiveStatistic[] = [
  {
    storeId: '6669',
    statistic: 'Jockey pump cycle frequency +22%',
    prediction: 'Potential seal wear within 30 days',
  },
  {
    storeId: '6827',
    statistic: 'Fire pump start duration trending up',
    prediction: 'Diesel engine maintenance likely needed within 45 days',
  },
  {
    storeId: '3018',
    statistic: 'Pump room temperature trending below 55°F',
    prediction: 'Risk of freezing / low-temp alarm within 14 days',
  },
  {
    storeId: '0561',
    statistic: 'Battery voltage decline over 14 days',
    prediction: 'Battery replacement recommended within 60 days',
  },
]

export function getPredictiveStatisticCount(): number {
  return MOCK_PREDICTIVE_STATISTICS.length
}
