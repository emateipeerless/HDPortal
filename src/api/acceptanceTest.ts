export type TestPointKey = 'churn' | 'rated' | 'overflow'

export type TestMetricKey = 'speedRpm' | 'suctionPsi' | 'dischargePsi' | 'flowGpm'

export type AcceptanceTestHeader = {
  deviceId?: string
  storeNumber?: string | null
  city?: string | null
  state?: string | null
  acceptanceTestDate?: string | null
  pumpMake?: string | null
  pumpType?: string | null
  pumpPosition?: string | null
  pumpModel?: string | null
  pumpSerial?: string | null
  pumpRatedGpm?: number | string | null
  pumpRatedRpm?: number | string | null
  pumpRatedPsi?: number | string | null
  pumpSuction?: string | null
  driverType?: string | null
  driverManufacturer?: string | null
  driverSerial?: string | null
  driverModel?: string | null
  driverRatedHp?: number | string | null
  driverRatedRpm?: number | string | null
  controllerManufacturer?: string | null
  controllerModel?: string | null
  controllerSerial?: string | null
  startPsi?: number | string | null
  startMethod?: string | null
  transferSwitch?: string | null
  upstreamDisconnect?: string | null
  jockeyPumpManufacturer?: string | null
  jockeyPumpType?: string | null
  jockeyPumpSize?: string | null
  jockeyPumpVoltage?: number | string | null
  jockeyPumpAmps?: number | string | null
  jockeyPumpHp?: number | string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type AcceptanceTestReadings = Record<
  TestPointKey,
  Record<TestMetricKey, number | string | null>
>

export type AcceptanceTestBundle = {
  success: boolean
  exists: boolean
  storeNumber?: string | null
  deviceId?: string | null
  acceptanceTest: AcceptanceTestHeader | null
  readings: AcceptanceTestReadings | null
  message?: string
  error?: string
}

const GET_URL = import.meta.env.VITE_GET_ACCEPTANCE_TEST_URL as string | undefined

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let payload: T & { error?: string; success?: boolean }
  try {
    payload = (await response.json()) as T & { error?: string; success?: boolean }
  } catch {
    throw new Error(`Request failed (${response.status})`)
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || `Request failed (${response.status})`)
  }

  return payload
}

export function isAcceptanceGetConfigured(): boolean {
  return Boolean(GET_URL)
}

export async function getAcceptanceTestByStore(storeNumber: string): Promise<AcceptanceTestBundle> {
  if (!GET_URL) {
    return {
      success: true,
      exists: false,
      storeNumber,
      deviceId: null,
      acceptanceTest: null,
      readings: null,
    }
  }
  return postJson<AcceptanceTestBundle>(GET_URL, { storeNumber })
}
