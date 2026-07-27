import { IMPAIRMENT_CATALOG } from '../data/impairmentCatalog'
import { MOCK_ACTIVE_IMPAIRMENTS } from '../data/mockImpairments'
import { getStoreById } from '../data/stores'
import { formatFlaggedDate } from '../utils/formatDate'
import { DetailViewLayout } from './DetailViewLayout'

interface ImpairmentsDetailViewProps {
  onBack: () => void
}

export function ImpairmentsDetailView({ onBack }: ImpairmentsDetailViewProps) {
  return (
    <DetailViewLayout
      title="Impairments"
      subtitle={`${MOCK_ACTIVE_IMPAIRMENTS.length} active impairments across the portfolio`}
      accentClass="detail-view--blue"
      onBack={onBack}
    >
      <section className="detail-view__section">
        <h3 className="detail-view__section-title">Active impairments by site</h3>
        <div className="detail-view__table-wrap">
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
        </div>
      </section>

      <section className="detail-view__reference">
        <h4 className="detail-view__reference-title">Reference: possible controller impairments</h4>
        <p className="detail-view__reference-desc">
          Alarm names from diesel and electric fire pump controllers ({IMPAIRMENT_CATALOG.length}{' '}
          types). Source: controller impaired alarm events.
        </p>
        <ul className="detail-view__reference-list detail-view__reference-list--compact">
          {IMPAIRMENT_CATALOG.map((item) => (
            <li key={item.name} className="detail-view__reference-item">
              <p className="detail-view__reference-name">
                {item.name}
                <span className="detail-view__reference-tag">{item.pumpTypes}</span>
              </p>
              <p className="detail-view__reference-meta">{item.escalationRule}</p>
            </li>
          ))}
        </ul>
      </section>
    </DetailViewLayout>
  )
}
