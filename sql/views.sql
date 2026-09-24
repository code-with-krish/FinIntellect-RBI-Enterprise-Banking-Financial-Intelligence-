-- ==============================================================================
-- AI Banking Financial Intelligence - Analytical Views & Window Functions
-- Pre-computed analytical abstractions for high-speed reporting
-- ==============================================================================

-- 1. View: Bank Performance Growth & Asset Quality Trajectory
-- Calculates YoY Deposit Growth, Credit Growth, and GNPA Ratio movement using LAG()
CREATE OR REPLACE VIEW v_bank_performance_summary AS
WITH BankChronology AS (
    SELECT 
        b.bank_id,
        b.bank_code,
        b.bank_name,
        b.bank_group,
        p.period_id,
        p.fiscal_year,
        f.total_deposits_crore,
        f.total_advances_crore,
        f.gross_npa_crore,
        f.net_npa_crore,
        f.gnpa_ratio_pct,
        f.nnpa_ratio_pct,
        f.cd_ratio_pct,
        f.return_on_assets_pct,
        f.return_on_equity_pct,
        f.net_profit_crore,
        f.risk_classification,
        LAG(f.total_deposits_crore, 1) OVER (PARTITION BY b.bank_id ORDER BY p.fiscal_year) AS prev_deposits,
        LAG(f.total_advances_crore, 1) OVER (PARTITION BY b.bank_id ORDER BY p.fiscal_year) AS prev_advances,
        LAG(f.gnpa_ratio_pct, 1) OVER (PARTITION BY b.bank_id ORDER BY p.fiscal_year) AS prev_gnpa_ratio
    FROM fact_bank_performance f
    JOIN dim_banks b ON f.bank_id = b.bank_id
    JOIN dim_periods p ON f.period_id = p.period_id
)
SELECT 
    bank_id,
    bank_code,
    bank_name,
    bank_group,
    fiscal_year,
    total_deposits_crore,
    total_advances_crore,
    gross_npa_crore,
    net_npa_crore,
    gnpa_ratio_pct,
    nnpa_ratio_pct,
    cd_ratio_pct,
    return_on_assets_pct,
    return_on_equity_pct,
    net_profit_crore,
    risk_classification,
    CASE 
        WHEN prev_deposits > 0 THEN ROUND(((total_deposits_crore - prev_deposits) / prev_deposits) * 100, 2)
        ELSE 0.00 
    END AS yoy_deposit_growth_pct,
    CASE 
        WHEN prev_advances > 0 THEN ROUND(((total_advances_crore - prev_advances) / prev_advances) * 100, 2)
        ELSE 0.00 
    END AS yoy_credit_growth_pct,
    ROUND(gnpa_ratio_pct - COALESCE(prev_gnpa_ratio, gnpa_ratio_pct), 2) AS gnpa_ratio_yoy_change
FROM BankChronology;


-- 2. View: State-level Credit & Deposit Rankings and Contribution Share
-- Computes overall state ranking by credit deployment and percentage contribution using SUM() OVER()
CREATE OR REPLACE VIEW v_state_credit_deposit_rankings AS
WITH StateAggregates AS (
    SELECT 
        p.quarter_code,
        p.fiscal_year,
        g.state_name,
        g.region,
        SUM(f.number_of_offices) AS total_branches,
        SUM(f.total_deposits_crore) AS state_deposits_crore,
        SUM(f.total_credit_crore) AS state_credit_crore
    FROM fact_district_credit_deposit f
    JOIN dim_geography g ON f.geo_id = g.geo_id
    JOIN dim_periods p ON f.period_id = p.period_id
    GROUP BY p.quarter_code, p.fiscal_year, g.state_name, g.region
)
SELECT 
    quarter_code,
    fiscal_year,
    state_name,
    region,
    total_branches,
    state_deposits_crore,
    state_credit_crore,
    ROUND((state_credit_crore / NULLIF(state_deposits_crore, 0)) * 100, 2) AS state_cd_ratio,
    DENSE_RANK() OVER (PARTITION BY quarter_code ORDER BY state_credit_crore DESC) AS state_credit_rank,
    ROUND((state_credit_crore / SUM(state_credit_crore) OVER (PARTITION BY quarter_code)) * 100, 2) AS national_credit_share_pct
FROM StateAggregates;


-- 3. View: Bank Group Market Share & Portfolio Metrics
CREATE OR REPLACE VIEW v_bank_group_market_share AS
WITH GroupTotals AS (
    SELECT 
        p.fiscal_year,
        b.bank_group,
        SUM(f.total_deposits_crore) AS group_deposits,
        SUM(f.total_advances_crore) AS group_advances,
        SUM(f.gross_npa_crore) AS group_gnpa,
        AVG(f.return_on_assets_pct) AS avg_group_roa
    FROM fact_bank_performance f
    JOIN dim_banks b ON f.bank_id = b.bank_id
    JOIN dim_periods p ON f.period_id = p.period_id
    GROUP BY p.fiscal_year, b.bank_group
)
SELECT 
    fiscal_year,
    bank_group,
    group_deposits,
    group_advances,
    group_gnpa,
    ROUND(avg_group_roa, 2) AS avg_group_roa,
    ROUND((group_deposits / SUM(group_deposits) OVER (PARTITION BY fiscal_year)) * 100, 2) AS deposit_market_share_pct,
    ROUND((group_advances / SUM(group_advances) OVER (PARTITION BY fiscal_year)) * 100, 2) AS credit_market_share_pct,
    ROUND((group_gnpa / NULLIF(group_advances, 0)) * 100, 2) AS group_gnpa_ratio_pct
FROM GroupTotals;
