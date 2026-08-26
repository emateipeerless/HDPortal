# Acceptance Test Lambdas

Two API Gateway → Lambda functions back the **Asset Tracking** tab.

| Function | Route (suggested) | Purpose |
|---|---|---|
| `GetAcceptanceTest.py` | `POST /getacceptancetest` | Lookup by `storeNumber` (portal) |
| `SaveAcceptanceTest.py` | `POST /saveacceptancetest` | Upsert header + readings (breakout form app) |

## Portal vs breakout form

- **Home Depot portal** only calls **Get** with `{ "storeNumber": "0289" }`.
  - `exists: true` → show saved Asset Tracking layout
  - `exists: false` → message that no information exists yet (no form on the portal)
- **Acceptance Test breakout app** remains the place that fills and calls **Save**.

Save uses one transaction:
1. `UPSERT` `datastorage.acceptance_tests` on `store_number`
2. `UPSERT` one wide row in `datastorage.acceptance_test_readings` on `store_number` (`churn_*` / `rated_*` / `overflow_*`)
3. Re-read and return the same bundle as Get

## Env vars

Same pattern as BannerFrontend:

- `DB_HOST` / `DBHOST`
- `DB_NAME` / `DBNAME`
- `DB_USER` / `DBUSER`
- `DB_PASSWORD` / `DBPASS`
- `DB_PORT` (default `5432`)
- `CORS_ALLOW_ORIGIN` (default `*`)
- optional table overrides: `ACCEPTANCE_TESTS_TABLE`, `ACCEPTANCE_READINGS_TABLE`

## Readings table

Wide one-row-per-store layout (see `sql/acceptance_tests.sql` and `sql/acceptance_test_readings.sql`).
API still returns nested `{ churn, rated, overflow }` for the UI grid.

## Local test events

See `test_events/get_acceptance_test.json` and `save_acceptance_test.json`.
