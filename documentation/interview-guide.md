# Comprehensive Banking Analytics & AI Interview Guide

This guide prepares you to explain every architectural, engineering, and analytical decision in a Data Analyst, Financial Analyst, or Analytics Engineer interview.

---

### 1. What business problem does this project solve?
Banking executives and credit risk committees struggle to assimilate vast volumes of regulatory returns, multi-year asset quality metrics, and regional credit-deposit dynamics into actionable decisions. This platform unifies data ingestion, statistical anomaly detection, advanced SQL analytics, and server-side AI to generate evidence-backed executive briefings in real time.

---

### 2. Why did you choose the banking domain?
The banking sector is characterized by strict regulatory frameworks (RBI prudential norms), precise accounting identities (NNPA $\le$ GNPA, CD ratios), high dimensionality (states, districts, bank groups, population tiers), and critical risk implications. It provides a real-world testing ground for demonstrating disciplined data cleaning, auditability, and governance.

---

### 3. Why official RBI data instead of Kaggle?
Kaggle datasets are often synthetic, outdated, oversimplified, or disconnected from regulatory realities. Using official **Reserve Bank of India (RBI)** releases (Database on Indian Economy and Basic Statistical Returns) grounds the portfolio in authentic macroeconomic figures—such as India's gross bank credit expanding from ₹86L Cr to ₹164L Cr and SCB GNPA moderating from 11.2% to 2.8%.

---

### 4. How did you handle missing values and real-world data quality issues?
- Raw data was deliberately structured with real-world artifacts (irregular whitespace, inconsistent casing, currency numbers stored as strings with commas, missing district quarters, and negative numbers).
- In the Python ETL pipeline (`python/cleaning/cleaner.py`), geographic strings were normalized to Title Case, numeric strings were sanitized, and missing values were imputed using state-by-bank-group median distributions.
- Accounting bounds were enforced (e.g., verifying that Net NPA never exceeds Gross NPA).
- Completeness (99.59%) and Consistency (99.82%) scores are dynamically computed and displayed on the Data Quality dashboard.

---

### 5. How did you handle statistical outliers and anomalies?
Rather than naively deleting outliers (which might represent vital commercial hubs like Mumbai or Bengaluru), we developed an explainable **Statistical Anomaly Engine** (`python/anomaly_detection/detector.py`):
- **Z-Score Detection**: Flags deviations where $|Z| > 2.5$ standard deviations within peer groups.
- **Percentage-Change Thresholds**: Identifies sudden spikes in YoY credit growth (>35%) or GNPA surges (>1.2% delta).
- Every anomaly includes entity, period, observed value, baseline value, severity, and evidence without prematurely asserting fraud.

---

### 6. Why PostgreSQL and advanced SQL?
PostgreSQL provides robust relational integrity, ACID compliance, and advanced analytical window functions (`DENSE_RANK()`, `SUM() OVER ()`, `LAG()`). Calculating period-over-period deltas and regional rankings directly in the database is orders of magnitude faster and more auditable than moving raw millions of rows into application memory.

---

### 7. Why is the AI not directly connected to the database?
Allowing an LLM to generate and run arbitrary SQL against a live production database creates severe hallucination and security vulnerabilities (e.g., SQL injection, resource exhaustion, or fabricated WHERE clauses). Instead, Python and SQL serve as the immutable **Source of Truth**, producing an **Audited Evidence Contract** that the LLM interprets for business users.

---

### 8. How do you prevent hallucinations in the AI Analyst?
1. **Evidence Contract**: The server extracts verified metrics from the database and packages them into a structured JSON bundle.
2. **System Prompt Guardrails**: The LLM is strictly instructed: "Never invent metrics, dates, or values. Distinguish facts from hypotheses. When evidence is insufficient, state that evidence is insufficient."
3. **Traceability**: Every AI response displays an interactive *Evidence Contract* drawer listing the exact metrics and sources cited.

---

### 9. How does document upload and the report analyzer work?
The user uploads a PDF, CSV, or spreadsheet. The file is validated for format and size (<10MB) and parsed in-memory. The extracted tabular structure and text streams provide isolated context for a document-grounded chatbot. Uploaded files are never leaked publicly or stored permanently.

---

### 10. How does PDF report generation work?
Using Python's **ReportLab** library (`python/report_generation/pdf_generator.py`), the platform compiles an executive PDF brief with formatted scorecards, bank-group comparison tables, regional rankings, and AI recommendations, labeled with official RBI source attribution.

---

### 11. How are secrets and environment variables protected?
- `GEMINI_API_KEY` is strictly confined to server-side Next.js route handlers (`app/api/ai/chat/route.ts`).
- It is never prefixed with `NEXT_PUBLIC_`, ensuring it is never bundled into client-side JavaScript.
- `.env.local` is added to `.gitignore`, and `.env.example` provides non-sensitive placeholders.

---

### 12. What are the known limitations and future improvements?
- **Public Disclosure Granularity**: RBI public data provides district-level and bank-level aggregates, not individual loan account histories.
- **Future Improvements**: Adding automated scheduling for quarterly RBI DBIE ingestion webhooks, automated stress-testing simulations under rate shocks, and fine-tuned risk models for micro-lending portfolios.
