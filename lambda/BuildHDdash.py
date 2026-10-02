import os
import json
import psycopg2
import urllib.request
from zoneinfo import ZoneInfo
from datetime import datetime

devicesr = [18957, 18972, 19204, 18859, 19203]
devices = [
    18972, 19204, 19158, 19203, 18957, 18859, 19232, 18787, 19208, 19082,
    18960, 18952, 18964, 19209, 18761, 18793, 18771, 18955, 19183, 18940,
    19206, 19075, 18768, 18967, 18785, 18867, 19148, 19186, 19192, 18987,
    19066, 18942, 18790, 18968, 19073, 18822, 18947, 18937, 19162, 18932,
    19227
]

# Schema was created as "HDdata" (quoted, case-sensitive).
INSERT_DASHBOARD_SQL = """
    INSERT INTO "HDdata".hddashboard (
        timestamps,
        device_id,
        pump_type,
        jock1m,
        jock2m,
        batt1v,
        batt2v,
        l1v,
        l2v,
        l3v
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# "Timestamps" is quoted so Postgres keeps that casing.
INSERT_RUN_SQL = """
    INSERT INTO "HDdata".hdruns (
        "Timestamps",
        device_id,
        durationsec
    )
    SELECT %s, %s, %s
    WHERE NOT EXISTS (
        SELECT 1
        FROM "HDdata".hdruns
        WHERE device_id = %s
          AND "Timestamps" = %s
    )
"""


def subtract_six_months(source_date):
    """
    Safely rolls back exactly 6 calendar months without external dependencies,
    handling year transitions and month day mismatches (e.g., Aug 31 -> Feb 28).
    """
    month = source_date.month - 6
    year = source_date.year
    if month <= 0:
        month += 12
        year -= 1

    day = source_date.day
    while True:
        try:
            return datetime(
                year,
                month,
                day,
                source_date.hour,
                source_date.minute,
                source_date.second,
                tzinfo=source_date.tzinfo,
            )
        except ValueError:
            day -= 1


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


def to_float(value):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def post_json(url, payload, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"token:{token}"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))


def jockey_months(jockey_post):
    """
    Last six monthly buckets, oldest first — same order as the previous JSON
    fields JockeyM1..JockeyM6. Only the first two are stored (jock1m, jock2m).
    """
    if not isinstance(jockey_post, dict) or not jockey_post:
        return None, None

    sorted_keys = sorted(jockey_post.keys())
    target_months = sorted_keys[-6:]
    values = []
    for month in target_months:
        bucket = jockey_post.get(month)
        if isinstance(bucket, list) and bucket:
            values.append(to_float(bucket[0]))
        else:
            values.append(to_float(bucket))

    jock1m = values[0] if len(values) > 0 else None
    jock2m = values[1] if len(values) > 1 else None
    return jock1m, jock2m


def pair_main_runs(main_post):
    """Pair each Engine Run with the next Engine Stopped and return (start, seconds)."""
    if not isinstance(main_post, list):
        return []

    start_time = None
    time_format = "%Y-%m-%d %H:%M:%S"
    runs = []
    for log in sorted(main_post, key=lambda item: item.get("Time") or ""):
        raw_time = log.get("Time")
        if not raw_time:
            continue
        try:
            event_time = datetime.strptime(raw_time, time_format)
        except (TypeError, ValueError):
            continue

        event_name = log.get("EventName")
        if event_name == "Engine Run":
            start_time = event_time
        elif event_name == "Engine Stopped" and start_time is not None:
            duration_seconds = int((event_time - start_time).total_seconds())
            if duration_seconds >= 0:
                runs.append((start_time, duration_seconds))
            start_time = None
    return runs


def insert_dashboard_row(cursor, row):
    cursor.execute(
        INSERT_DASHBOARD_SQL,
        (
            row["timestamps"],
            row["device_id"],
            row["pump_type"],
            row["jock1m"],
            row["jock2m"],
            row["batt1v"],
            row["batt2v"],
            row["l1v"],
            row["l2v"],
            row["l3v"],
        ),
    )


def insert_run_rows(cursor, device_id, runs):
    inserted = 0
    for started_at, duration_seconds in runs:
        cursor.execute(
            INSERT_RUN_SQL,
            (started_at, device_id, duration_seconds, device_id, started_at),
        )
        inserted += cursor.rowcount
    return inserted


def lambda_handler(event, context):
    pump_types = []
    utc_now = datetime.now(ZoneInfo("UTC"))

    post_url = "https://ami-central.com:1985/MBService/Login"
    jockey_url = "https://ami-central.com:1985/MBService/GetAccumulationPointsData"
    sysinfo_url = "https://ami-central.com:1985/MBService/GetFireConnectSysInfo"
    registers_url = "https://ami-central.com:1985/MBService/GetLoggedRegisterValuesByName"
    eventlog_url = "https://ami-central.com:1985/MBService/GetPointsEventLogData"

    try:
        post_data = post_json(
            post_url,
            {"username": "ematei@peerlesspump.com", "password": "Cashwasadog15@"},
        )
        token = post_data.get("token")
    except Exception as e:
        print(f"Error logging in: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "AMI login failed", "detail": str(e)}),
        }

    if not token:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "AMI login did not return a token"}),
        }

    try:
        ptp_post = post_json(sysinfo_url, devices, token=token)
        for item in ptp_post:
            pump_types.append(item.get("PumpType"))
    except Exception as e:
        print(f"Error reading pump types: {e}")

    try:
        conn = get_db_connection()
    except Exception as e:
        print(f"Database connection failed: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Database connection failed", "detail": str(e)}),
        }

    saved = []
    failed = []
    runs_saved = 0
    six_months_ago = subtract_six_months(utc_now)
    from_date = six_months_ago.strftime("%Y-%m-01 00:00:00")
    to_date = utc_now.strftime("%Y-%m-%d %H:%M:%S")

    try:
        with conn.cursor() as cursor:
            for inc, device in enumerate(devices):
                pump_type = pump_types[inc] if inc < len(pump_types) else None
                row = {
                    "timestamps": utc_now,
                    "device_id": device,
                    "pump_type": pump_type,
                    "jock1m": None,
                    "jock2m": None,
                    "batt1v": None,
                    "batt2v": None,
                    "l1v": None,
                    "l2v": None,
                    "l3v": None,
                }

                try:
                    jockey_post = post_json(
                        jockey_url,
                        {
                            "DeviceID": device,
                            "FromDate": from_date,
                            "ToDate": to_date,
                            "TimePeriod": 4,
                            "PointNames": ["Jockey Starts"],
                        },
                        token=token,
                    )
                    row["jock1m"], row["jock2m"] = jockey_months(jockey_post)
                except Exception as e:
                    print(f"Error reading jockey data for device {device}: {e}")

                device_runs = []
                try:
                    main_post = post_json(
                        eventlog_url,
                        {
                            "DeviceID": device,
                            "FromDate": from_date,
                            "ToDate": to_date,
                            "PostData": [
                                {"Name": "Pump Run", "ReferenceItem": "Engine Run"},
                                {"Name": "Pump Run", "ReferenceItem": "Engine Stopped"},
                            ],
                        },
                        token=token,
                    )
                    device_runs = pair_main_runs(main_post)
                except Exception as e:
                    print(f"Error compiling events for device {device}: {e}")

                try:
                    if pump_type == "Electric":
                        registers = post_json(
                            registers_url,
                            {
                                "DeviceID": device,
                                "Registers": [
                                    "gd_Voltage Phase A",
                                    "gd_Voltage Phase B",
                                    "gd_Voltage Phase C",
                                ],
                            },
                            token=token,
                        )
                        phase_values = {
                            item["PointName"]: item["Value"] for item in registers
                        }
                        row["l1v"] = to_float(phase_values.get("gd_Voltage Phase A"))
                        row["l2v"] = to_float(phase_values.get("gd_Voltage Phase B"))
                        row["l3v"] = to_float(phase_values.get("gd_Voltage Phase C"))
                    elif pump_type == "Diesel":
                        registers = post_json(
                            registers_url,
                            {
                                "DeviceID": device,
                                "Registers": ["gd_Battery #1 VDC", "gd_Battery #2 VDC"],
                            },
                            token=token,
                        )
                        volt_values = {
                            item["PointName"]: item["Value"] for item in registers
                        }
                        batt1 = to_float(volt_values.get("gd_Battery #1 VDC"))
                        batt2 = to_float(volt_values.get("gd_Battery #2 VDC"))
                        row["batt1v"] = None if batt1 is None else batt1 / 10
                        row["batt2v"] = None if batt2 is None else batt2 / 10
                except Exception as e:
                    print(f"Error reading registers for device {device}: {e}")

                try:
                    inserted_runs = insert_run_rows(cursor, device, device_runs)
                    insert_dashboard_row(cursor, row)
                    conn.commit()
                    runs_saved += inserted_runs
                    saved.append(device)
                    print(f"Device {device} saved {inserted_runs} new main runs")
                except Exception as e:
                    conn.rollback()
                    print(f"Error saving device {device}: {e}")
                    failed.append({"device": device, "error": str(e)})
    finally:
        conn.close()

    status = 200 if saved else 500
    return {
        "statusCode": status,
        "body": json.dumps(
            {
                "savedCount": len(saved),
                "savedDevices": saved,
                "runsSaved": runs_saved,
                "failed": failed,
            }
        ),
    }
