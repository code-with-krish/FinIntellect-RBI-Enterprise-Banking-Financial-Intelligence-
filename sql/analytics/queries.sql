-- ==============================================================================
-- AI Banking Financial Intelligence - Controlled Analytical Queries
-- Predefined analytical queries invoked by API layer and AI Evidence Engine
-- Note: Arbitrary SQL execution is strictly forbidden.
-- ==============================================================================

-- 1. Macro KPIs for Executive Dashboard
-- Query Name: get_executive_kpis
SELECT 
    p.fiscal_year,
    SUM(f.total_deposits_crore) AS total_deposits,
    SUM(f.total_advances_crore) AS total_advances,
    SUM(f.gross_npa_crore) AS total_gross_npa,
    SUM(f.net_npa_crore) AS total_net_npa,
    ROUND((SUM(f.gross_npa_crore) / NULLIF(SUM(f.total_advances_crore), 0)) * 100, 2) AS system_gnpa_ratio_pct,
    ROUND((SUM(f.total_advances_crore) / NULLIF(SUM(f.total_deposits_crore), 0)) * 100, 2) AS system_cd_ratio_pct,
    ROUND(AVG(f.return_on_assets_pct), 2) AS avg_return_on_assets
FROM fact_bank_performance f
JOIN dim_periods p ON f.period_id = p.period_id
WHERE p.fiscal_year = :fiscal_year
GROUP BY p.fiscal_year;


-- 2. Multi-Year Deposit vs Credit Trend Analysis
-- Query Name: get_credit_deposit_trend
SELECT 
    p.fiscal_year,
    SUM(f.total_deposits_crore) AS deposits_crore,
    SUM(f.total_advances_crore) AS advances_crore,
    ROUND((SUM(f.total_advances_crore) / NULLIF(SUM(f.total_deposits_crore), 0)) * 100, 2) AS cd_ratio,
    SUM(f.gross_npa_crore) AS gnpa_crore,
    ROUND((SUM(f.gross_npa_crore) / NULLIF(SUM(f.total_advances_crore), 0)) * 100, 2) AS gnpa_ratio
FROM fact_bank_performance f
JOIN dim_periods p ON f.period_id = p.period_id
GROUP BY p.fiscal_year
ORDER BY p.fiscal_year ASC;


-- 3. Top-N Banks by Credit Deployment & Asset Quality Standing
-- Query Name: get_bank_rankings
SELECT 
    b.bank_name,
    b.bank_group,
    f.total_advances_crore,
    f.total_deposits_crore,
    f.gnpa_ratio_pct,
    f.return_on_assets_pct,
    f.risk_classification,
    DENSE_RANK() OVER (ORDER BY f.total_advances_crore DESC) as credit_rank
FROM fact_bank_performance f
JOIN dim_banks b ON f.bank_id = b.bank_id
JOIN dim_periods p ON f.period_id = p.period_id
WHERE p.fiscal_year = :fiscal_year
ORDER BY f.total_advances_crore DESC
LIMIT 10;


-- 4. Geographic Credit-Deposit Concentration by State
-- Query Name: get_state_performance
SELECT 
    g.state_name,
    g.region,
    SUM(f.number_of_offices) AS total_offices,
    SUM(f.total_deposits_crore) AS deposits_crore,
    SUM(f.total_credit_crore) AS credit_crore,
    ROUND((SUM(f.total_credit_crore) / NULLIF(SUM(f.total_deposits_crore), 0)) * 100, 2) AS cd_ratio,
    ROUND((SUM(f.total_credit_crore) / SUM(SUM(f.total_credit_crore)) OVER ()) * 100, 2) AS national_credit_share_pct
FROM fact_district_credit_deposit f
JOIN dim_geography g ON f.geo_id = g.geo_id
JOIN dim_periods p ON f.period_id = p.period_id
WHERE p.quarter_code = :quarter_code
GROUP BY g.state_name, g.region
ORDER BY credit_crore DESC;


-- 5. Sectoral Credit Deployment & Contribution
-- Query Name: get_sector_credit_distribution
SELECT 
    s.sector_name,
    s.category,
    f.credit_deployed_crore,
    f.yoy_growth_pct,
    ROUND((f.credit_deployed_crore / SUM(f.credit_deployed_crore) OVER ()) * 100, 2) AS sector_share_pct
FROM fact_sectoral_credit f
JOIN dim_sectors s ON f.sector_id = s.sector_id
JOIN dim_periods p ON f.period_id = p.period_id
WHERE p.quarter_code = :quarter_code
ORDER BY f.credit_deployed_crore DESC;
