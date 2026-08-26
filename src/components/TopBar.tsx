import { getStoreById } from '../data/stores'

interface TopBarProps {
  selectedStoreId: string | null
  displayName: string
  onLogout: () => void
}

export function TopBar({ selectedStoreId, displayName, onLogout }: TopBarProps) {
  const selectedStore = selectedStoreId ? getStoreById(selectedStoreId) : undefined

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__title">Fleet Analytics Dashboard</h1>
        {selectedStore && (
          <span className="topbar__selected-device">
            {selectedStore.id} {selectedStore.location}
          </span>
        )}
      </div>
      <div className="topbar__right">
        <div className="topbar__user">
          <span className="topbar__user-name">{displayName}</span>
          <button type="button" className="topbar__logout" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
