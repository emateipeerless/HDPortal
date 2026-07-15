import { DetailViewLayout } from './DetailViewLayout'
import {
  formatPercentChange,
  formatRatio,
  getPumpActivityRecords,
  type PumpType,
} from '../data/mockPumpActivity'
import { getStoreById } from '../data/stores'

interface PumpActivityDetailViewProps {
  pumpType: PumpType
  onBack: () => void
}

const titles: Record<PumpType, string> = {
  jockey: 'Jockey Pump Activity',
  fire: 'Fire Pump Activity',
}

export function PumpActivityDetailView({ pumpType, onBack }: PumpActivityDetailViewProps) {
  const records = getPumpActivityRecords(pumpType)

  return (
    <DetailViewLayout
      title={titles[pumpType]}
      subtitle={`${records.length} sites with excessive or trouble activity`}
      accentClass="detail-view--blue"
      onBack={onBack}
    >
      <table className="detail-view__table">
        <thead>
          <tr>
            <th scope="col">Store</th>
            <th scope="col">City</th>
            <th scope="col">Starts (Month)</th>
            <th scope="col">% vs Last Month</th>
            <th scope="col">Month over Month</th>
            <th scope="col">Month over 6 Months</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => {
            const store = getStoreById(item.storeId)
            return (
              <tr key={`${item.storeId}-${item.pumpType}`}>
                <td>
                  <span className="detail-view__store-id">{item.storeId}</span>
                </td>
                <td>{store?.location ?? 'Unknown location'}</td>
                <td>{item.startsThisMonth}</td>
                <td className="detail-view__change detail-view__change--negative">
                  {formatPercentChange(item.percentChangeFromLastMonth)}
                </td>
                <td>{formatRatio(item.monthOverMonth)}</td>
                <td>{formatRatio(item.monthOverSixMonths)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </DetailViewLayout>
  )
}
