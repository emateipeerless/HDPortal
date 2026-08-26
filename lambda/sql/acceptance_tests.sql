-- Header table: one row per Home Depot store.

DROP TABLE IF EXISTS datastorage.acceptance_test_readings;
DROP TABLE IF EXISTS datastorage.acceptance_tests;

CREATE TABLE datastorage.acceptance_tests (
  store_number TEXT PRIMARY KEY,
  city TEXT,
  state TEXT,
  acceptance_test_date DATE,
  pump_make TEXT,
  pump_type TEXT,
  pump_position TEXT,
  pump_model TEXT,
  pump_serial TEXT,
  pump_rated_gpm NUMERIC,
  pump_rated_rpm NUMERIC,
  pump_rated_psi NUMERIC,
  pump_suction TEXT,
  driver_type TEXT,
  driver_manufacturer TEXT,
  driver_serial TEXT,
  driver_model TEXT,
  driver_rated_hp NUMERIC,
  driver_rated_rpm NUMERIC,
  controller_manufacturer TEXT,
  controller_model TEXT,
  controller_serial TEXT,
  start_psi NUMERIC,
  start_method TEXT,
  transfer_switch TEXT,
  upstream_disconnect TEXT,
  jockey_pump_manufacturer TEXT,
  jockey_pump_type TEXT,
  jockey_pump_size TEXT,
  jockey_pump_voltage NUMERIC,
  jockey_pump_amps NUMERIC,
  jockey_pump_hp NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
