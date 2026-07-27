import {
  RED_DIESEL_IMPAIRMENTS,
  RED_ELECTRIC_IMPAIRMENTS,
  YELLOW_DIESEL_IMPAIRMENTS,
  YELLOW_ELECTRIC_IMPAIRMENTS,
  YELLOW_JOCKEY_IMPAIRMENTS,
  type TroubleAlert,
} from './alertCriteria'

export interface ImpairmentCatalogEntry {
  name: string
  remedy: string
  pumpTypes: string
  escalationRule: string
}

function addAlerts(
  byName: Map<string, { remedies: Set<string>; types: Set<string>; rules: Set<string> }>,
  alerts: readonly TroubleAlert[],
  pumpType: string,
  rule: string,
) {
  for (const item of alerts) {
    const existing = byName.get(item.alert) ?? {
      remedies: new Set<string>(),
      types: new Set<string>(),
      rules: new Set<string>(),
    }
    if (item.remedy) existing.remedies.add(item.remedy)
    existing.types.add(pumpType)
    existing.rules.add(rule)
    byName.set(item.alert, existing)
  }
}

function buildImpairmentCatalog(): ImpairmentCatalogEntry[] {
  const byName = new Map<
    string,
    { remedies: Set<string>; types: Set<string>; rules: Set<string> }
  >()

  addAlerts(byName, RED_DIESEL_IMPAIRMENTS, 'Diesel', 'Red (> 10 hours)')
  addAlerts(byName, RED_ELECTRIC_IMPAIRMENTS, 'Electric', 'Red (> 10 hours)')
  addAlerts(byName, YELLOW_DIESEL_IMPAIRMENTS, 'Diesel', 'Yellow')
  addAlerts(byName, YELLOW_ELECTRIC_IMPAIRMENTS, 'Electric', 'Yellow')
  addAlerts(byName, YELLOW_JOCKEY_IMPAIRMENTS, 'Jockey', 'Yellow')

  return [...byName.entries()]
    .map(([name, value]) => ({
      name,
      remedy: [...value.remedies].join(' / ') || '—',
      pumpTypes: [...value.types].sort().join(' / '),
      escalationRule: [...value.rules].sort().join('; '),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const IMPAIRMENT_CATALOG = buildImpairmentCatalog()
