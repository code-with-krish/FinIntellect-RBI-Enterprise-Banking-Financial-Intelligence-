# Banking Business Logic & KPI Framework

This document outlines the business definitions, mathematical formulas, regulatory rationale, and SQL implementations for each core banking indicator used across the platform.

---

### 1. Credit-Deposit (CD) Ratio
- **Business Question**: What proportion of mobilized customer deposits is deployed into productive gross loans and advances?
- **Formula**:
  $$\text{CD Ratio (\%)} = \left(\frac{\text{Total Advances (₹ Cr)}}{\text{Total Deposits (₹ Cr)}}\right) \times 100$$
- **Regulatory & Business Meaning**:
  - **< 60% (Under-deployed / Surplus Liquidity)**: Excess liquidity invested in low-yielding government securities (SLR); potential drag on Net Interest Margin (NIM).
  - **70% - 80% (Optimal Deployment)**: Healthy equilibrium balancing credit delivery with liquidity risk management.
  - **> 85% (Strained / High Credit Deployment)**: Heightened refinancing risk; signals urgency to mobilize retail CASA and term deposits.
- **Controlled SQL Implementation**:
  ```sql
  ROUND((SUM(total_credit_crore) / NULLIF(SUM(total_deposits_crore), 0)) * 100, 2) AS cd_ratio_pct
  ```

---

### 2. Gross Non-Performing Asset (GNPA) Ratio
- **Business Question**: What percentage of the bank's gross loan book has stopped generating interest income for over 90 days?
- **Formula**:
  $$\text{GNPA Ratio (\%)} = \left(\frac{\text{Gross NPA (₹ Cr)}}{\text{Total Gross Advances (₹ Cr)}}\right) \times 100$$
- **Prudential Benchmark**: Ratios below 3.5% indicate strong underwriting quality and effective collection mechanisms.
- **Controlled SQL Implementation**:
  ```sql
  ROUND((SUM(gross_npa_crore) / NULLIF(SUM(total_advances_crore), 0)) * 100, 2) AS gnpa_ratio_pct
  ```

---

### 3. Net Non-Performing Asset (NNPA) & Provision Coverage Ratio (PCR)
- **Business Question**: How much credit risk remains unhedged after deducting cumulative loan-loss provisions?
- **Formula**:
  $$\text{Net NPA} = \text{Gross NPA} - \text{Cumulative Specific Provisions}$$
  $$\text{PCR (\%)} = \left(\frac{\text{Gross NPA} - \text{Net NPA}}{\text{Gross NPA}}\right) \times 100$$
- **Accounting Constraint**: In accordance with RBI guidelines, Net NPA must never exceed Gross NPA.

---

### 4. Return on Assets (RoA)
- **Business Question**: How efficiently is the banking entity converting its balance sheet assets into net profit?
- **Formula**:
  $$\text{RoA (\%)} = \left(\frac{\text{Net Profit After Tax}}{\text{Average Total Assets}}\right) \times 100$$
- **Benchmark**: An annualized RoA above 1.0% indicates healthy capital accretion.
