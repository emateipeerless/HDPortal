import { useEffect, useRef, useState } from 'react'
import { getStoreStatus } from '../data/storeProfile'
import { getStoreById, searchStoresByNumber } from '../data/stores'

interface TopBarProps {
  selectedStoreId: string | null
  onSelectStore: (storeId: string) => void
  displayName: string
  onLogout: () => void
}

export function TopBar({ selectedStoreId, onSelectStore, displayName, onLogout }: TopBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const selectedStore = selectedStoreId ? getStoreById(selectedStoreId) : undefined
  const results = searchStoresByNumber(query)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectStore = (storeId: string) => {
    onSelectStore(storeId)
    setQuery('')
    setIsOpen(false)
  }

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
        <div className="topbar__search" ref={searchRef}>
        <svg
          className="topbar__search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          className="topbar__search-input"
          placeholder="Search by store number..."
          aria-label="Search by store number"
          aria-expanded={isOpen}
          aria-controls="store-search-results"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true)
          }}
        />
        {isOpen && query.trim() && (
          <ul className="topbar__search-results" id="store-search-results" role="listbox">
            {results.length === 0 ? (
              <li className="topbar__search-empty">No stores match that number</li>
            ) : (
              results.map((store) => (
                <li key={store.id} role="option">
                  <button
                    type="button"
                    className="topbar__search-result"
                    onClick={() => handleSelectStore(store.id)}
                  >
                    <span
                      className={`topbar__search-dot topbar__search-dot--${getStoreStatus(store.id)}`}
                      aria-hidden="true"
                    />
                    <span className="topbar__search-result-text">
                      <span className="topbar__search-store-id">{store.id}</span>
                      <span className="topbar__search-store-location">{store.location}</span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
        </div>
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
