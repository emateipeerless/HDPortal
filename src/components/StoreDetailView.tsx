import {
  getCategoryLabel,
  getStatusLabel,
  getStoreProfile,
} from '../data/storeProfile'
import { formatFlaggedDate } from '../utils/formatDate'

interface StoreDetailViewProps {
  storeId: string
  onBack: () => void
}

export function StoreDetailView({ storeId, onBack }: StoreDetailViewProps) {
  const profile = getStoreProfile(storeId)

  if (!profile) {
    return (
      <main className="store-detail">
        <button type="button" className="detail-view__back" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <p>Store not found.</p>
      </main>
    )
  }

  const lastRedEntry = profile.statusHistory.find((entry) => entry.severity === 'red')
  const lastYellowEntry = profile.statusHistory.find((entry) => entry.severity === 'yellow')

  return (
    <main className="store-detail">
      <div className="store-detail__header">
        <button type="button" className="detail-view__back" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="store-detail__heading">
          <div>
            <h2 className="store-detail__title">
              Store {profile.storeId} — {profile.location}
            </h2>
            <p className="store-detail__subtitle">Site-level fleet history and status</p>
          </div>
          <span className={`store-detail__status store-detail__status--${profile.currentStatus}`}>
            {getStatusLabel(profile.currentStatus)}
          </span>
        </div>
      </div>

      <section className="store-detail__section">
        <h3 className="store-detail__section-title">Overall Site Info</h3>
        <div className="store-detail__info-grid">
          <InfoItem label="Pump Configuration" value={profile.overallInfo.pumpConfiguration} />
          <InfoItem label="Controller Type" value={profile.overallInfo.controllerType} />
          <InfoItem label="Connectivity" value={profile.overallInfo.connectivityStatus} />
          <InfoItem label="Pump Room Temp" value={profile.overallInfo.pumpRoomTemp} />
          <InfoItem label="Last Inspection" value={profile.overallInfo.lastInspection} />
          <InfoItem label="Site Grade" value={profile.overallInfo.siteGrade} />
          <InfoItem label="Devices Online" value={profile.overallInfo.devicesOnline} />
          <InfoItem
            label="Last Red State"
            value={
              lastRedEntry
                ? `${formatFlaggedDate(lastRedEntry.startedAt)}${lastRedEntry.endedAt ? ' (resolved)' : ' (active)'}`
                : 'No red state on record'
            }
          />
          <InfoItem
            label="Last Yellow State"
            value={
              lastYellowEntry
                ? `${formatFlaggedDate(lastYellowEntry.startedAt)}${lastYellowEntry.endedAt ? ' (resolved)' : ' (active)'}`
                : 'No yellow state on record'
            }
          />
        </div>
      </section>

      <section className="store-detail__section">
        <h3 className="store-detail__section-title">Active Flags</h3>
        {profile.activeFlags.length === 0 ? (
          <p className="store-detail__empty">No active flags on this site.</p>
        ) : (
          <div className="detail-view__table-wrap">
            <table className="detail-view__table">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Flag</th>
                  <th scope="col">Current Condition</th>
                  <th scope="col">Active Since</th>
                </tr>
              </thead>
              <tbody>
                {profile.activeFlags.map((flag) => (
                  <tr key={`${flag.category}-${flag.title}-${flag.date}`}>
                    <td>{getCategoryLabel(flag.category)}</td>
                    <td>{flag.title}</td>
                    <td>{flag.detail}</td>
                    <td>{formatFlaggedDate(flag.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="store-detail__section">
        <h3 className="store-detail__section-title">Red / Yellow Status History</h3>
        {profile.statusHistory.length === 0 ? (
          <p className="store-detail__empty">This site has no recorded red or yellow states.</p>
        ) : (
          <div className="detail-view__table-wrap">
            <table className="detail-view__table">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Started</th>
                  <th scope="col">Ended</th>
                </tr>
              </thead>
              <tbody>
                {profile.statusHistory.map((entry) => (
                  <tr key={`${entry.severity}-${entry.startedAt}`}>
                    <td>
                      <span
                        className={`store-detail__status-pill store-detail__status-pill--${entry.severity}`}
                      >
                        {entry.severity === 'red' ? 'Red' : 'Yellow'}
                      </span>
                    </td>
                    <td>{entry.reason}</td>
                    <td>{formatFlaggedDate(entry.startedAt)}</td>
                    <td>{entry.endedAt ? formatFlaggedDate(entry.endedAt) : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="store-detail__section">
        <h3 className="store-detail__section-title">Flag History</h3>
        {profile.flagHistory.length === 0 ? (
          <p className="store-detail__empty">No flag history available for this site.</p>
        ) : (
          <div className="detail-view__table-wrap">
            <table className="detail-view__table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Category</th>
                  <th scope="col">Event</th>
                  <th scope="col">Details</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {profile.flagHistory.map((flag) => (
                  <tr key={`${flag.category}-${flag.title}-${flag.date}-${flag.active}`}>
                    <td>{formatFlaggedDate(flag.date)}</td>
                    <td>{getCategoryLabel(flag.category)}</td>
                    <td>{flag.title}</td>
                    <td>{flag.detail}</td>
                    <td>{flag.active ? 'Active' : 'Resolved'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="store-detail__info-item">
      <span className="store-detail__info-label">{label}</span>
      <span className="store-detail__info-value">{value}</span>
    </div>
  )
}
