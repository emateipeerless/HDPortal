/** Diesel pump impairments that trigger red when active for more than 10 hours. */
export const DIESEL_PUMP_IMPAIRMENTS = [
  'Battery #1 Trouble',
  'Battery #2 Trouble',
  'Charger #1 Malfunction',
  'Charger #2 Malfunction',
  'Engine Failed to Start',
  'Main Switch in Off',
  'AC Power Off',
  'ECM Failure',
  'Engine Overspeed',
  'Monitoring Failure',
] as const

/** Electric pump impairments that trigger red when active for more than 10 hours. */
export const ELECTRIC_PUMP_IMPAIRMENTS = [
  'AC Power Off',
  'Fail to Start',
  'Interlock On',
  'Phase Failure',
  'Phase Reversal',
  'Transfer Switch Emergency',
  'Monitoring Failure',
] as const

export const RED_REASONS = {
  impairmentOver10Hours: 'Impairment active for more than 10 hours',
  sub50PumpRoomTemp: 'Pump room temperature below 50°F',
  excessiveRunEvents: 'Excessive run events',
} as const

export const YELLOW_REASONS = {
  excessiveJockeyPumpRuns: 'Excessive jockey pump run events',
  acPowerQualityLow: 'AC power quality low',
  recurringControllerAlarm: 'Recurring controller alarm (lower severity)',
} as const
