export interface PredictiveStatCatalogEntry {
  statistic: string
  dataFeed: string
  typicalPrediction: string
}

/** All predictive statistics the portal can surface and their telemetry / sensor sources. */
export const PREDICTIVE_STATISTICS_CATALOG: PredictiveStatCatalogEntry[] = [
  {
    statistic: 'Jockey pump cycle frequency change',
    dataFeed:
      'Pump run events (jockey) — start count and cycle rate over trailing 7–30 days vs prior period',
    typicalPrediction: 'Potential seal wear or pressure maintenance issue within 30 days',
  },
  {
    statistic: 'Fire pump start duration trending up',
    dataFeed:
      'Pump run events (main fire pump) — average run duration per start over trailing 14–30 days',
    typicalPrediction: 'Diesel engine or electric driver maintenance likely within 45 days',
  },
  {
    statistic: 'Fire pump monthly starts above normal band',
    dataFeed:
      'Pump run events (main fire pump) — starts in current calendar month vs normal 3–5 starts',
    typicalPrediction: 'Investigate excessive demand or false starts before red threshold (6+)',
  },
  {
    statistic: 'Pump room temperature trending low',
    dataFeed:
      'Pump room temperature sensor (register / telemetry history) — trend toward sub-55°F or sub-50°F',
    typicalPrediction: 'Risk of low-temp or freezing alarm within 14 days',
  },
  {
    statistic: 'Pump room temperature trending high',
    dataFeed:
      'Pump room temperature sensor — sustained elevation above site baseline over trailing 7–14 days',
    typicalPrediction: 'Controller or battery heat-related fault risk within 30 days',
  },
  {
    statistic: 'Battery voltage decline',
    dataFeed:
      'Battery voltage register — slope over trailing 14 days (diesel controller batteries)',
    typicalPrediction: 'Battery replacement recommended within 60 days',
  },
  {
    statistic: 'AC power quality degradation',
    dataFeed:
      'AC power telemetry — voltage sag, phase imbalance, or frequency deviation vs nominal',
    typicalPrediction: 'Yellow AC power quality condition or transfer-switch stress within 7 days',
  },
  {
    statistic: 'Impaired alarm recurrence rate',
    dataFeed:
      'Controller alarm events — count of same alarm name reopening within 30 days (duration under 10h)',
    typicalPrediction: 'Recurring controller alarm (lower severity) — monitor closely',
  },
  {
    statistic: 'Diesel engine run hours acceleration',
    dataFeed:
      '"Pump Total Run Time" register + period run events — month-over-month increase on diesel main',
    typicalPrediction: 'Unplanned load or test compliance drift — review run schedule',
  },
  {
    statistic: 'Monitoring / communication gaps',
    dataFeed:
      'Device connectivity and Monitoring Failure alarm history — offline intervals and missed polls',
    typicalPrediction: 'Site may miss red/yellow detection until connectivity restored',
  },
]
