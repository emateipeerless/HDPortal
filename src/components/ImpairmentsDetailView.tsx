import { DetailViewLayout } from './DetailViewLayout'
import { MOCK_ACTIVE_IMPAIRMENTS } from '../data/mockImpairments'
import { getStoreById } from '../data/stores'
import { formatFlaggedDate } from '../utils/formatDate'

interface ImpairmentsDetailViewProps {
  onBack: () => void
}

export function ImpairmentsDetailView({ onBack }: ImpairmentsDetailViewProps) {
  return (
    <DetailViewLayout
      title="Active Impairments"
      subtitle={`${MOCK_ACTIVE_IMPAIRMENTS.length} active impairments across the portfolio`}
      accentClass="detail-view--blue"
      onBack={onBack}
    >
      <table className="detail-view__table">
        <thead>
          <tr>
            <th scope="col">Store</th>
            <th scope="col">Impairment</th>
            <th scope="col">Active Since</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_ACTIVE_IMPAIRMENTS.map((item) => {
            const store = getStoreById(item.storeId)
            return (
              <tr key={`${item.storeId}-${item.impairment}`}>
                <td>
                  <span className="detail-view__store-id">{item.storeId}</span>
                  <span className="detail-view__store-location">
                    {store?.location ?? 'Unknown location'}
                  </span>
                </td>
                <td>{item.impairment}</td>
                <td>{formatFlaggedDate(item.activeSince)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </DetailViewLayout>
  )
}
