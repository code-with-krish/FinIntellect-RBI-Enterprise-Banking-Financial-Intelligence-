# Master Banking Data Dictionary

This data dictionary defines all primary fields, data types, sources, nullability rules, and business semantics across the analytical datasets.

---

## 1. Table: `fact_district_credit_deposit` (BSR Returns)
Granular quarterly district-level returns across Scheduled Commercial Banks.

| Column Name | Data Type | Source | Nullable | Business Definition | Validation Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `record_id` | BIGINT | System PK | No | Unique surrogate key | Primary Key |
| `quarter` | VARCHAR(15) | RBI BSR | No | Reporting fiscal period (e.g. `FY2024-Q4`) | Format: `FY\d{4}-Q[1-4]` |
| `state_name` | VARCHAR(100)| RBI BSR | No | Indian State or Union Territory | Standardized Title Case |
| `district_name`| VARCHAR(100)| RBI BSR | No | Administrative district | Standardized Title Case |
| `region` | VARCHAR(50) | RBI BSR | No | Macro geographic zone (Northern, Southern, etc.)| 6 official RBI zones |
| `bank_group` | VARCHAR(80) | RBI BSR | No | SCB Category (PSBs, Private, Foreign, RRB) | Allowed group set |
| `population_group`| VARCHAR(50)| RBI BSR | No | Rural, Semi-Urban, Urban, Metropolitan | Allowed population set |
| `number_of_offices`| INT | RBI BSR | No | Active bank branches reporting in district | $\ge 1$ |
| `total_deposits_crore`| NUMERIC | RBI BSR | No | Aggregate mobilized deposits in ₹ Crores | $\ge 0$ |
| `total_credit_crore` | NUMERIC | RBI BSR | No | Gross bank credit deployed in ₹ Crores | $\ge 0$ |
| `cd_ratio` | NUMERIC | Calculated | No | Ratio of credit to deposits (%) | $\ge 0$ |

---

## 2. Table: `fact_bank_performance`
Annual financial returns and balance sheet asset quality for commercial banks.

| Column Name | Data Type | Source | Nullable | Business Definition | Validation Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bank_name` | VARCHAR(150)| RBI Tables | No | Commercial bank legal entity name | Standardized string |
| `bank_group` | VARCHAR(80) | RBI Tables | No | Ownership group classification | PSB / Private / Foreign / RRB |
| `fiscal_year` | VARCHAR(10) | RBI Tables | No | Annual reporting cycle (e.g. `FY2024`) | Format: `FY\d{4}` |
| `total_deposits_crore`| NUMERIC | Annual Report| No | Total customer deposit liabilities | $\ge 0$ |
| `total_advances_crore`| NUMERIC | Annual Report| No | Total gross loans and advances | $\ge 0$ |
| `gross_npa_crore`| NUMERIC | Annual Report| No | Total non-performing loans (>90 days past due) | $\ge 0$ |
| `net_npa_crore` | NUMERIC | Annual Report| No | Non-performing loans net of specific provisions | $0 \le \text{NNPA} \le \text{GNPA}$ |
| `gnpa_ratio_pct`| NUMERIC | Calculated | No | GNPA as % of Total Advances | $0.0 \le \text{Ratio} \le 50.0$ |
| `nnpa_ratio_pct`| NUMERIC | Calculated | No | NNPA as % of Total Advances | $\le \text{GNPA Ratio}$ |
| `return_on_assets_pct`| NUMERIC | Annual Report| Yes | Annualized Return on Assets (%) | Normalized float |
| `net_profit_crore` | NUMERIC | Annual Report| No | Net profit / loss after corporate tax | Unconstrained |

---

## 3. Table: `fact_sectoral_credit`
Monthly and quarterly sectoral deployment of gross bank credit.

| Column Name | Data Type | Source | Nullable | Business Definition |
| :--- | :--- | :--- | :--- | :--- |
| `sector_name` | VARCHAR(120)| RBI Sectoral | No | Economic deployment sector (Agriculture, Industry, Retail, etc.) |
| `category` | VARCHAR(60) | RBI Sectoral | No | Priority Sector Lending (PSL) vs Non-Priority |
| `credit_deployed_crore`| NUMERIC | RBI Sectoral | No | Outstanding gross credit deployed in ₹ Crores |
| `yoy_growth_pct` | NUMERIC | Calculated | Yes | 12-month percentage expansion in credit deployed |
