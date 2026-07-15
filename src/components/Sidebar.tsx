import { useState } from 'react'
import { getStoreStatus } from '../data/storeProfile'
import { STORES } from '../data/stores'

interface SidebarProps {
  selectedStoreId: string | null
  onSelectStore: (storeId: string) => void
}

export function Sidebar({ selectedStoreId, onSelectStore }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon" aria-hidden="true">
            HD
          </span>
          {!isCollapsed && (
            <div>
              <p className="sidebar__brand-title">Home Depot</p>
              <p className="sidebar__brand-subtitle">Fleet Portal</p>
            </div>
          )}
        </div>
        <button
          type="button"
          className="sidebar__toggle"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <p className="sidebar__section-label">Stores ({STORES.length})</p>
          <nav className="sidebar__nav" aria-label="Store list">
            <ul className="sidebar__device-list">
              {STORES.map((store) => (
                <li key={store.id}>
                  <button
                    type="button"
                    className={`sidebar__device ${
                      selectedStoreId === store.id ? 'sidebar__device--active' : ''
                    }`}
                    onClick={() => onSelectStore(store.id)}
                  >
                    <span
                      className={`sidebar__device-dot sidebar__device-dot--${getStoreStatus(store.id)}`}
                      aria-hidden="true"
                    />
                    <span className="sidebar__store">
                      <span className="sidebar__store-id">{store.id}</span>
                      <span className="sidebar__store-location">{store.location}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </aside>
  )
}
