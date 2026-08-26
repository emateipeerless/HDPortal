import { MOCK_PREDICTIVE_STATISTICS } from '../data/mockPredictiveStats'
import { PREDICTIVE_STATISTICS_CATALOG } from '../data/predictiveStatsCatalog'
import { getStoreById } from '../data/stores'
import { DetailViewLayout } from './DetailViewLayout'
import { StoreIdLink } from './StoreIdLink'

interface PredictiveStatsDetailViewProps {
  onBack: () => void
  onSelectStore: (storeId: string) => void
}

export function PredictiveStatsDetailView({
  onBack,
  onSelectStore,
}: PredictiveStatsDetailViewProps) {
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
                      <StoreIdLink storeId={item.storeId} onSelect={onSelectStore} />
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
        <h4 className="detail-view__reference-title">
          Reference: statistic types &amp; data sources
        </h4>
        <p className="detail-view__reference-desc">
          A site can show a predictive indicator when any of the following statistics are computed
          from live telemetry. Each row lists what feeds the statistic and the typical prediction.
        </p>
        <ul className="detail-view__reference-list">
          {PREDICTIVE_STATISTICS_CATALOG.map((item) => (
            <li key={item.statistic} className="detail-view__reference-item">
              <p className="detail-view__reference-name">{item.statistic}</p>
              <p className="detail-view__reference-meta">
                Predictive indicator the portal can raise when this trend is detected.
              </p>
              <div className="detail-view__alarm-group">
                <p className="detail-view__alarm-group-title">Data feed &amp; prediction</p>
                <div className="detail-view__alarm-table-wrap">
                  <table className="detail-view__alarm-table">
                    <thead>
                      <tr>
                        <th scope="col">What feeds it</th>
                        <th scope="col">Typical prediction</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{item.dataFeed}</td>
                        <td>{item.typicalPrediction}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </DetailViewLayout>
  )
}
