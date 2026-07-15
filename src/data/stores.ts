export interface Store {
  id: string
  location: string
}

export const STORES: Store[] = [
  { id: '0464', location: 'Phoenix AZ' },
  { id: '0489', location: 'Tempe AZ' },
  { id: '6669', location: 'Sacramento CA' },
  { id: '6688', location: 'Roseville CA' },
  { id: '6946', location: 'Tulare CA' },
  { id: '0289', location: 'Pinellas Park FL' },
  { id: '0281', location: 'Spring Hill FL' },
  { id: '6986', location: 'Atlanta GA' },
  { id: '1701', location: 'Honolulu HI' },
  { id: '1907', location: 'Niles IL' },
  { id: '1952', location: 'Lake Zurich IL' },
  { id: '1918', location: 'Naperville IL' },
  { id: '1921', location: 'Geneva IL' },
  { id: '2605', location: 'Somerset MA' },
  { id: '2808', location: 'Plymouth MN' },
  { id: '3018', location: 'Ellisville MO' },
  { id: '3302', location: 'Henderson NV' },
  { id: '0925', location: 'New Jersey NJ' },
  { id: '0957', location: 'Old Bridge NJ' },
  { id: '3863', location: 'Harrison OH' },
  { id: '6807', location: 'San Angelo TX' },
  { id: '0524', location: 'Lewisville TX' },
  { id: '6827', location: 'Lubbock TX' },
  { id: '6577', location: 'Weslaco TX' },
  { id: '6819', location: 'Magnolia TX' },
  { id: '6525', location: 'Houston TX' },
  { id: '0568', location: 'Spring TX' },
  { id: '0561', location: 'Midland TX' },
  { id: '4618', location: 'Winchester VA' },
  { id: '0818', location: 'Pell City AL' },
  { id: '0802', location: 'Foley AL' },
  { id: '6213', location: 'Bridgeport CT' },
  { id: '0370', location: 'Baton Rouge LA' },
  { id: '4925', location: 'West Bend WI' },
]

export function getStoreLabel(store: Store): string {
  return `${store.id} ${store.location}`
}

export function getStoreById(storeId: string): Store | undefined {
  return STORES.find((store) => store.id === storeId)
}

export function searchStoresByNumber(query: string): Store[] {
  const normalized = query.trim()
  if (!normalized) return []

  const numericQuery = normalized.replace(/\D/g, '')
  if (!numericQuery) return []

  return STORES.filter((store) => {
    const storeNumeric = store.id.replace(/\D/g, '')
    return store.id.includes(normalized) || storeNumeric.includes(numericQuery)
  })
}
