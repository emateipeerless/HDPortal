"""
Load acceptance test + readings for a Home Depot store.

Portal pattern (optional sub-resource lookup by store number):
  POST /getacceptancetest
  Body: { "storeNumber": "0289" }

  200 + exists:true  → show saved Asset Tracking data
  200 + exists:false → show "no information yet" (entry form lives in the breakout app)

API: POST /getacceptancetest
"""

from __future__ import annotations

from typing import Any

from acceptance_test_shared import (
    error_response,
    fetch_acceptance_bundle_by_store,
    logger,
    options_response,
    parse_event_payload,
    parse_store_number,
    success_response,
)


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    if event.get("httpMethod") == "OPTIONS":
        return options_response()

    try:
        payload = parse_event_payload(event)
        store_number = parse_store_number(payload)
        result = fetch_acceptance_bundle_by_store(store_number)
        return success_response(result)
    except ValueError as exc:
        logger.warning("Bad request: %s", exc)
        return error_response(400, str(exc))
    except Exception:
        logger.exception("Unhandled error loading acceptance test")
        return error_response(500, "Internal server error")
