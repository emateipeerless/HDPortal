interface StoreIdLinkProps {
  storeId: string
  location?: string
  onSelect: (storeId: string) => void
}

export function StoreIdLink({ storeId, location, onSelect }: StoreIdLinkProps) {
  return (
    <button type="button" className="store-id-link" onClick={() => onSelect(storeId)}>
      <span className="detail-view__store-id">{storeId}</span>
      {location && <span className="detail-view__store-location">{location}</span>}
    </button>
  )
}
