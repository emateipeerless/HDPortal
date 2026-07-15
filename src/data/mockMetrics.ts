import {
  getAlertCountBySeverity,
  getNoActionRequiredCount,
} from './mockAlerts'
import { getActiveImpairmentCount } from './mockImpairments'
import { getPredictiveStatisticCount } from './mockPredictiveStats'
import { getPumpActivityCount } from './mockPumpActivity'
import { MOCK_RESOLUTION_TREND } from './mockResolutionTime'

/** Placeholder counts until criteria and data ingestion are defined. */
export const mockMetrics = {
  immediateAttention: getAlertCountBySeverity('red'),
  monitorClosely: getAlertCountBySeverity('yellow'),
  noActionRequired: getNoActionRequiredCount(),
  impairments: getActiveImpairmentCount(),
  predictiveStatistics: getPredictiveStatisticCount(),
  jockeyPumpActivity: getPumpActivityCount('jockey'),
  firePumpActivity: getPumpActivityCount('fire'),
  averageResolutionTime: MOCK_RESOLUTION_TREND.currentDisplay,
  overallPortfolioGrade: {
    grade: 'B+',
    percentage: 87,
  },
}
