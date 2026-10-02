import { STORES } from './stores'
import { getStoreProfile } from './storeProfile'

export interface HealthTrendPoint {
  label: string
  red: number
  yellow: number
  green: number
}

/**
 * Weekly stacked totals that grow into the live red / yellow / green counts.
 * Earlier weeks are a scaled history so the chart shows both mix and portfolio growth.
 */
export function buildSiteHealthTrend(red: number, yellow: number, green: number): HealthTrendPoint[] {
  const current = Math.max(0, red) + Math.max(0, yellow) + Math.max(0, green)
  const fractions = [0.55, 0.62, 0.68, 0.74, 0.82, 0.88, 0.94, 1]
  const labels = ['Jun 3', 'Jun 10', 'Jun 17', 'Jun 24', 'Jul 1', 'Jul 8', 'Jul 15', 'Jul 22']

  return fractions.map((fraction, index) => {
    if (index === fractions.length - 1 || current === 0) {
      return { label: labels[index], red, yellow, green }
    }

    const total = Math.max(1, Math.round(current * fraction))
    const nextRed = Math.min(total, Math.round(Math.max(0, red) * fraction))
    const nextYellow = Math.min(total - nextRed, Math.round(Math.max(0, yellow) * fraction))
    const nextGreen = Math.max(0, total - nextRed - nextYellow)
    return { label: labels[index], red: nextRed, yellow: nextYellow, green: nextGreen }
  })
}

export function getConnectivityCounts(): { online: number; offline: number } {
  let online = 0
  let offline = 0
  for (const store of STORES) {
    const status = getStoreProfile(store.id)?.overallInfo.connectivityStatus
    if (status === 'Offline') offline += 1
    else online += 1
  }
  return { online, offline }
}

/** Mock ITM rule until inspection results are stored: A, B, and B+ count as compliant. */
export function isItmCompliant(grade: string): boolean {
  if (grade.startsWith('A')) return true
  return grade === 'B' || grade === 'B+'
}

export function getItmCounts(): { compliant: number; nonCompliant: number } {
  let compliant = 0
  let nonCompliant = 0
  for (const store of STORES) {
    const grade = getStoreProfile(store.id)?.overallInfo.siteGrade ?? 'A'
    if (isItmCompliant(grade)) compliant += 1
    else nonCompliant += 1
  }
  return { compliant, nonCompliant }
}
