# Reserve Bank of India (RBI) Banking Datasets

## 1. Official Data Source Attribution
This platform uses official public banking and financial data released by the **Reserve Bank of India (RBI)**.

- **Primary Source Portal**: [Reserve Bank of India - Database on Indian Economy (DBIE)](https://dbie.rbi.org.in/)
- **Official Statistics Portal**: [RBI Statistics Portal](https://statistics.rbi.org.in/)
- **Data License & Usage**: Publicly available official statistical releases used in compliance with RBI publication and fair-use terms for research and analytics.

---

## 2. Specific RBI Datasets Combined
To construct a comprehensive, multi-dimensional analytical dataset exceeding **100,000+ granular records**, multiple official RBI data series are integrated:

### Dataset A: Basic Statistical Returns (BSR) - 1 & 2
- **Description**: Scheduled Commercial Banks (SCBs) Deposits and Credit Deployment across States, Union Territories, Districts, and Population Groups (Rural, Semi-Urban, Urban, Metropolitan).
- **Reporting Frequency**: Quarterly & Annual returns (FY2018 - FY2024).
- **Core Variables**: State, District, Population Group, Bank Group (Public Sector Banks, Private Sector Banks, Foreign Banks, Regional Rural Banks), Number of Reporting Offices/Branches, Total Deposits (₹ Crores), Total Gross Bank Credit (₹ Crores), Credit-Deposit (CD) Ratio.

### Dataset B: Scheduled Commercial Banks (SCBs) Asset Quality & Financial Health
- **Description**: Bank-wise and Bank-Group-wise balance sheet performance metrics from RBI Statistical Tables Relating to Banks in India.
- **Core Variables**: Bank Name, Bank Group, Fiscal Year, Gross Non-Performing Assets (GNPA ₹ Cr), Net Non-Performing Assets (NNPA ₹ Cr), GNPA Ratio (%), NNPA Ratio (%), Return on Assets (RoA %), Return on Equity (RoE %).

### Dataset C: Sectoral Deployment of Bank Credit
- **Description**: Monthly/Quarterly sectoral deployment of gross bank credit by major economic sectors.
- **Core Variables**: Sector (Agriculture & Allied, Industry - Micro/Small/Medium/Large, Services, Personal Loans / Retail), Sub-sector, Priority Sector classification, Credit Deployed (₹ Crores), YoY Growth Rate (%).

---

## 3. Real-World Data Quality Preservation in Raw Ingestion
In accordance with professional data engineering best practices, the raw ingested files deliberately retain real-world data quality anomalies encountered in public statistical archives:
1. **Inconsistent Bank & State Naming**: E.g., `"State Bank of India"` vs `"STATE BANK OF INDIA "`, `"NCT of Delhi"` vs `"Delhi"`.
2. **Missing Observations**: Sparsely populated rural district historical quarters, null NPA provisions for newly amalgamated entities.
3. **Numeric Discrepancies**: Numeric figures stored as comma-separated text strings, negative growth anomalies, and extreme outlier ratios.
4. **Data Cleansing**: All transformations and validation rules are executed by the Python ETL pipeline (`python/cleaning/cleaner.py` and `python/validation/validator.py`).
