export interface TroubleAlert {
  alert: string
  remedy: string
}

/** Diesel impairments that classify a site as RED when active (typically > 10 hours). */
export const RED_DIESEL_IMPAIRMENTS: TroubleAlert[] = [
  { alert: 'Battery #1 Trouble', remedy: 'Battery #1 Trouble - Cleared' },
  { alert: 'Battery #2 Trouble', remedy: 'Battery #2 Trouble - Cleared' },
  { alert: 'Charger #1 Malfunction', remedy: 'Charger #1 Malfunction - Cleared' },
  { alert: 'Charger #2 Malfunction', remedy: 'Charger #2 Malfunction - Cleared' },
  { alert: 'Engine Failed to Start', remedy: 'Engine Failed to Start - Cleared' },
  { alert: 'Main Switch in Manual', remedy: 'Main Switch in Auto' },
  { alert: 'Main Switch in Off', remedy: 'Main Switch in Auto' },
]

/** Electric impairments that classify a site as RED when active (typically > 10 hours). */
export const RED_ELECTRIC_IMPAIRMENTS: TroubleAlert[] = [
  { alert: 'Fail to Start', remedy: 'Fail to Start - Cleared' },
  { alert: 'Interlock On', remedy: 'Interlock On - Cleared' },
  { alert: 'Phase Failure', remedy: 'Phase Failure - Cleared' },
  { alert: 'Phase Reversal', remedy: 'Phase Reversal - Cleared' },
  { alert: 'Transfer Switch Emergency', remedy: 'Transfer Switch Emergency - Cleared' },
]

/** Diesel trouble alerts that classify a site as YELLOW (Monitor Closely). */
export const YELLOW_DIESEL_IMPAIRMENTS: TroubleAlert[] = [
  { alert: 'AC Power Off', remedy: 'AC Power On' },
  { alert: 'Automatic Shutdown is Enabled', remedy: 'Automatic Shutdown is Disabled' },
  { alert: 'Charger #1 AC Voltage', remedy: 'Charger #1 AC Voltage - Cleared' },
  { alert: 'Charger #2 AC Voltage', remedy: 'Charger #2 AC Voltage - Cleared' },
  { alert: 'Common Trouble Alarm', remedy: 'Common Trouble Alarm - Cleared' },
  { alert: 'ECM Failure', remedy: 'ECM Failure - Cleared' },
  { alert: 'ECM Warning', remedy: 'ECM Warning - Cleared' },
  { alert: 'Engine Alternate ECM', remedy: 'Engine Alternate ECM - Cleared' },
  { alert: 'Engine Coolant Temp High', remedy: 'Engine Coolant Temp High - Cleared' },
  { alert: 'Engine Fuel Injector Malfunction', remedy: 'Engine Fuel Injector Malfunction - Cleared' },
  { alert: 'Engine Oil Pressure Low', remedy: 'Engine Oil Pressure Low - Cleared' },
  { alert: 'Engine Overspeed', remedy: 'Engine Overspeed - Cleared' },
  { alert: 'Engine Run', remedy: 'Engine Stopped' },
  { alert: 'Fuel Tank Spill/Leak Sensor', remedy: 'Fuel Tank Spill/Leak Sensor - Cleared' },
  { alert: 'High Fuel Tank Level', remedy: 'High Fuel Tank Level - Cleared' },
  { alert: 'High Raw Water Temp.', remedy: 'High Raw Water Temp. - Cleared' },
  { alert: 'High Reservoir Level', remedy: 'High Reservoir Level - Cleared' },
  { alert: 'Low Engine Temp', remedy: 'Low Engine Temp - Cleared' },
  { alert: 'Low Pump Room Temp', remedy: 'Low Pump Room Temp - Cleared' },
  { alert: 'Low Raw Water Flow', remedy: 'Low Raw Water Flow - Cleared' },
  { alert: 'Low Reservoir Level', remedy: 'Low Reservoir Level - Cleared' },
  { alert: 'Low Suction Pressure', remedy: 'Low Suction Pressure - Cleared' },
  { alert: 'Relief Valve Open', remedy: 'Relief Valve Closed' },
  { alert: 'System Discharge Pressure Low', remedy: 'System Discharge Pressure Low - Cleared' },
  { alert: 'Monitored Suction Pressure is Low', remedy: 'Monitored Suction Pressure Low - Cleared' },
  { alert: 'Monitored Pump Room Temp Is Low', remedy: 'Monitored Pump Room Temp Low - Cleared' },
]

/** Electric trouble alerts that classify a site as YELLOW (Monitor Closely). */
export const YELLOW_ELECTRIC_IMPAIRMENTS: TroubleAlert[] = [
  { alert: 'Automatic Shutdown is Enabled', remedy: 'Automatic Shutdown is Disabled' },
  { alert: 'Common Trouble Alarm', remedy: 'Common Trouble Alarm - Cleared' },
  { alert: 'Deluge Valve Open', remedy: 'Deluge Valve Open - Cleared' },
  { alert: 'Emergency Isolating Switch Off', remedy: 'Emergency Isolating Switch Off - Cleared' },
  { alert: 'Low Pump Room Temp', remedy: 'Low Pump Room Temp - Cleared' },
  { alert: 'Low Suction Pressure', remedy: 'Low Suction Pressure - Cleared' },
  { alert: 'Low System Pressure', remedy: 'Low System Pressure - Cleared' },
  { alert: 'Motor Overload', remedy: 'Motor Overload - Cleared' },
  { alert: 'Over Frequency', remedy: 'Over Frequency - Cleared' },
  { alert: 'Over Voltage', remedy: 'Over Voltage - Cleared' },
  { alert: 'Pressure Transmitter Failure', remedy: 'Pressure Transmitter Failure - Cleared' },
  { alert: 'Under Frequency', remedy: 'Under Frequency - Cleared' },
  { alert: 'Under Voltage', remedy: 'Under Voltage - Cleared' },
  { alert: 'Monitored Suction Pressure is Low', remedy: 'Monitored Suction Pressure Low - Cleared' },
  { alert: 'Monitored Pump Room Temp Is Low', remedy: 'Monitored Pump Room Temp Low - Cleared' },
]

/** Jockey pump trouble alerts that classify a site as YELLOW (Monitor Closely). */
export const YELLOW_JOCKEY_IMPAIRMENTS: TroubleAlert[] = [
  { alert: 'Jockey Common Trouble', remedy: 'Jockey Common Trouble - Cleared' },
  { alert: 'Jockey Power Not Available', remedy: 'Jockey Power Available' },
  { alert: 'Jockey Failed to Start', remedy: 'Jockey Failed to Start - Cleared' },
  { alert: 'Jockey Switch in Manual', remedy: 'Jockey Switch in Auto' },
  { alert: 'Jockey Switch is Off', remedy: 'Jockey Switch in Auto' },
  { alert: 'Excessive Jockey Daily Starts', remedy: '' },
]

const RED_IMPAIRMENT_NAMES = new Set([
  ...RED_DIESEL_IMPAIRMENTS.map((item) => item.alert),
  ...RED_ELECTRIC_IMPAIRMENTS.map((item) => item.alert),
])

const YELLOW_IMPAIRMENT_NAMES = new Set([
  ...YELLOW_DIESEL_IMPAIRMENTS.map((item) => item.alert),
  ...YELLOW_ELECTRIC_IMPAIRMENTS.map((item) => item.alert),
  ...YELLOW_JOCKEY_IMPAIRMENTS.map((item) => item.alert),
])

export type ImpairmentSeverityDrive = 'red' | 'yellow'

/** Which status list an active impairment belongs to (red wins if ever on both). */
export function getImpairmentSeverityDrive(name: string): ImpairmentSeverityDrive | null {
  if (RED_IMPAIRMENT_NAMES.has(name)) return 'red'
  if (YELLOW_IMPAIRMENT_NAMES.has(name)) return 'yellow'
  return null
}

export function getImpairmentDriveLabel(name: string): string {
  const drive = getImpairmentSeverityDrive(name)
  if (drive === 'red') return 'Red site'
  if (drive === 'yellow') return 'Yellow site'
  return 'Unclassified'
}

/** @deprecated Prefer RED_DIESEL_IMPAIRMENTS — kept for any older imports. */
export const DIESEL_PUMP_IMPAIRMENTS = RED_DIESEL_IMPAIRMENTS.map((item) => item.alert)

/** @deprecated Prefer RED_ELECTRIC_IMPAIRMENTS — kept for any older imports. */
export const ELECTRIC_PUMP_IMPAIRMENTS = RED_ELECTRIC_IMPAIRMENTS.map((item) => item.alert)

export const RED_REASONS = {
  impairmentOver10Hours: 'Impairment active for more than 10 hours',
  sub50PumpRoomTemp: 'Pump room temperature below 50°F',
  excessiveRunEvents: 'Excessive run events',
} as const

export const YELLOW_REASONS = {
  dieselTroubleAlert: 'Diesel yellow trouble alert',
  electricTroubleAlert: 'Electric yellow trouble alert',
  jockeyTroubleAlert: 'Jockey yellow trouble alert',
  excessiveJockeyPumpRuns: 'Excessive jockey pump run events',
  acPowerQualityLow: 'AC power quality low',
} as const

export interface StatusTriggerImpairmentGroup {
  pumpType: 'Diesel' | 'Electric' | 'Jockey'
  alarms: readonly TroubleAlert[]
}

export interface StatusTrigger {
  title: string
  description: string
  impairmentGroups?: StatusTriggerImpairmentGroup[]
}

/** A site is RED (Immediate Attention Required) if any trigger below is true. */
export const RED_STATUS_TRIGGERS: StatusTrigger[] = [
  {
    title: RED_REASONS.impairmentOver10Hours,
    description:
      'Any of the following diesel or electric fire pump trouble alerts has been active continuously for more than 10 hours. Remedy shows the cleared / restored event that ends the condition.',
    impairmentGroups: [
      { pumpType: 'Diesel', alarms: RED_DIESEL_IMPAIRMENTS },
      { pumpType: 'Electric', alarms: RED_ELECTRIC_IMPAIRMENTS },
    ],
  },
  {
    title: RED_REASONS.sub50PumpRoomTemp,
    description:
      'Pump room temperature from the site temperature sensor reads below 50°F, indicating a freezing risk or heating failure in the pump room. This is separate from Low Pump Room Temp controller alerts (those classify as yellow).',
  },
  {
    title: RED_REASONS.excessiveRunEvents,
    description:
      'Main fire pump run activity is excessive for the current month. Normal is about 3–5 starts per month; sites in this group typically exceed that band (for example 6 or more starts) and require immediate review.',
  },
]

/** A site is YELLOW (Monitor Closely) if not RED and any trigger below is true. */
export const YELLOW_STATUS_TRIGGERS: StatusTrigger[] = [
  {
    title: YELLOW_REASONS.dieselTroubleAlert,
    description:
      'Any of the following diesel fire pump trouble alerts is active (or recurring at lower severity). Remedy shows the cleared / restored event that ends the condition.',
    impairmentGroups: [{ pumpType: 'Diesel', alarms: YELLOW_DIESEL_IMPAIRMENTS }],
  },
  {
    title: YELLOW_REASONS.electricTroubleAlert,
    description:
      'Any of the following electric fire pump trouble alerts is active (or recurring at lower severity). Remedy shows the cleared / restored event that ends the condition.',
    impairmentGroups: [{ pumpType: 'Electric', alarms: YELLOW_ELECTRIC_IMPAIRMENTS }],
  },
  {
    title: YELLOW_REASONS.jockeyTroubleAlert,
    description:
      'Any of the following jockey pump trouble alerts is active (or recurring at lower severity). Remedy shows the cleared / restored event that ends the condition.',
    impairmentGroups: [{ pumpType: 'Jockey', alarms: YELLOW_JOCKEY_IMPAIRMENTS }],
  },
  {
    title: YELLOW_REASONS.excessiveJockeyPumpRuns,
    description:
      'Jockey pump start count or run frequency is elevated versus site baseline or prior period (for example high month-over-month increase), including activity patterns beyond the Excessive Jockey Daily Starts alert.',
  },
  {
    title: YELLOW_REASONS.acPowerQualityLow,
    description:
      'AC supply to the fire pump controller shows degraded power quality—such as voltage sag, phase imbalance, or frequency deviation—below acceptable limits. Distinct from the AC Power Off diesel trouble alert.',
  },
]
