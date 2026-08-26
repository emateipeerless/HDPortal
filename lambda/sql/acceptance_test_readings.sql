-- Live shape: one wide row per store (not one row per test point).

CREATE TABLE IF NOT EXISTS datastorage.acceptance_test_readings (
  store_number TEXT PRIMARY KEY
    REFERENCES datastorage.acceptance_tests (store_number),
  -- Churn (0%)
  churn_speed_rpm NUMERIC,
  churn_suction_psi NUMERIC,
  churn_discharge_psi NUMERIC,
  churn_flow_gpm NUMERIC NOT NULL DEFAULT 0,
  -- Rated (100%)
  rated_speed_rpm NUMERIC,
  rated_suction_psi NUMERIC,
  rated_discharge_psi NUMERIC,
  rated_flow_gpm NUMERIC,
  -- Overflow (150%)
  overflow_speed_rpm NUMERIC,
  overflow_suction_psi NUMERIC,
  overflow_discharge_psi NUMERIC,
  overflow_flow_gpm NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
