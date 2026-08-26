import { useAcceptanceTestByStore } from '../hooks/useAcceptanceTestByStore'
import { AssetTrackingSavedView } from './AcceptanceTestForm'

interface AssetTrackingPanelProps {
  storeId: string
  enabled?: boolean
}

export function AssetTrackingPanel({ storeId, enabled = true }: AssetTrackingPanelProps) {
  const { loading, error, bundle, configured } = useAcceptanceTestByStore(storeId, enabled)

  if (!enabled) return null

  if (loading) {
    return <p className="store-detail__empty">Loading asset tracking data…</p>
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
      <AssetTrackingSavedView
        storeNumber={storeId}
        fireconnectDeviceId={bundle.deviceId ?? bundle.acceptanceTest.deviceId}
        acceptanceTest={bundle.acceptanceTest}
      />
    )
  }

  return (
    <p className="store-detail__empty">
      No asset tracking information exists yet for store {storeId}.
    </p>
  )
}
