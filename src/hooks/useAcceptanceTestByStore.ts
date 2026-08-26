import { useEffect, useState } from 'react'
import {
  getAcceptanceTestByStore,
  isAcceptanceGetConfigured,
  type AcceptanceTestBundle,
} from '../api/acceptanceTest'

const EMPTY_READINGS: NonNullable<AcceptanceTestBundle['readings']> = {
  churn: { speedRpm: null, suctionPsi: null, dischargePsi: null, flowGpm: 0 },
  rated: { speedRpm: null, suctionPsi: null, dischargePsi: null, flowGpm: null },
  overflow: { speedRpm: null, suctionPsi: null, dischargePsi: null, flowGpm: null },
}

export function useAcceptanceTestByStore(storeId: string, enabled: boolean) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bundle, setBundle] = useState<AcceptanceTestBundle | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await getAcceptanceTestByStore(storeId)
        if (!cancelled) setBundle(result)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load acceptance test data')
          setBundle({
            success: true,
            exists: false,
            storeNumber: storeId,
            deviceId: null,
            acceptanceTest: null,
            readings: null,
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [storeId, enabled])

  return {
    loading,
    error,
    bundle,
    configured: isAcceptanceGetConfigured(),
    readings: bundle?.readings ?? EMPTY_READINGS,
  }
}
