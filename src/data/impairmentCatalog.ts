import {
  DIESEL_PUMP_IMPAIRMENTS,
  ELECTRIC_PUMP_IMPAIRMENTS,
} from './alertCriteria'

export interface ImpairmentCatalogEntry {
  name: string
  pumpTypes: string
  escalationRule: string
}

function buildImpairmentCatalog(): ImpairmentCatalogEntry[] {
  const byName = new Map<string, Set<string>>()

  for (const name of DIESEL_PUMP_IMPAIRMENTS) {
    const types = byName.get(name) ?? new Set<string>()
    types.add('Diesel')
    byName.set(name, types)
  }

  for (const name of ELECTRIC_PUMP_IMPAIRMENTS) {
    const types = byName.get(name) ?? new Set<string>()
    types.add('Electric')
    byName.set(name, types)
  }

  return [...byName.entries()]
    .map(([name, types]) => ({
      name,
      pumpTypes: [...types].sort().join(' / '),
      escalationRule:
        'Red if active more than 10 hours; Yellow if recurring at lower severity (under 10 hours)',
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const IMPAIRMENT_CATALOG = buildImpairmentCatalog()
