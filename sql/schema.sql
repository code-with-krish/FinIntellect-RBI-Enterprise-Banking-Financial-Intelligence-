-- ==============================================================================
-- AI Banking Financial Intelligence - PostgreSQL Relational Database Schema
-- Reserve Bank of India (RBI) Analytical Star/Snowflake Model
-- ==============================================================================

-- 1. Dimension: Reporting Banks
CREATE TABLE IF NOT EXISTS dim_banks (
    bank_id SERIAL PRIMARY KEY,
    bank_code VARCHAR(20) UNIQUE NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    bank_group VARCHAR(80) NOT NULL, -- Public Sector, Private Sector, Foreign, RRB
    ownership_type VARCHAR(50) NOT NULL,
    established_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Dimension: Geography (States & Regions)
CREATE TABLE IF NOT EXISTS dim_geography (
    geo_id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL, -- Northern, Southern, Western, Eastern, etc.
    CONSTRAINT uq_state_district UNIQUE (state_name, district_name)
);

-- 3. Dimension: Economic Sectors
CREATE TABLE IF NOT EXISTS dim_sectors (
    sector_id SERIAL PRIMARY KEY,
    sector_name VARCHAR(120) UNIQUE NOT NULL,
    category VARCHAR(60) NOT NULL -- Priority Sector, Non-Priority, Retail, Services
);

-- 4. Dimension: Financial Reporting Periods
CREATE TABLE IF NOT EXISTS dim_periods (
    period_id SERIAL PRIMARY KEY,
    quarter_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. FY2024-Q4
    fiscal_year VARCHAR(10) NOT NULL,        -- e.g. FY2024
    quarter_number INT NOT NULL,              -- 1, 2, 3, 4
    period_end_date DATE NOT NULL
);

-- 5. Fact: Bank Balance Sheet & Asset Quality (Annual / Quarterly)
CREATE TABLE IF NOT EXISTS fact_bank_performance (
    fact_id BIGSERIAL PRIMARY KEY,
    bank_id INT REFERENCES dim_banks(bank_id),
    period_id INT REFERENCES dim_periods(period_id),
    total_deposits_crore NUMERIC(15, 2) NOT NULL,
    total_advances_crore NUMERIC(15, 2) NOT NULL,
    gross_npa_crore NUMERIC(15, 2) NOT NULL,
    net_npa_crore NUMERIC(15, 2) NOT NULL,
    gnpa_ratio_pct NUMERIC(6, 2) NOT NULL,
    nnpa_ratio_pct NUMERIC(6, 2) NOT NULL,
    cd_ratio_pct NUMERIC(6, 2) NOT NULL,
    provision_coverage_ratio_pct NUMERIC(6, 2),
    return_on_assets_pct NUMERIC(5, 2),
    return_on_equity_pct NUMERIC(5, 2),
    net_profit_crore NUMERIC(15, 2),
    risk_classification VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Fact: Granular District Credit & Deposit Returns (BSR)
CREATE TABLE IF NOT EXISTS fact_district_credit_deposit (
    record_id BIGSERIAL PRIMARY KEY,
    period_id INT REFERENCES dim_periods(period_id),
    geo_id INT REFERENCES dim_geography(geo_id),
    bank_group VARCHAR(80) NOT NULL,
    population_group VARCHAR(50) NOT NULL, -- Rural, Semi-Urban, Urban, Metropolitan
    branch_category VARCHAR(80) NOT NULL,
    number_of_offices INT NOT NULL CHECK (number_of_offices > 0),
    total_deposits_crore NUMERIC(15, 2) NOT NULL CHECK (total_deposits_crore >= 0),
    total_credit_crore NUMERIC(15, 2) NOT NULL CHECK (total_credit_crore >= 0),
    cd_ratio NUMERIC(7, 2) NOT NULL,
    cd_ratio_category VARCHAR(80),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Fact: Sectoral Deployment of Bank Credit
CREATE TABLE IF NOT EXISTS fact_sectoral_credit (
    sectoral_id BIGSERIAL PRIMARY KEY,
    period_id INT REFERENCES dim_periods(period_id),
    sector_id INT REFERENCES dim_sectors(sector_id),
    credit_deployed_crore NUMERIC(15, 2) NOT NULL,
    yoy_growth_pct NUMERIC(6, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Audit: Data Quality Results
CREATE TABLE IF NOT EXISTS data_quality_results (
    audit_id SERIAL PRIMARY KEY,
    audit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataset_name VARCHAR(100) NOT NULL,
    total_records INT NOT NULL,
    missing_values_handled INT NOT NULL,
    duplicates_removed INT NOT NULL,
    completeness_score_pct NUMERIC(5, 2) NOT NULL,
    consistency_score_pct NUMERIC(5, 2) NOT NULL
);

-- 9. Audit: Detected Statistical Anomalies
CREATE TABLE IF NOT EXISTS anomaly_audit_log (
    anomaly_id SERIAL PRIMARY KEY,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metric_name VARCHAR(100) NOT NULL,
    period_code VARCHAR(30) NOT NULL,
    entity_name VARCHAR(150) NOT NULL,
    observed_value NUMERIC(15, 2) NOT NULL,
    baseline_value NUMERIC(15, 2) NOT NULL,
    deviation_str VARCHAR(100) NOT NULL,
    severity VARCHAR(30) NOT NULL,
    evidence_text TEXT NOT NULL,
    detection_method VARCHAR(50) NOT NULL
);
