-- ==============================================================================
-- AI Banking Financial Intelligence - PostgreSQL Performance Indexes
-- Designed for high-frequency filtering across multi-year banking returns
-- ==============================================================================

-- 1. Fact District Credit Deposit Indexes
CREATE INDEX IF NOT EXISTS idx_fact_district_period ON fact_district_credit_deposit(period_id);
CREATE INDEX IF NOT EXISTS idx_fact_district_geo ON fact_district_credit_deposit(geo_id);
CREATE INDEX IF NOT EXISTS idx_fact_district_bank_group ON fact_district_credit_deposit(bank_group);
CREATE INDEX IF NOT EXISTS idx_fact_district_pop_group ON fact_district_credit_deposit(population_group);
CREATE INDEX IF NOT EXISTS idx_fact_district_cd_ratio ON fact_district_credit_deposit(cd_ratio);

-- Composite Index for State/Period aggregations
CREATE INDEX IF NOT EXISTS idx_fact_dist_geo_period ON fact_district_credit_deposit(geo_id, period_id);

-- 2. Fact Bank Performance Indexes
CREATE INDEX IF NOT EXISTS idx_fact_bank_id ON fact_bank_performance(bank_id);
CREATE INDEX IF NOT EXISTS idx_fact_bank_period ON fact_bank_performance(period_id);
CREATE INDEX IF NOT EXISTS idx_fact_bank_gnpa_ratio ON fact_bank_performance(gnpa_ratio_pct);
CREATE INDEX IF NOT EXISTS idx_fact_bank_roa ON fact_bank_performance(return_on_assets_pct);

-- 3. Dimension Indexes
CREATE INDEX IF NOT EXISTS idx_dim_geo_state ON dim_geography(state_name);
CREATE INDEX IF NOT EXISTS idx_dim_geo_region ON dim_geography(region);
CREATE INDEX IF NOT EXISTS idx_dim_bank_group ON dim_banks(bank_group);
CREATE INDEX IF NOT EXISTS idx_dim_period_fy ON dim_periods(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_dim_period_quarter ON dim_periods(quarter_code);

-- 4. Anomaly Audit Log Indexes
CREATE INDEX IF NOT EXISTS idx_anomaly_severity ON anomaly_audit_log(severity);
CREATE INDEX IF NOT EXISTS idx_anomaly_metric ON anomaly_audit_log(metric_name);
CREATE INDEX IF NOT EXISTS idx_anomaly_period ON anomaly_audit_log(period_code);
