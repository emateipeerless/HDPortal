import { useAcceptanceTestByStore } from '../hooks/useAcceptanceTestByStore'
import { AcceptanceTestsSavedView } from './AcceptanceTestForm'

interface AcceptanceTestsPanelProps {
  storeId: string
  enabled?: boolean
}

export function AcceptanceTestsPanel({ storeId, enabled = true }: AcceptanceTestsPanelProps) {
  const { loading, error, bundle, configured, readings } = useAcceptanceTestByStore(
    storeId,
    enabled,
  )

  if (!enabled) return null

  if (loading) {
    return <p className="store-detail__empty">Loading acceptance test data…</p>
  }

  if (error) {
    return <p className="acceptance-form__error">{error}</p>
  }

  if (!configured) {
    return (
      <p className="acceptance-form__banner">
        Get API is not configured yet (`VITE_GET_ACCEPTANCE_TEST_URL`).
      </p>
    )
  }

  if (bundle?.exists && bundle.acceptanceTest) {
    return (
      <AcceptanceTestsSavedView
        storeNumber={storeId}
        acceptanceTestDate={bundle.acceptanceTest.acceptanceTestDate}
        readings={readings}
      />
    )
  }

  return (
    <p className="store-detail__empty">
      No acceptance test information exists yet for store {storeId}.
    </p>
  )
}
