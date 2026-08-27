import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { AcceptanceTestReadings } from '../api/acceptanceTest'

type FieldType = 'text' | 'date' | 'number'

interface FormField {
  name: string
  label: string
  type: FieldType
}

interface FormSection {
  title: string
  fields: FormField[]
}

export const ACCEPTANCE_FORM_SECTIONS: FormSection[] = [
  {
    title: 'Site Information',
    fields: [
      { name: 'storeNumber', label: 'Store #', type: 'text' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'state', label: 'State', type: 'text' },
    ],
  },
  {
    title: 'Acceptance Test',
    fields: [{ name: 'acceptanceTestDate', label: 'Acceptance Test Date', type: 'date' }],
  },
  {
    title: 'Pump Information',
    fields: [
      { name: 'pumpMake', label: 'Pump Make', type: 'text' },
      { name: 'pumpType', label: 'Pump Type', type: 'text' },
      { name: 'pumpPosition', label: 'Pump Position', type: 'text' },
      { name: 'pumpModel', label: 'Pump Model', type: 'text' },
      { name: 'pumpSerial', label: 'Pump Serial', type: 'text' },
      { name: 'pumpRatedGpm', label: 'Pump Rated GPM', type: 'number' },
      { name: 'pumpRatedRpm', label: 'Pump Rated RPM', type: 'number' },
      { name: 'pumpRatedPsi', label: 'Pump Rated PSI', type: 'number' },
      { name: 'pumpSuction', label: 'Pump Suction', type: 'text' },
    ],
  },
  {
    title: 'Driver Information',
    fields: [
      { name: 'driverType', label: 'Driver Type', type: 'text' },
      { name: 'driverManufacturer', label: 'Driver Manufacturer', type: 'text' },
      { name: 'driverSerial', label: 'Driver Serial', type: 'text' },
      { name: 'driverModel', label: 'Driver Model', type: 'text' },
      { name: 'driverRatedHp', label: 'Driver Rated HP', type: 'number' },
      { name: 'driverRatedRpm', label: 'Driver Rated RPM', type: 'number' },
    ],
  },
  {
    title: 'Controller Information',
    fields: [
      { name: 'controllerManufacturer', label: 'Controller Manufacturer', type: 'text' },
      { name: 'controllerModel', label: 'Controller Model', type: 'text' },
      { name: 'controllerSerial', label: 'Controller Serial', type: 'text' },
      { name: 'startPsi', label: 'Start PSI', type: 'number' },
      { name: 'startMethod', label: 'Start Method', type: 'text' },
      { name: 'transferSwitch', label: 'Transfer Switch', type: 'text' },
      { name: 'upstreamDisconnect', label: 'Upstream Disconnect', type: 'text' },
    ],
  },
  {
    title: 'Jockey Pump Information',
    fields: [
      { name: 'jockeyPumpManufacturer', label: 'Jockey Pump Manufacturer', type: 'text' },
      { name: 'jockeyPumpSize', label: 'Jockey Pump Size', type: 'text' },
      { name: 'jockeyPumpVoltage', label: 'Jockey Pump Voltage', type: 'number' },
      { name: 'jockeyPumpHp', label: 'Jockey Pump HP', type: 'number' },
    ],
  },
]

export const TEST_POINTS = [
  { key: 'churn', label: 'Churn (0%)' },
  { key: 'rated', label: 'Rated (100%)' },
  { key: 'overflow', label: 'Overflow (150%)' },
] as const

export const TEST_METRICS = [
  { key: 'speedRpm', label: 'Speed (RPM)' },
  { key: 'suctionPsi', label: 'Suction (PSI)' },
  { key: 'dischargePsi', label: 'Discharge (PSI)' },
  { key: 'flowGpm', label: 'Flow (GPM)' },
] as const

type TestPointKey = (typeof TEST_POINTS)[number]['key']
type TestMetricKey = (typeof TEST_METRICS)[number]['key']
type FormValues = Record<string, string>
/** UI grid shape: metric → point → value */
type GridReadings = Record<TestMetricKey, Record<TestPointKey, string>>

function createEmptyValues(): FormValues {
  return ACCEPTANCE_FORM_SECTIONS.flatMap((section) => section.fields).reduce<FormValues>(
    (values, field) => {
      values[field.name] = ''
      return values
    },
    {},
  )
}

function isFixedReading(metricKey: TestMetricKey, pointKey: TestPointKey): boolean {
  return metricKey === 'flowGpm' && pointKey === 'churn'
}

function createInitialGridReadings(): GridReadings {
  return TEST_METRICS.reduce((readings, metric) => {
    readings[metric.key] = TEST_POINTS.reduce(
      (points, point) => {
        points[point.key] = isFixedReading(metric.key, point.key) ? '0' : ''
        return points
      },
      {} as Record<TestPointKey, string>,
    )
    return readings
  }, {} as GridReadings)
}

export function parseLocation(location: string): { city: string; state: string } {
  const parts = location.trim().split(/\s+/)
  if (parts.length < 2) return { city: location, state: '' }
  const state = parts[parts.length - 1] ?? ''
  const city = parts.slice(0, -1).join(' ')
  return { city, state }
}

function gridToApiReadings(grid: GridReadings): AcceptanceTestReadings {
  return TEST_POINTS.reduce((readings, point) => {
    readings[point.key] = {
      speedRpm: grid.speedRpm[point.key],
      suctionPsi: grid.suctionPsi[point.key],
      dischargePsi: grid.dischargePsi[point.key],
      flowGpm: point.key === 'churn' ? '0' : grid.flowGpm[point.key],
    }
    return readings
  }, {} as AcceptanceTestReadings)
}

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

interface AcceptanceTestFormProps {
  storeId: string
  location: string
  fireconnectDeviceId: string
  saving?: boolean
  errorMessage?: string | null
  onSave: (input: {
    acceptanceTest: Record<string, string>
    readings: AcceptanceTestReadings
  }) => Promise<void> | void
}

export function AcceptanceTestForm({
  storeId,
  location,
  fireconnectDeviceId,
  saving = false,
  errorMessage = null,
  onSave,
}: AcceptanceTestFormProps) {
  const { city, state } = parseLocation(location)
  const [formValues, setFormValues] = useState<FormValues>(() => ({
    ...createEmptyValues(),
    storeNumber: storeId,
    city,
    state,
  }))
  const [testReadings, setTestReadings] = useState<GridReadings>(createInitialGridReadings)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  function handleTestReadingChange(metricKey: TestMetricKey, pointKey: TestPointKey, value: string) {
    setTestReadings((current) => ({
      ...current,
      [metricKey]: {
        ...current[metricKey],
        [pointKey]: value,
      },
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSave({
      acceptanceTest: formValues,
      readings: gridToApiReadings(testReadings),
    })
  }

  return (
    <div className="acceptance-form">
      <div className="acceptance-form__intro">
        <h3 className="acceptance-form__title">Acceptance Test / Asset Tracking</h3>
        <p className="acceptance-form__subtitle">
          Enter site, pump, driver, controller, jockey pump, and test reading details for FireConnect
          device {fireconnectDeviceId}.
        </p>
      </div>

      <form className="acceptance-form__form" onSubmit={handleSubmit}>
        {ACCEPTANCE_FORM_SECTIONS.map((section) => (
          <section key={section.title} className="acceptance-form__card">
            <h4 className="acceptance-form__card-title">{section.title}</h4>
            <div
              className={`acceptance-form__field-grid${
                section.fields.length === 1 ? ' acceptance-form__field-grid--single' : ''
              }`}
            >
              {section.fields.map((field) => (
                <label key={field.name} className="acceptance-form__field">
                  <span>{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formValues[field.name] ?? ''}
                    onChange={handleChange}
                    autoComplete="off"
                    disabled={saving}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}

        <section className="acceptance-form__card">
          <h4 className="acceptance-form__card-title">Acceptance Test Readings</h4>
          <div className="acceptance-form__readings-wrap">
            <table className="acceptance-form__readings">
              <thead>
                <tr>
                  <th scope="col">Measurement</th>
                  {TEST_POINTS.map((point) => (
                    <th key={point.key} scope="col">
                      {point.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEST_METRICS.map((metric) => (
                  <tr key={metric.key}>
                    <th scope="row">{metric.label}</th>
                    {TEST_POINTS.map((point) => (
                      <td key={point.key}>
                        {isFixedReading(metric.key, point.key) ? (
                          <span className="acceptance-form__fixed-reading">0</span>
                        ) : (
                          <input
                            type="number"
                            inputMode="decimal"
                            name={`${metric.key}_${point.key}`}
                            aria-label={`${metric.label} ${point.label}`}
                            value={testReadings[metric.key][point.key]}
                            onChange={(event) =>
                              handleTestReadingChange(metric.key, point.key, event.target.value)
                            }
                            autoComplete="off"
                            disabled={saving}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {errorMessage ? <p className="acceptance-form__error">{errorMessage}</p> : null}

        <div className="acceptance-form__actions">
          <button type="submit" className="acceptance-form__save" disabled={saving}>
            {saving ? 'Saving…' : 'Save form'}
          </button>
        </div>
      </form>
    </div>
  )
}

interface AssetTrackingSavedViewProps {
  storeNumber: string
  fireconnectDeviceId?: string | null
  acceptanceTest: Record<string, string | number | null | undefined>
}

const ASSET_TRACKING_SECTIONS = ACCEPTANCE_FORM_SECTIONS.filter(
  (section) => section.title !== 'Acceptance Test',
)

export function AssetTrackingSavedView({
  storeNumber,
  fireconnectDeviceId,
  acceptanceTest,
}: AssetTrackingSavedViewProps) {
  const deviceLabel = fireconnectDeviceId ? ` · FireConnect ${fireconnectDeviceId}` : ''

  return (
    <div className="acceptance-form">
      <div className="acceptance-form__intro">
        <h3 className="acceptance-form__title">Asset Tracking</h3>
        <p className="acceptance-form__subtitle">
          Saved asset information for store {storeNumber}
          {deviceLabel}.
        </p>
      </div>

      {ASSET_TRACKING_SECTIONS.map((section) => (
        <section key={section.title} className="acceptance-form__card">
          <h4 className="acceptance-form__card-title">{section.title}</h4>
          <div
            className={`acceptance-form__field-grid${
              section.fields.length === 1 ? ' acceptance-form__field-grid--single' : ''
            }`}
          >
            {section.fields.map((field) => (
              <div key={field.name} className="acceptance-form__field">
                <span>{field.label}</span>
                <div className="acceptance-form__readonly">
                  {displayValue(acceptanceTest[field.name])}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

interface AcceptanceTestsSavedViewProps {
  storeNumber: string
  acceptanceTestDate?: string | number | null
  readings: AcceptanceTestReadings
}

export function AcceptanceTestsSavedView({
  storeNumber,
  acceptanceTestDate,
  readings,
}: AcceptanceTestsSavedViewProps) {
  return (
    <div className="acceptance-form">
      <div className="acceptance-form__intro">
        <h3 className="acceptance-form__title">Acceptance Tests</h3>
        <p className="acceptance-form__subtitle">
          Acceptance test date and readings for store {storeNumber}.
        </p>
      </div>

      <section className="acceptance-form__card">
        <h4 className="acceptance-form__card-title">Acceptance Test</h4>
        <div className="acceptance-form__field-grid acceptance-form__field-grid--single">
          <div className="acceptance-form__field">
            <span>Acceptance Test Date</span>
            <div className="acceptance-form__readonly">{displayValue(acceptanceTestDate)}</div>
          </div>
        </div>
      </section>

      <section className="acceptance-form__card">
        <h4 className="acceptance-form__card-title">Acceptance Test Data</h4>
        <div className="acceptance-form__readings-wrap">
          <table className="acceptance-form__readings">
            <thead>
              <tr>
                <th scope="col">Measurement</th>
                {TEST_POINTS.map((point) => (
                  <th key={point.key} scope="col">
                    {point.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEST_METRICS.map((metric) => (
                <tr key={metric.key}>
                  <th scope="row">{metric.label}</th>
                  {TEST_POINTS.map((point) => (
                    <td key={point.key}>
                      <span className="acceptance-form__fixed-reading">
                        {displayValue(readings[point.key]?.[metric.key])}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
