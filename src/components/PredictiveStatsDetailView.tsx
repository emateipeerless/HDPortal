import { DetailViewLayout } from './DetailViewLayout'
import { MOCK_PREDICTIVE_STATISTICS } from '../data/mockPredictiveStats'
import { getStoreById } from '../data/stores'

interface PredictiveStatsDetailViewProps {
  onBack: () => void
}

export function PredictiveStatsDetailView({ onBack }: PredictiveStatsDetailViewProps) {
  return (
    <DetailViewLayout
      title="Predictive Statistics"
      subtitle={`${MOCK_PREDICTIVE_STATISTICS.length} sites with predictive indicators`}
      accentClass="detail-view--blue"
      onBack={onBack}
    >
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
    </DetailViewLayout>
  )
}
