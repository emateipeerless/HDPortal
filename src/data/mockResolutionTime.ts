/** Resolution time trend — lower is better. Values are hours. */
export const MOCK_RESOLUTION_TREND = {
  currentDisplay: '2 days 14 hours',
  currentHours: 62,
  previousMonthChangePercent: -8.4,
  sparklinePoints: [78, 74, 71, 69, 66, 64, 62],
  sparklineLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
}

export function getResolutionTrendDirection(): 'up' | 'down' {
  return MOCK_RESOLUTION_TREND.previousMonthChangePercent < 0 ? 'down' : 'up'
}

/** For resolution time, a decrease (negative %) is positive/green. */
export function isResolutionTrendPositive(): boolean {
  return MOCK_RESOLUTION_TREND.previousMonthChangePercent < 0
}
