import {
  RED_DIESEL_IMPAIRMENTS,
  RED_ELECTRIC_IMPAIRMENTS,
  YELLOW_DIESEL_IMPAIRMENTS,
  YELLOW_ELECTRIC_IMPAIRMENTS,
  YELLOW_JOCKEY_IMPAIRMENTS,
  type TroubleAlert,
} from '../data/alertCriteria'
import { MOCK_ACTIVE_IMPAIRMENTS } from '../data/mockImpairments'
import { getStoreById } from '../data/stores'
import { formatFlaggedDate } from '../utils/formatDate'
import { DetailViewLayout } from './DetailViewLayout'

interface ImpairmentsDetailViewProps {
  onBack: () => void
}

interface ImpairmentReferenceGroup {
  title: string
  description: string
  pumpType: string
  alarms: readonly TroubleAlert[]
}

const IMPAIRMENT_REFERENCE_GROUPS: ImpairmentReferenceGroup[] = [
  {
    title: 'Red diesel impairments',
    description:
      'Diesel fire pump trouble alerts that classify a site as Immediate Attention Required when active for more than 10 hours.',
    pumpType: 'Diesel',
    alarms: RED_DIESEL_IMPAIRMENTS,
  },
  {
    title: 'Red electric impairments',
    description:
      'Electric fire pump trouble alerts that classify a site as Immediate Attention Required when active for more than 10 hours.',
    pumpType: 'Electric',
    alarms: RED_ELECTRIC_IMPAIRMENTS,
  },
  {
    title: 'Yellow diesel impairments',
    description:
      'Diesel fire pump trouble alerts that classify a site as Monitor Closely when active at lower severity.',
    pumpType: 'Diesel',
    alarms: YELLOW_DIESEL_IMPAIRMENTS,
  },
  {
    title: 'Yellow electric impairments',
    description:
      'Electric fire pump trouble alerts that classify a site as Monitor Closely when active at lower severity.',
    pumpType: 'Electric',
    alarms: YELLOW_ELECTRIC_IMPAIRMENTS,
  },
  {
    title: 'Yellow jockey impairments',
    description:
      'Jockey pump trouble alerts that classify a site as Monitor Closely when active at lower severity.',
    pumpType: 'Jockey',
    alarms: YELLOW_JOCKEY_IMPAIRMENTS,
  },
]

export function ImpairmentsDetailView({ onBack }: ImpairmentsDetailViewProps) {
  return (
    <DetailViewLayout
      title="Impairments"
      subtitle={`${MOCK_ACTIVE_IMPAIRMENTS.length} active impairments across the portfolio`}
      accentClass="detail-view--blue"
      onBack={onBack}
    >
      <section className="detail-view__section">
        <h3 className="detail-view__section-title">Active impairments</h3>
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
        <h4 className="detail-view__reference-title">
          Reference: possible controller impairments
        </h4>
        <p className="detail-view__reference-desc">
          A store can surface an impairment from any of the following diesel, electric, or jockey
          trouble-alert groups. Remedy shows the cleared / restored event that ends the condition.
        </p>
        <ul className="detail-view__reference-list">
          {IMPAIRMENT_REFERENCE_GROUPS.map((group) => (
            <li key={group.title} className="detail-view__reference-item">
              <p className="detail-view__reference-name">{group.title}</p>
              <p className="detail-view__reference-meta">{group.description}</p>
              <div className="detail-view__alarm-group">
                <p className="detail-view__alarm-group-title">
                  {group.pumpType} pump trouble alerts
                </p>
                <div className="detail-view__alarm-table-wrap">
                  <table className="detail-view__alarm-table">
                    <thead>
                      <tr>
                        <th scope="col">Trouble alert</th>
                        <th scope="col">Remedy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.alarms.map((alarm) => (
                        <tr key={alarm.alert}>
                          <td>{alarm.alert}</td>
                          <td>{alarm.remedy || '—'}</td>
                        </tr>
                      ))}
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
