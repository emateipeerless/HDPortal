"""
Shared helpers for acceptance test Get/Save Lambdas.

Tables (schema datastorage):
  - acceptance_tests          (header / asset fields, PK store_number)
  - acceptance_test_readings  (one wide row per store_number: churn_*/rated_*/overflow_*)
"""

from __future__ import annotations

import json
import logging
import os
from datetime import date, datetime
from decimal import Decimal
from typing import Any

import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ACCEPTANCE_TESTS_TABLE = os.environ.get(
    "ACCEPTANCE_TESTS_TABLE", "datastorage.acceptance_tests"
)
ACCEPTANCE_READINGS_TABLE = os.environ.get(
    "ACCEPTANCE_READINGS_TABLE", "datastorage.acceptance_test_readings"
)

TEST_POINTS = ("churn", "rated", "overflow")

# DB column -> API / form camelCase field
HEADER_FIELD_MAP: dict[str, str] = {
    "store_number": "storeNumber",
    "city": "city",
    "state": "state",
    "acceptance_test_date": "acceptanceTestDate",
    "pump_make": "pumpMake",
    "pump_type": "pumpType",
    "pump_position": "pumpPosition",
    "pump_model": "pumpModel",
    "pump_serial": "pumpSerial",
    "pump_rated_gpm": "pumpRatedGpm",
    "pump_rated_rpm": "pumpRatedRpm",
    "pump_rated_psi": "pumpRatedPsi",
    "pump_suction": "pumpSuction",
    "driver_type": "driverType",
    "driver_manufacturer": "driverManufacturer",
    "driver_serial": "driverSerial",
    "driver_model": "driverModel",
    "driver_rated_hp": "driverRatedHp",
    "driver_rated_rpm": "driverRatedRpm",
    "controller_manufacturer": "controllerManufacturer",
    "controller_model": "controllerModel",
    "controller_serial": "controllerSerial",
    "start_psi": "startPsi",
    "start_method": "startMethod",
    "transfer_switch": "transferSwitch",
    "upstream_disconnect": "upstreamDisconnect",
    "jockey_pump_manufacturer": "jockeyPumpManufacturer",
    "jockey_pump_type": "jockeyPumpType",
    "jockey_pump_size": "jockeyPumpSize",
    "jockey_pump_voltage": "jockeyPumpVoltage",
    "jockey_pump_amps": "jockeyPumpAmps",
    "jockey_pump_hp": "jockeyPumpHp",
    "created_at": "createdAt",
    "updated_at": "updatedAt",
}

HEADER_API_TO_DB = {api: db for db, api in HEADER_FIELD_MAP.items()}

# Writable header columns (PK store_number + timestamps handled separately)
HEADER_WRITE_COLUMNS = [
    "city",
    "state",
    "acceptance_test_date",
    "pump_make",
    "pump_type",
    "pump_position",
    "pump_model",
    "pump_serial",
    "pump_rated_gpm",
    "pump_rated_rpm",
    "pump_rated_psi",
    "pump_suction",
    "driver_type",
    "driver_manufacturer",
    "driver_serial",
    "driver_model",
    "driver_rated_hp",
    "driver_rated_rpm",
    "controller_manufacturer",
    "controller_model",
    "controller_serial",
    "start_psi",
    "start_method",
    "transfer_switch",
    "upstream_disconnect",
    "jockey_pump_manufacturer",
    "jockey_pump_type",
    "jockey_pump_size",
    "jockey_pump_voltage",
    "jockey_pump_amps",
    "jockey_pump_hp",
]

NUMERIC_HEADER_COLUMNS = {
    "pump_rated_gpm",
    "pump_rated_rpm",
    "pump_rated_psi",
    "driver_rated_hp",
    "driver_rated_rpm",
    "start_psi",
    "jockey_pump_voltage",
    "jockey_pump_amps",
    "jockey_pump_hp",
}

# API metric keys used by the UI grid
READING_METRICS = ("speedRpm", "suctionPsi", "dischargePsi", "flowGpm")

# Wide-table DB columns <-> (test_point, api metric)
READING_COLUMN_MAP: dict[str, tuple[str, str]] = {
    "churn_speed_rpm": ("churn", "speedRpm"),
    "churn_suction_psi": ("churn", "suctionPsi"),
    "churn_discharge_psi": ("churn", "dischargePsi"),
    "churn_flow_gpm": ("churn", "flowGpm"),
    "rated_speed_rpm": ("rated", "speedRpm"),
    "rated_suction_psi": ("rated", "suctionPsi"),
    "rated_discharge_psi": ("rated", "dischargePsi"),
    "rated_flow_gpm": ("rated", "flowGpm"),
    "overflow_speed_rpm": ("overflow", "speedRpm"),
    "overflow_suction_psi": ("overflow", "suctionPsi"),
    "overflow_discharge_psi": ("overflow", "dischargePsi"),
    "overflow_flow_gpm": ("overflow", "flowGpm"),
}

READING_WRITE_COLUMNS = list(READING_COLUMN_MAP.keys())


def get_db_connection():
    host = os.environ.get("DB_HOST") or os.environ.get("DBHOST")
    dbname = os.environ.get("DB_NAME") or os.environ.get("DBNAME")
    user = os.environ.get("DB_USER") or os.environ.get("DBUSER")
    password = os.environ.get("DB_PASSWORD") or os.environ.get("DBPASS")

    if not all([host, dbname, user, password]):
        raise RuntimeError("Database environment variables are not configured")

    return psycopg2.connect(
        host=host,
        port=os.environ.get("DB_PORT", "5432"),
        dbname=dbname,
        user=user,
        password=password,
        connect_timeout=int(os.environ.get("DB_CONNECT_TIMEOUT", "5")),
    )


def parse_event_payload(event: dict[str, Any] | None) -> dict[str, Any]:
    if not event:
        raise ValueError("Missing event payload")

    payload: Any = event
    if event.get("body") is not None:
        body = event["body"]
        payload = json.loads(body) if isinstance(body, str) else body

    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object")

    return payload


def _store_number_from_mapping(source: dict[str, Any] | None) -> Any:
    if not isinstance(source, dict):
        return None
    return source.get(
        "storeNumber",
        source.get("store_number", source.get("storeId", source.get("store_id"))),
    )


def parse_store_number(payload: dict[str, Any]) -> str:
    raw = _store_number_from_mapping(payload)
    if raw is None or str(raw).strip() == "":
        raw = _store_number_from_mapping(payload.get("acceptanceTest"))
    if raw is None or str(raw).strip() == "":
        raise ValueError("storeNumber is required")
    return str(raw).strip()


def _serialize_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.isoformat()
        return value.isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return value


def header_row_to_api(row: dict[str, Any] | None) -> dict[str, Any] | None:
    if not row:
        return None
    return {
        HEADER_FIELD_MAP.get(key, key): _serialize_value(value)
        for key, value in row.items()
        if key in HEADER_FIELD_MAP
    }


def readings_row_to_api(row: dict[str, Any] | None) -> dict[str, dict[str, Any]] | None:
    """
    Wide DB row -> UI grid shape:
    {
      "churn": { "speedRpm": 0, "suctionPsi": ..., "dischargePsi": ..., "flowGpm": 0 },
      "rated": { ... },
      "overflow": { ... }
    }
    """
    if not row:
        return None

    result: dict[str, dict[str, Any]] = {
        point: {
            "speedRpm": None,
            "suctionPsi": None,
            "dischargePsi": None,
            "flowGpm": 0 if point == "churn" else None,
        }
        for point in TEST_POINTS
    }

    for db_col, (point, api_key) in READING_COLUMN_MAP.items():
        result[point][api_key] = _serialize_value(row.get(db_col))

    if result["churn"].get("flowGpm") in (None, ""):
        result["churn"]["flowGpm"] = 0

    return result


def empty_payload(*, store_number: str | None = None) -> dict[str, Any]:
    return {
        "success": True,
        "exists": False,
        "storeNumber": store_number,
        "acceptanceTest": None,
        "readings": None,
    }


def found_payload(
    header_row: dict[str, Any],
    reading_row: dict[str, Any] | None,
) -> dict[str, Any]:
    store_number = header_row.get("store_number")
    return {
        "success": True,
        "exists": True,
        "storeNumber": None if store_number is None else str(store_number),
        "acceptanceTest": header_row_to_api(header_row),
        "readings": readings_row_to_api(reading_row),
    }


def fetch_acceptance_bundle_by_store(store_number: str) -> dict[str, Any]:
    """
    Portal lookup: find acceptance data by Home Depot store number.
    200 + exists:false → show "no data yet" (form lives in the breakout app).
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                f"""
                SELECT *
                FROM {ACCEPTANCE_TESTS_TABLE}
                WHERE store_number = %s
                ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
                LIMIT 1
                """,
                (store_number,),
            )
            header = cur.fetchone()
            if not header:
                return empty_payload(store_number=store_number)

            cur.execute(
                f"""
                SELECT *
                FROM {ACCEPTANCE_READINGS_TABLE}
                WHERE store_number = %s
                """,
                (store_number,),
            )
            reading = cur.fetchone()

    return found_payload(header, reading)


def _empty_to_none(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, str) and value.strip() == "":
        return None
    return value


def _to_numeric(value: Any) -> Decimal | None:
    cleaned = _empty_to_none(value)
    if cleaned is None:
        return None
    try:
        return Decimal(str(cleaned))
    except Exception as exc:
        raise ValueError(f"Invalid numeric value: {value!r}") from exc


def _to_date(value: Any) -> date | None:
    cleaned = _empty_to_none(value)
    if cleaned is None:
        return None
    if isinstance(cleaned, date) and not isinstance(cleaned, datetime):
        return cleaned
    text = str(cleaned).strip()
    try:
        return date.fromisoformat(text[:10])
    except ValueError as exc:
        raise ValueError("acceptanceTestDate must be YYYY-MM-DD") from exc


def build_header_values(store_number: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Map API camelCase (or nested acceptanceTest) into DB column values."""
    source = payload.get("acceptanceTest")
    if not isinstance(source, dict):
        source = payload

    values: dict[str, Any] = {"store_number": store_number}
    for db_col in HEADER_WRITE_COLUMNS:
        api_key = HEADER_FIELD_MAP[db_col]
        raw = source.get(api_key, source.get(db_col))
        if db_col == "acceptance_test_date":
            values[db_col] = _to_date(raw)
        elif db_col in NUMERIC_HEADER_COLUMNS:
            values[db_col] = _to_numeric(raw)
        else:
            cleaned = _empty_to_none(raw)
            values[db_col] = str(cleaned) if cleaned is not None else None
    return values


def build_reading_values(store_number: str, payload: dict[str, Any]) -> dict[str, Any]:
    """
    API readings object -> one wide DB row:
      readings: { churn: { speedRpm, ... }, rated: {...}, overflow: {...} }
    """
    readings = payload.get("readings")
    if not isinstance(readings, dict):
        raise ValueError("readings object is required")

    values: dict[str, Any] = {"store_number": store_number}
    for db_col, (point, api_key) in READING_COLUMN_MAP.items():
        point_payload = readings.get(point)
        if not isinstance(point_payload, dict):
            raise ValueError(f"readings.{point} object is required")

        raw = point_payload.get(api_key)
        if point == "churn" and api_key == "flowGpm":
            values[db_col] = Decimal("0")
        else:
            values[db_col] = _to_numeric(raw)
    return values


def cors_headers() -> dict[str, str]:
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": os.environ.get("CORS_ALLOW_ORIGIN", "*"),
    }


def success_response(payload: dict[str, Any], status_code: int = 200) -> dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": cors_headers(),
        "body": json.dumps(payload, separators=(",", ":"), default=_serialize_value),
    }


def error_response(status_code: int, message: str) -> dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": cors_headers(),
        "body": json.dumps(
            {"success": False, "error": message},
            separators=(",", ":"),
        ),
    }


def options_response(methods: str = "POST, OPTIONS") -> dict[str, Any]:
    return {
        "statusCode": 204,
        "headers": {
            **cors_headers(),
            "Access-Control-Allow-Methods": methods,
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        "body": "",
    }
