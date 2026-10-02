import usStates from '../data/us-states.json'
import type { StoreStatus } from '../data/storeProfile'

interface MapSite {
  id: string
  location: string
  status: StoreStatus
  lat: number
  lon: number
}

interface UsSiteMapProps {
  sites: MapSite[]
  onSelectStore: (storeId: string) => void
}

type Position = [number, number]
type Ring = Position[]
type Polygon = Ring[]

interface StateFeature {
  properties: { name: string }
  geometry:
    | { type: 'Polygon'; coordinates: Polygon }
    | { type: 'MultiPolygon'; coordinates: Polygon[] }
}

interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

interface Box {
  x: number
  y: number
  w: number
  h: number
}

interface Point {
  x: number
  y: number
}

const STATUS_COLOR: Record<StoreStatus, string> = {
  red: '#ef4444',
  yellow: '#f5c518',
  green: '#3ddc84',
}

const STATUS_LABEL: Record<StoreStatus, string> = {
  red: 'Immediate Attention',
  yellow: 'Monitor Closely',
  green: 'No Action Required',
}

const WIDTH = 640
const HEIGHT = 400
const INSET_STATES = new Set(['Alaska', 'Hawaii', 'Puerto Rico'])

const DEG = Math.PI / 180
const PHI1 = 29.5 * DEG
const PHI2 = 45.5 * DEG
const PHI0 = 37.5 * DEG
const LAMBDA0 = -96 * DEG
const CONE = 0.5 * (Math.sin(PHI1) + Math.sin(PHI2))
const CONE_C = Math.cos(PHI1) ** 2 + 2 * CONE * Math.sin(PHI1)
const RHO0 = Math.sqrt(CONE_C - 2 * CONE * Math.sin(PHI0)) / CONE

const MAIN_BOX: Box = { x: 8, y: 6, w: WIDTH - 16, h: HEIGHT - 14 }
const ALASKA_FRAME: Box = { x: 14, y: 304, w: 108, h: 84 }
const ALASKA_BOX: Box = { x: 20, y: 320, w: 96, h: 62 }
const HAWAII_FRAME: Box = { x: 128, y: 346, w: 78, h: 44 }
const HAWAII_BOX: Box = { x: 132, y: 358, w: 70, h: 28 }

const features = (usStates as unknown as { features: StateFeature[] }).features

function project(lon: number, lat: number): Point {
  const phi = lat * DEG
  const lambda = lon * DEG
  const rho = Math.sqrt(Math.max(0, CONE_C - 2 * CONE * Math.sin(phi))) / CONE
  const theta = CONE * (lambda - LAMBDA0)
  return {
    x: rho * Math.sin(theta),
    y: RHO0 - rho * Math.cos(theta),
  }
}

function polygonsOf(feature: StateFeature): Polygon[] {
  if (feature.geometry.type === 'Polygon') return [feature.geometry.coordinates]
  return feature.geometry.coordinates
}

function boundsOf(stateFeatures: StateFeature[]): Bounds {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const feature of stateFeatures) {
    for (const polygon of polygonsOf(feature)) {
      for (const ring of polygon) {
        for (const [lon, lat] of ring) {
          const point = project(lon, lat)
          minX = Math.min(minX, point.x)
          minY = Math.min(minY, point.y)
          maxX = Math.max(maxX, point.x)
          maxY = Math.max(maxY, point.y)
        }
      }
    }
  }

  return { minX, minY, maxX, maxY }
}

function makeFit(bounds: Bounds, box: Box) {
  const spanX = bounds.maxX - bounds.minX || 1
  const spanY = bounds.maxY - bounds.minY || 1
  const scale = Math.min(box.w / spanX, box.h / spanY)
  const offsetX = box.x + (box.w - spanX * scale) / 2
  const offsetY = box.y + (box.h - spanY * scale) / 2

  return (lon: number, lat: number): Point => {
    const point = project(lon, lat)
    return {
      x: offsetX + (point.x - bounds.minX) * scale,
      y: offsetY + (bounds.maxY - point.y) * scale,
    }
  }
}

function featurePath(feature: StateFeature, fit: (lon: number, lat: number) => Point): string {
  return polygonsOf(feature)
    .map((polygon) =>
      polygon
        .map((ring) => {
          const commands = ring.map(([lon, lat], index) => {
            const point = fit(lon, lat)
            return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`
          })
          return `${commands.join(' ')} Z`
        })
        .join(' '),
    )
    .join(' ')
}

const lower48 = features.filter((feature) => !INSET_STATES.has(feature.properties.name))
const alaska = features.find((feature) => feature.properties.name === 'Alaska')
const hawaii = features.find((feature) => feature.properties.name === 'Hawaii')

const fitLower48 = makeFit(boundsOf(lower48), MAIN_BOX)
const fitAlaska = alaska ? makeFit(boundsOf([alaska]), ALASKA_BOX) : null
const fitHawaii = hawaii ? makeFit(boundsOf([hawaii]), HAWAII_BOX) : null

const lowerPaths = lower48.map((feature) => ({
  name: feature.properties.name,
  d: featurePath(feature, fitLower48),
}))
const alaskaPath = alaska && fitAlaska ? featurePath(alaska, fitAlaska) : ''
const hawaiiPath = hawaii && fitHawaii ? featurePath(hawaii, fitHawaii) : ''

function regionOf(site: MapSite): 'alaska' | 'hawaii' | 'lower' {
  if (site.lat < 30 && site.lon < -140) return 'hawaii'
  if (site.lat > 50 && site.lon < -130) return 'alaska'
  return 'lower'
}

function placeSite(site: MapSite): Point {
  const region = regionOf(site)
  if (region === 'hawaii' && fitHawaii) return fitHawaii(site.lon, site.lat)
  if (region === 'alaska' && fitAlaska) return fitAlaska(site.lon, site.lat)
  return fitLower48(site.lon, site.lat)
}

function spreadDots(sites: MapSite[]) {
  const placed: Point[] = []
  return sites.map((site) => {
    const origin = placeSite(site)
    let x = origin.x
    let y = origin.y
    let guard = 0
    while (placed.some((dot) => Math.hypot(dot.x - x, dot.y - y) < 11) && guard < 8) {
      const angle = guard * 1.15
      const distance = 8 + guard * 1.4
      x = origin.x + Math.cos(angle) * distance
      y = origin.y + Math.sin(angle) * distance
      guard += 1
    }
    placed.push({ x, y })
    return { ...site, x, y }
  })
}

function SiteDot({
  site,
  onSelectStore,
}: {
  site: MapSite & Point
  onSelectStore: (storeId: string) => void
}) {
  return (
    <circle
      cx={site.x}
      cy={site.y}
      r="5.5"
      fill={STATUS_COLOR[site.status]}
      stroke="#ffffff"
      strokeWidth="1.5"
      className="site-map__dot"
      role="button"
      tabIndex={0}
      aria-label={`${site.id} ${site.location}, ${STATUS_LABEL[site.status]}`}
      onClick={() => onSelectStore(site.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectStore(site.id)
        }
      }}
    >
      <title>{`${site.id} ${site.location}`}</title>
    </circle>
  )
}

export function UsSiteMap({ sites, onSelectStore }: UsSiteMapProps) {
  const dots = spreadDots(sites)

  return (
    <article className="panel-card site-map" aria-label="Geographic view of sites">
      <h3 className="panel-card__title">Geographic View</h3>
      <div className="site-map__canvas">
        <svg className="site-map__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="United States site map with state lines">
          <rect width={WIDTH} height={HEIGHT} rx="12" fill="#10243f" />
          {lowerPaths.map((state) => (
            <path
              key={state.name}
              d={state.d}
              fill="#1b4f7a"
              stroke="#c5e4f7"
              strokeWidth="0.9"
              strokeLinejoin="round"
              fillRule="evenodd"
            >
              <title>{state.name}</title>
            </path>
          ))}

          <rect
            x={ALASKA_FRAME.x}
            y={ALASKA_FRAME.y}
            width={ALASKA_FRAME.w}
            height={ALASKA_FRAME.h}
            rx="8"
            fill="#0e2c4d"
            stroke="#7eb6dc"
          />
          <text x={ALASKA_FRAME.x + 8} y={ALASKA_FRAME.y + 13} fill="#d6e8f7" fontSize="11" fontWeight="700">
            AK
          </text>
          {alaskaPath && (
            <path d={alaskaPath} fill="#1b4f7a" stroke="#c5e4f7" strokeWidth="0.7" strokeLinejoin="round" fillRule="evenodd" />
          )}

          <rect
            x={HAWAII_FRAME.x}
            y={HAWAII_FRAME.y}
            width={HAWAII_FRAME.w}
            height={HAWAII_FRAME.h}
            rx="8"
            fill="#0e2c4d"
            stroke="#7eb6dc"
          />
          <text x={HAWAII_FRAME.x + 6} y={HAWAII_FRAME.y + 11} fill="#d6e8f7" fontSize="10" fontWeight="700">
            HI
          </text>
          {hawaiiPath && (
            <path d={hawaiiPath} fill="#1b4f7a" stroke="#c5e4f7" strokeWidth="0.7" strokeLinejoin="round" fillRule="evenodd" />
          )}

          {dots.map((site) => (
            <SiteDot key={site.id} site={site} onSelectStore={onSelectStore} />
          ))}
        </svg>
        <ul className="site-map__legend">
          {(Object.keys(STATUS_LABEL) as StoreStatus[]).map((status) => (
            <li key={status}>
              <span className="site-map__swatch" style={{ background: STATUS_COLOR[status] }} />
              {STATUS_LABEL[status]}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
