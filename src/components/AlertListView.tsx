import {
  RED_STATUS_TRIGGERS,
  YELLOW_STATUS_TRIGGERS,
} from '../data/alertCriteria'
import {
  getAlertsBySeverity,
  type AlertSeverity,
} from '../data/mockAlerts'
import { getStoreById } from '../data/stores'
import { formatFlaggedDate } from '../utils/formatDate'
import { DetailViewLayout } from './DetailViewLayout'

interface AlertListViewProps {
  severity: AlertSeverity
  onBack: () => void
}

const titles: Record<AlertSeverity, string> = {
  red: 'Immediate Attention Required',
  yellow: 'Monitor Closely',
}

const triggerCatalog: Record<AlertSeverity, typeof RED_STATUS_TRIGGERS> = {
  red: RED_STATUS_TRIGGERS,
  yellow: YELLOW_STATUS_TRIGGERS,
}

export function AlertListView({ severity, onBack }: AlertListViewProps) {
  const alerts = getAlertsBySeverity(severity)
  const triggers = triggerCatalog[severity]

  return (
    <DetailViewLayout
      title={titles[severity]}
      subtitle={`${alerts.length} ${alerts.length === 1 ? 'site' : 'sites'} flagged`}
      accentClass={`detail-view--${severity}`}
      onBack={onBack}
    >
      <section className="detail-view__section">
        <h3 className="detail-view__section-title">Flagged sites</h3>
        <div className="detail-view__table-wrap">
          <table className="detail-view__table">
            <thead>
              <tr>
                <th scope="col">Store</th>
                <th scope="col">Reason</th>
                <th scope="col">Current Condition</th>
                <th scope="col">Date Flagged</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => {
                const store = getStoreById(alert.storeId)
                return (
                  <tr key={`${alert.storeId}-${alert.flaggedSince}`}>
                    <td>
                      <span className="detail-view__store-id">{alert.storeId}</span>
                      <span className="detail-view__store-location">
                        {store?.location ?? 'Unknown location'}
                      </span>
                    </td>
                    <td>{alert.reason}</td>
                    <td>{alert.currentCondition}</td>
                    <td>{formatFlaggedDate(alert.flaggedSince)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="detail-view__reference">
        <h4 className="detail-view__reference-title">
          Reference: what triggers {severity === 'red' ? 'immediate attention' : 'monitor closely'}
        </h4>
        <p className="detail-view__reference-desc">
          A store is classified as <strong>{titles[severity]}</strong> when any of the following
          conditions apply.
        </p>
        <ul className="detail-view__reference-list">
          {triggers.map((trigger) => (
            <li key={trigger.title} className="detail-view__reference-item">
              <p className="detail-view__reference-name">{trigger.title}</p>
              <p className="detail-view__reference-meta">{trigger.description}</p>
              {trigger.impairmentGroups?.map((group) => (
                <div key={`${trigger.title}-${group.pumpType}`} className="detail-view__alarm-group">
                  <p className="detail-view__alarm-group-title">{group.pumpType} pump trouble alerts</p>
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
              ))}
            </li>
          ))}
        </ul>
      </section>
    </DetailViewLayout>
  )
}
