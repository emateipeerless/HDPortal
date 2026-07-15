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

export function AlertListView({ severity, onBack }: AlertListViewProps) {
  const alerts = getAlertsBySeverity(severity)

  return (
    <DetailViewLayout
      title={titles[severity]}
      subtitle={`${alerts.length} ${alerts.length === 1 ? 'site' : 'sites'} flagged`}
      accentClass={`detail-view--${severity}`}
      onBack={onBack}
    >
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
    </DetailViewLayout>
  )
}
