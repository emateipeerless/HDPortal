export type MainPumpType = 'diesel' | 'electric'

export interface Store {
  id: string
  location: string
  /** Each Home Depot site is diesel + jockey or electric + jockey — never both mains. */
  mainPumpType: MainPumpType
  /** FireConnect / IoT gateway device ID for the site. */
  fireconnectDeviceId: string
  /** Some sites are jockey-only monitoring (no main fire pump on this device). */
  jockeyOnly?: boolean
}

export const STORES: Store[] = [
  { id: '0464', location: 'Phoenix AZ', mainPumpType: 'diesel', fireconnectDeviceId: '18859' },
  {
    id: '0489',
    location: 'Tempe AZ',
    mainPumpType: 'diesel',
    fireconnectDeviceId: '19232',
    jockeyOnly: true,
  },
  { id: '6669', location: 'Sacramento CA', mainPumpType: 'diesel', fireconnectDeviceId: '18968' },
  {
    id: '6688',
    location: 'Roseville CA',
    mainPumpType: 'diesel',
    fireconnectDeviceId: '19073',
    jockeyOnly: true,
  },
  { id: '6946', location: 'Tulare CA', mainPumpType: 'diesel', fireconnectDeviceId: '19162' },
  { id: '0289', location: 'Pinellas Park FL', mainPumpType: 'diesel', fireconnectDeviceId: '18972' },
  { id: '0281', location: 'Spring Hill FL', mainPumpType: 'diesel', fireconnectDeviceId: '18957' },
  { id: '6986', location: 'Atlanta GA', mainPumpType: 'diesel', fireconnectDeviceId: '18932' },
  {
    id: '1701',
    location: 'Honolulu HI',
    mainPumpType: 'diesel',
    fireconnectDeviceId: '19227',
    jockeyOnly: true,
  },
  { id: '1907', location: 'Niles IL', mainPumpType: 'diesel', fireconnectDeviceId: '18771' },
  { id: '1952', location: 'Lake Zurich IL', mainPumpType: 'diesel', fireconnectDeviceId: '18940' },
  { id: '1918', location: 'Naperville IL', mainPumpType: 'diesel', fireconnectDeviceId: '18955' },
  { id: '1921', location: 'Geneva IL', mainPumpType: 'diesel', fireconnectDeviceId: '19183' },
  { id: '2605', location: 'Somerset MA', mainPumpType: 'diesel', fireconnectDeviceId: '19206' },
  { id: '2808', location: 'Plymouth MN', mainPumpType: 'diesel', fireconnectDeviceId: '19075' },
  { id: '3018', location: 'Ellisville MO', mainPumpType: 'diesel', fireconnectDeviceId: '18768' },
  { id: '3302', location: 'Henderson NV', mainPumpType: 'diesel', fireconnectDeviceId: '18967' },
  { id: '6827', location: 'Lubbock TX', mainPumpType: 'diesel', fireconnectDeviceId: '18937' },
  { id: '0561', location: 'Midland TX', mainPumpType: 'diesel', fireconnectDeviceId: '19208' },
  { id: '0925', location: 'Dover NJ', mainPumpType: 'electric', fireconnectDeviceId: '18964' },
  { id: '0957', location: 'Old Bridge NJ', mainPumpType: 'electric', fireconnectDeviceId: '19209' },
  { id: '3863', location: 'Harrison OH', mainPumpType: 'electric', fireconnectDeviceId: '18867' },
  { id: '6807', location: 'San Angelo TX', mainPumpType: 'electric', fireconnectDeviceId: '18822' },
  { id: '0524', location: 'Lewisville TX', mainPumpType: 'electric', fireconnectDeviceId: '18787' },
  { id: '6577', location: 'Weslaco TX', mainPumpType: 'electric', fireconnectDeviceId: '18942' },
  { id: '6819', location: 'Magnolia TX', mainPumpType: 'electric', fireconnectDeviceId: '18947' },
  { id: '6525', location: 'Houston TX', mainPumpType: 'electric', fireconnectDeviceId: '19066' },
  { id: '0568', location: 'Spring TX', mainPumpType: 'electric', fireconnectDeviceId: '19082' },
  { id: '4618', location: 'Winchester VA', mainPumpType: 'electric', fireconnectDeviceId: '19148' },
  { id: '0818', location: 'Pell City AL', mainPumpType: 'electric', fireconnectDeviceId: '18952' },
  { id: '0802', location: 'Foley AL', mainPumpType: 'electric', fireconnectDeviceId: '18960' },
  { id: '6213', location: 'Bridgeport CT', mainPumpType: 'electric', fireconnectDeviceId: '19203' },
  { id: '0370', location: 'Baton Rouge LA', mainPumpType: 'electric', fireconnectDeviceId: '19204' },
  { id: '4925', location: 'West Bend WI', mainPumpType: 'electric', fireconnectDeviceId: '19192' },
]

export function getPumpConfiguration(store: Store): string {
  if (store.jockeyOnly) return 'Jockey Only'
  return store.mainPumpType === 'diesel' ? 'Diesel + Jockey' : 'Electric + Jockey'
}

export function getControllerType(store: Store): string {
  if (store.jockeyOnly) return 'Jockey Pump Controller'
  return store.mainPumpType === 'diesel'
    ? 'Diesel Fire Pump Controller'
    : 'Electric Fire Pump Controller'
}

export function getDevicesOnlineLabel(store: Store): string {
  return store.jockeyOnly ? '1 of 1' : '2 of 2'
}

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
    const deviceNumeric = store.fireconnectDeviceId.replace(/\D/g, '')
    return (
      store.id.includes(normalized) ||
      storeNumeric.includes(numericQuery) ||
      store.fireconnectDeviceId.includes(normalized) ||
      deviceNumeric.includes(numericQuery)
    )
  })
}
