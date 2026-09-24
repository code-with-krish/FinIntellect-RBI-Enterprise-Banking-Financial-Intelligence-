# Power BI Banking Financial Intelligence Dashboard

This directory contains the data modeling blueprints, DAX calculations, and report layouts for the **Power BI Banking Financial Intelligence** dashboard.

## 1. 8 Dedicated Report Pages
The Power BI solution is structured into 8 professional analytical views:

1. **Page 1: Executive Banking Overview**
   - KPI Cards: Total Deposits, Total Advances, System CD Ratio, Gross NPA Ratio, Net RoA, Active Offices.
   - Trend Chart: Multi-year deposit vs advance expansion.
   - Donut Chart: Bank group market share of advances.
   - Slicers: Fiscal Year, Bank Group, State.

2. **Page 2: Financial Performance**
   - Matrix Table: Bank-wise deposits, advances, net profit, and RoA.
   - Column Chart: YoY credit and deposit growth rates across public vs private sectors.
   - Drill-through: Individual bank historical performance sheet.

3. **Page 3: Credit & Loan Analytics**
   - Scatter Plot: Deposits mobilized vs credit deployed per district.
   - Clustered Bar: CD ratio distribution across population tiers (Rural, Semi-Urban, Urban, Metro).
   - Liquidity Heatmap: Districts categorized by credit strain (>85% CD ratio).

4. **Page 4: Asset Quality & NPA Surveillance**
   - Line Chart: Gross NPA % vs Net NPA % trajectory from FY2018 to FY2024.
   - Provision Coverage Gauge: System PCR vs 70% prudential target.
   - Table: Stressed assets watchlist ranked by gross NPA volume.

5. **Page 5: Branch & Geography Intelligence**
   - Filled Map / Shape Map: State-wise credit deployment across 36 Indian States & UTs.
   - Matrix: Regional credit delivery (Northern, Southern, Western, Eastern, Central, North-Eastern).
   - Tooltip Page: District-level breakdown on state hover.

6. **Page 6: Sector Analysis**
   - Tree Map: Sectoral credit deployment (Agriculture, Industry, Services, Retail).
   - Bar Chart: Priority Sector Lending (PSL) compliance by sub-sector.
   - YoY Sector Growth table.

7. **Page 7: Data Quality & Anomalies**
   - Card Matrix: Data completeness score, consistency score, records cleaned.
   - Table: Statistical anomalies detected via Z-score and percentage surges with severity tagging.
   - Missing value matrix by reporting column.

8. **Page 8: AI Business Insights**
   - Visual summary of audited AI business briefings and risk management recommendations.

---

## 2. Connecting to the Data Layer
Power BI can connect directly through two official channels:
1. **PostgreSQL Database**:
   - Connector: *PostgreSQL database*
   - Server: Hosted PostgreSQL host (e.g., Neon / Supabase)
   - Database: `ai_banking_db`
   - Import Mode: *DirectQuery* or *Import* using the indexed views: `v_bank_performance_summary`, `v_state_credit_deposit_rankings`, `v_bank_group_market_share`.
2. **Processed Parquet / CSV Extracts**:
   - Load `data/processed/district_credit_deposit_clean.parquet` and `data/processed/bank_performance_clean.csv`.
