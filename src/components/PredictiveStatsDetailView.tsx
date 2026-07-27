import { MOCK_PREDICTIVE_STATISTICS } from '../data/mockPredictiveStats'
import { PREDICTIVE_STATISTICS_CATALOG } from '../data/predictiveStatsCatalog'
import { getStoreById } from '../data/stores'
import { DetailViewLayout } from './DetailViewLayout'

interface PredictiveStatsDetailViewProps {
  onBack: () => void
}

export function PredictiveStatsDetailView({ onBack }: PredictiveStatsDetailViewProps) {
  return (
    <DetailViewLayout
      title="Predictive Statistics"
      subtitle={`${MOCK_PREDICTIVE_STATISTICS.length} sites with active indicators`}
      accentClass="detail-view--blue"
      onBack={onBack}
    >
      <section className="detail-view__section">
        <h3 className="detail-view__section-title">Sites with active indicators</h3>
        <div className="detail-view__table-wrap">
          <table className="detail-view__table">
            <thead>
              <tr>
                <th scope="col">Store</th>
                <th scope="col">City</th>
                <th scope="col">Statistic</th>
                <th scope="col">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PREDICTIVE_STATISTICS.map((item) => {
                const store = getStoreById(item.storeId)
                return (
                  <tr key={`${item.storeId}-${item.statistic}`}>
                    <td>
                      <span className="detail-view__store-id">{item.storeId}</span>
                    </td>
                    <td>{store?.location ?? 'Unknown location'}</td>
                    <td>{item.statistic}</td>
                    <td>{item.prediction}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="detail-view__reference">
        <h4 className="detail-view__reference-title">Reference: statistic types &amp; data sources</h4>
        <p className="detail-view__reference-desc">
          Indicators the portal can compute when live data is connected ({PREDICTIVE_STATISTICS_CATALOG.length}{' '}
          types).
        </p>
        <ul className="detail-view__reference-list">
          {PREDICTIVE_STATISTICS_CATALOG.map((item) => (
            <li key={item.statistic} className="detail-view__reference-item">
              <p className="detail-view__reference-name">{item.statistic}</p>
              <p className="detail-view__reference-meta">
                <span className="detail-view__reference-label">Feeds:</span> {item.dataFeed}
              </p>
              <p className="detail-view__reference-meta">
                <span className="detail-view__reference-label">Typical prediction:</span>{' '}
                {item.typicalPrediction}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </DetailViewLayout>
  )
}
