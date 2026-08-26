import { useEffect, useState } from 'react'
import {
  getCategoryLabel,
  getStatusLabel,
  getStoreProfile,
} from '../data/storeProfile'
import { formatFlaggedDate } from '../utils/formatDate'
import { AssetTrackingPanel } from './AssetTrackingPanel'
import { AcceptanceTestsPanel } from './AcceptanceTestsPanel'

type StoreDetailTab = 'overview' | 'asset-tracking' | 'acceptance-tests'

interface StoreDetailViewProps {
  storeId: string
  onBack: () => void
  backLabel?: string
}

export function StoreDetailView({ storeId, onBack, backLabel = 'Dashboard' }: StoreDetailViewProps) {
  const [activeTab, setActiveTab] = useState<StoreDetailTab>('overview')
  const profile = getStoreProfile(storeId)

  useEffect(() => {
    setActiveTab('overview')
  }, [storeId])

  if (!profile) {
    return (
      <main className="store-detail">
        <button type="button" className="detail-view__back" onClick={onBack}>
          ← Back to {backLabel}
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
          ← Back to {backLabel}
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

      <div className="store-detail__tabs" role="tablist" aria-label="Site detail sections">
        <button
          type="button"
          role="tab"
          id="store-tab-overview"
          aria-selected={activeTab === 'overview'}
          aria-controls="store-panel-overview"
          className={`store-detail__tab${activeTab === 'overview' ? ' store-detail__tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          role="tab"
          id="store-tab-asset-tracking"
          aria-selected={activeTab === 'asset-tracking'}
          aria-controls="store-panel-asset-tracking"
          className={`store-detail__tab${
            activeTab === 'asset-tracking' ? ' store-detail__tab--active' : ''
          }`}
          onClick={() => setActiveTab('asset-tracking')}
        >
          Asset Tracking
        </button>
        <button
          type="button"
          role="tab"
          id="store-tab-acceptance-tests"
          aria-selected={activeTab === 'acceptance-tests'}
          aria-controls="store-panel-acceptance-tests"
          className={`store-detail__tab${
            activeTab === 'acceptance-tests' ? ' store-detail__tab--active' : ''
          }`}
          onClick={() => setActiveTab('acceptance-tests')}
        >
          Acceptance Tests
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div
          id="store-panel-overview"
          role="tabpanel"
          aria-labelledby="store-tab-overview"
          className="store-detail__panel"
        >
          <section className="store-detail__section">
            <h3 className="store-detail__section-title">Overall Site Info</h3>
            <div className="store-detail__info-grid">
              <InfoItem
                label="FireConnect Device ID"
                value={profile.overallInfo.fireconnectDeviceId}
              />
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
        </div>
      ) : null}

      {activeTab === 'asset-tracking' ? (
        <div
          id="store-panel-asset-tracking"
          role="tabpanel"
          aria-labelledby="store-tab-asset-tracking"
          className="store-detail__panel"
        >
          <AssetTrackingPanel storeId={profile.storeId} enabled />
        </div>
      ) : null}

      {activeTab === 'acceptance-tests' ? (
        <div
          id="store-panel-acceptance-tests"
          role="tabpanel"
          aria-labelledby="store-tab-acceptance-tests"
          className="store-detail__panel"
        >
          <AcceptanceTestsPanel storeId={profile.storeId} enabled />
        </div>
      ) : null}
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
