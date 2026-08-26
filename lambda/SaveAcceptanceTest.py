"""
Create or update acceptance test header + readings for a Home Depot store.

Runs in one DB transaction:
  1) UPSERT datastorage.acceptance_tests (PK store_number)
  2) UPSERT datastorage.acceptance_test_readings (PK store_number, wide churn/rated/overflow cols)
  3) Return the saved bundle (same shape as GetAcceptanceTest)

API: POST /saveacceptancetest
Body: {
  "storeNumber": "0289",
  "acceptanceTest": { "storeNumber": "0289", "city": "Pinellas Park", ... },
  "readings": {
    "churn": { "speedRpm": 1750, "suctionPsi": 20, "dischargePsi": 100, "flowGpm": 0 },
    "rated": { "speedRpm": 1750, "suctionPsi": 18, "dischargePsi": 95, "flowGpm": 1000 },
    "overflow": { "speedRpm": 1750, "suctionPsi": 15, "dischargePsi": 80, "flowGpm": 1500 }
  }
}

Top-level camelCase fields are also accepted (same keys as acceptanceTest).
"""

from __future__ import annotations

from typing import Any

from acceptance_test_shared import (
    ACCEPTANCE_READINGS_TABLE,
    ACCEPTANCE_TESTS_TABLE,
    HEADER_WRITE_COLUMNS,
    READING_WRITE_COLUMNS,
    build_header_values,
    build_reading_values,
    error_response,
    fetch_acceptance_bundle_by_store,
    get_db_connection,
    logger,
    options_response,
    parse_event_payload,
    parse_store_number,
    success_response,
)
from psycopg2.extras import RealDictCursor


def save_acceptance_test(payload: dict[str, Any]) -> dict[str, Any]:
    store_number = parse_store_number(payload)
    header_values = build_header_values(store_number, payload)
    reading_values = build_reading_values(store_number, payload)

    insert_columns = ["store_number", *HEADER_WRITE_COLUMNS]
    insert_placeholders = ", ".join(["%s"] * len(insert_columns))
    update_assignments = ", ".join(
        [f"{col} = EXCLUDED.{col}" for col in HEADER_WRITE_COLUMNS]
        + ["updated_at = NOW()"]
    )
    insert_sql = f"""
        INSERT INTO {ACCEPTANCE_TESTS_TABLE} ({", ".join(insert_columns)})
        VALUES ({insert_placeholders})
        ON CONFLICT (store_number) DO UPDATE SET
            {update_assignments}
        RETURNING *
    """
    insert_params = [
        header_values["store_number"],
        *[header_values[col] for col in HEADER_WRITE_COLUMNS],
    ]

    reading_columns = ["store_number", *READING_WRITE_COLUMNS]
    reading_placeholders = ", ".join(["%s"] * len(reading_columns))
    reading_updates = ", ".join(
        [f"{col} = EXCLUDED.{col}" for col in READING_WRITE_COLUMNS] + ["updated_at = NOW()"]
    )
    reading_sql = f"""
        INSERT INTO {ACCEPTANCE_READINGS_TABLE} ({", ".join(reading_columns)})
        VALUES ({reading_placeholders})
        ON CONFLICT (store_number) DO UPDATE SET
            {reading_updates}
    """
    reading_params = [
        reading_values["store_number"],
        *[reading_values[col] for col in READING_WRITE_COLUMNS],
    ]

    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(insert_sql, insert_params)
            cur.fetchone()
            cur.execute(reading_sql, reading_params)
            conn.commit()

    result = fetch_acceptance_bundle_by_store(store_number)
    result["message"] = f"Acceptance test saved for store {store_number}."
    return result


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    if event.get("httpMethod") == "OPTIONS":
        return options_response()

    try:
        payload = parse_event_payload(event)
        result = save_acceptance_test(payload)
        return success_response(result)
    except ValueError as exc:
        logger.warning("Bad request: %s", exc)
        return error_response(400, str(exc))
    except Exception:
        logger.exception("Unhandled error saving acceptance test")
        return error_response(500, "Internal server error")
