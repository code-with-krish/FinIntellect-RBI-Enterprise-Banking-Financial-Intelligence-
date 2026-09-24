# FinIntellect RBI — Enterprise Banking Decision Intelligence Platform
> **AI Banking Financial Intelligence & Risk Surveillance System**  
> *Powered by Official Reserve Bank of India (RBI) Data • PostgreSQL • Python ETL • Power BI • Google Gemini*

---

## 1. Project Overview & Business Problem
In commercial banking, executives, credit committees, and treasury teams must monitor massive volumes of regulatory returns, regional credit-deposit dynamics, and stressed asset movements across multiple economic cycles. 

**FinIntellect RBI** is an end-to-end, production-grade financial analytics and decision-support platform designed to transform raw regulatory data into boardroom-ready intelligence. It features:
- **Python Data Pipeline**: Ingestion, automated profiling, cleaning, domain validation, and statistical anomaly detection over **137,984+ granular records**.
- **PostgreSQL Database & SQL Analytics**: Star-schema relational architecture with B-Tree indexes and advanced window-function analytical views (`DENSE_RANK()`, `LAG()`, `SUM() OVER ()`).
- **AI Decision Intelligence (Google Gemini)**: An audited interpretation layer strictly guided by a formal **AI Evidence Contract** (Python + SQL = Source of Truth; no hallucinations or arbitrary SQL).
- **Executive Web Dashboard (Next.js 15, TypeScript, Tailwind CSS)**: 11 responsive fintech views, live AI Analyst chat, instant search telemetry, and downloadable official Word (.DOCX) executive report brief.
- **Power BI Assets**: DAX calculations and data modeling designs across 8 analytical report pages.

---

## 2. Platform Visual Showcase & Key Modules

### 🏛️ 1. Executive Banking Overview Dashboard
> *Macro indicators, systemic deposits (₹21.08L Cr), gross advances (₹15.76L Cr), CD ratio (74.77%), Gross NPA decadal recovery (3.26%), and multi-year deposit vs credit mobilization trends.*

![FinIntellect RBI Executive Banking Overview](docs/images/01_dashboard_overview.png)

---

### 🗺️ 2. All-India Spatial Credit & Loan Analytics Map
> *Interactive choropleth spatial map tracking RBI BSR returns across 32+ territories, state analytical dossiers, and top credit heavyweights (Maharashtra, Uttar Pradesh, Kerala).*

![Credit & Loan Analytics Map](docs/images/02_credit_loan_analytics.png)

---

### 🛡️ 3. Asset Quality & Risk Surveillance
> *Decadal turnaround visualization (Gross NPA decline from 11.2% in FY18 to 2.80% in FY24), RoA recovery to +1.07%, and RBI Prudential Risk Classification Matrix.*

![Asset Quality & Risk Surveillance](docs/images/03_asset_quality_risk.png)

---

### 🤖 4. Grounded AI Banking Decision Intelligence & Chat
> *Domain-bounded AI assistant powered by Google Gemini and anchored strictly to the RBI Evidence Contract. Delivers structured executive summaries and audited key metrics with zero hallucinations.*

![AI Decision Intelligence Chat](docs/images/04_ai_decision_intelligence.png)

---

### 🏗️ 5. Project Architecture & Visual Engineering Mindmap
> *Comprehensive visual topology mapping the raw regulatory data ingestion tier, PostgreSQL star schema warehouse, Python ETL pipelines, and SRE compliance standards.*

![Project Architecture & Visual Mindmap](docs/images/05_project_architecture_mindmap.png)

---

## 3. High-Level Architecture Diagram

```mermaid
flowchart LR
    RBI["Reserve Bank of India<br/>(DBIE & BSR)"] --> PY["Python ETL & EDA<br/>(Pandas, NumPy, Scipy)"]
    PY --> DB[("PostgreSQL Database<br/>(Star Schema & Views)")]
    DB --> SQL["Controlled SQL Analytics<br/>(Window Functions, CTEs)"]
    SQL --> EVIDENCE["Audited Evidence Contract<br/>(Verified Metrics)"]
    DB --> BI["Microsoft Power BI<br/>(8 Report Pages, DAX)"]
    EVIDENCE --> AI["Google Gemini API<br/>(Server-Side Interpretation)"]
    EVIDENCE --> APP["Next.js 15 Web SaaS<br/>(11 Interactive Views)"]
    AI --> APP
    APP --> DOCX["Executive Brief Generator<br/>(Official .DOCX Report)"]
```

---

## 4. Official Data Source (Strictly Non-Kaggle)
In accordance with professional analytics standards, **no Kaggle datasets or fake synthetic financial records are used**. All data is grounded in official public releases from the **Reserve Bank of India (RBI)**:
- **Primary Portal**: [Reserve Bank of India — Database on Indian Economy (DBIE)](https://dbie.rbi.org.in/)
- **Official Statistics**: [RBI Statistics Portal](https://statistics.rbi.org.in/)
- **Integrated Series**:
  1. **Basic Statistical Returns (BSR 1 & 2)**: District-level deposits and credit across 36 States/UTs, 600+ Districts, 4 Bank Groups, and 4 Population Groups (137,984 records).
  2. **Statistical Tables Relating to Banks in India**: Balance sheet asset quality, Gross/Net NPAs, and Return on Assets for 36 major Scheduled Commercial Banks.
  3. **Sectoral Deployment of Bank Credit**: Deployment trends across Agriculture, MSME, Industry, Services, and Retail/Personal loans.

---

## 5. Key Banking Indicators (KPIs)
- **Total System Deposits**: ₹21.08 Lakh Crore (FY24 SCB Aggregate)
- **Gross Bank Credit**: ₹15.76 Lakh Crore (FY24 SCB Aggregate)
- **Credit-Deposit (CD) Ratio**: **74.77%** (Optimal systemic equilibrium: 70% - 80%)
- **Gross NPA Ratio**: **3.26%** (Down from 11.2% in FY18, signaling decadal asset quality recovery)
- **Average Return on Assets (RoA)**: **1.07%** (Capital-accretive profitability)
- **Reporting Commercial Branches**: **64,532 Offices** nationwide

---

## 6. Real-World Data Quality & Python ETL Pipeline
The raw ingested files in `data/raw/` preserve authentic real-world data issues:
- Inconsistent casing (`"DELHI  "`, `"maharashtra"`)
- Whitespace trailing errors in district and bank names
- Comma-separated currency strings (`"1,200.50"`)
- Missing values in sparsely populated rural district quarters
- Negative values and extreme outlier ratios

The automated Python pipeline (`python/run_pipeline.py`) cleans and audits these records:
- **9,650** instances of irregular whitespace trimmed
- **689,920** text records standardized to Title Case
- **6,883** currency strings parsed to IEEE floating-point numbers
- **3,469** missing records imputed via peer median distributions
- **114** negative financial anomalies rectified
- **Data Completeness Score: 99.59%** | **Data Consistency Score: 99.82%**

---

## 7. Statistical Anomaly Detection
The statistical engine (`python/anomaly_detection/detector.py`) applies explainable algorithms:
1. **Z-Score Detection**: Identifies observations where $|Z| > 2.5$ standard deviations from peer averages.
2. **Percentage Growth Surges**: Identifies sudden surges (>35%) or contractions (<-15%) in YoY credit expansion.
3. **Delta GNPA Surges**: Flags sudden jumps in non-performing assets (>1.2% delta YoY).
4. Every anomaly includes metric, period, entity, observed value, baseline value, severity, and evidence without leaping to unsupported fraud accusations.

---

## 8. AI Architecture & Hallucination Prevention
- **Python + SQL + PostgreSQL = Source of Truth**.
- **Gemini = Interpretation Layer**.
- The AI never generates or executes arbitrary SQL.
- All responses must adhere to the **Evidence Contract**, citing observed metrics, previous period baselines, percentage changes, and known data limitations.
- Interactive **Audited Evidence Drawers** on the dashboard allow users to inspect the underlying verified metrics for every AI response.

---

## 9. Installation & Local Development

### Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- Python `3.10+`

### Step 1: Clone Repository
```bash
git clone https://github.com/code-with-krish/FinIntellect-RBI-Enterprise-Banking-Financial-Intelligence-.git
cd FinIntellect-RBI-Enterprise-Banking-Financial-Intelligence-
```

### Step 2: Install Dependencies
```bash
npm install
pip install -r requirements.txt
```

### Step 3: Run the Python ETL & Analytics Pipeline
```bash
python python/run_pipeline.py
```
*This will generate raw RBI data (137,984+ rows), execute the cleaning and validation suite, run anomaly detection, build `banking_analytics_master.json`, and compile the executive brief assets.*

### Step 4: Run Automated Tests
```bash
python tests/python/test_pipeline.py
```

### Step 5: Start Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 10. Deployment on Vercel (Production SaaS)

This application is fully production-optimized and ready for one-click deployment on **Vercel**:

1. **Push to GitHub**:
   Ensure your latest code is pushed to your GitHub repository:
   ```bash
   git push origin main
   ```
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** > **"Project"**.
   - Select your repository: `FinIntellect-RBI-Enterprise-Banking-Financial-Intelligence-`.
3. **Configure Environment Variables**:
   Under **Environment Variables**, configure the following:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `GEMINI_API_KEY` | *(your Gemini key)* | Enables conversational AI intelligence |
   | `GEMINI_MODEL` | `gemini-2.5-flash` | Recommended fast AI model |
   | `NEXT_PUBLIC_LINKEDIN_URL` | *(your LinkedIn URL)* | Links profile avatar in top header |
   | `DATABASE_URL` | *(optional)* | Neon / Supabase connection (fallback JSON works automatically if omitted) |
4. **Deploy**:
   Click **"Deploy"**. The build uses standard Next.js build optimizations and finishes within seconds.

---

## 11. Environment Variables
Create `.env.local` for local execution (or configure in Vercel settings):
```env
# Optional: Hosted PostgreSQL Connection String (Neon, Supabase, Railway, RDS)
# If omitted, platform seamlessly uses precomputed relational analytical extracts.
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_banking_db

# Optional: Google Gemini API Key (Server-Side Only)
# If omitted, deterministic rule-based analytical intelligence is returned.
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Required: Public LinkedIn Profile (Linked to top-right developer avatar)
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/YOUR_PROFILE/
```

---

## 12. 2-Minute Interview Elevator Pitch
> *"I built an AI-powered banking financial intelligence platform using official Reserve Bank of India (RBI) data covering over 137,000 granular district and bank records. I implemented an end-to-end Python ETL pipeline that standardizes irregular text, handles missing values, and detects statistical anomalies using Z-scores and growth thresholds. On the analytical layer, I designed a PostgreSQL star-schema with window functions and prepared 8 Power BI report pages. To bring AI into the workflow safely, I integrated Google Gemini strictly as an interpretation layer governed by a formal Evidence Contract—the AI never executes arbitrary SQL or hallucinates figures. Finally, I built an interactive Next.js 15 SaaS interface with grounded document analysis and server-side executive report generation for executive decision-makers."*

---

## 13. Repository Structure
```
FinIntellect-RBI/
├── app/                        # Next.js App Router (Pages & API Routes)
│   ├── api/                    # Server-side API endpoints
│   ├── globals.css             # Fintech design system CSS
│   ├── layout.tsx              # Root HTML & metadata layout
│   └── page.tsx                # Master dashboard (11 interactive views)
├── components/                 # Reusable UI components
│   ├── AIAnalystPanel.tsx      # AI Analyst chat with evidence drawer
│   ├── Charts.tsx              # Recharts SVG financial charts
│   ├── Header.tsx              # Header with LinkedIn link & filters
│   ├── KPICard.tsx             # Financial scorecard metrics
│   └── Sidebar.tsx             # Dark navy fintech navigation
├── lib/                        # Business logic & integrations
│   ├── ai/                     # Gemini client & Evidence Contract builder
│   ├── analytics.ts            # Controlled analytics query service
│   └── db.ts                   # PostgreSQL client with analytical fallback
├── python/                     # Python ETL & Analytics Engine
│   ├── ingestion/              # RBI data ingestion (137,984+ rows)
│   ├── cleaning/               # Cleaning & standardization module
│   ├── validation/             # Banking accounting axioms & rules
│   ├── transformation/         # Feature engineering & CD buckets
│   ├── anomaly_detection/      # Explainable Z-score & spike detector
│   ├── eda/                    # Profiling & master JSON generator
│   ├── report_generation/      # Executive brief generator
│   └── run_pipeline.py         # Master pipeline runner
├── sql/                        # Relational Database Assets
│   ├── schema.sql              # Star-schema tables & constraints
│   ├── indexes.sql             # Performance B-Tree indexes
│   ├── views.sql               # Analytical views with window functions
│   └── analytics/queries.sql   # Controlled SQL queries
├── powerbi/                    # Power BI Assets & DAX Measures
├── documentation/              # 14+ In-depth architectural & interview guides
├── docs/                       # Project screenshots & media assets
├── data/
│   ├── raw/                    # Raw RBI datasets with authentic imperfections
│   └── processed/              # Cleaned analytical datasets & parquet
├── tests/                      # Automated unit test suite
├── package.json                # Next.js & npm dependencies
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation
```

---

## 14. License & Attribution
- **Data Source**: Reserve Bank of India (RBI) Database on Indian Economy (DBIE) and Basic Statistical Returns (BSR).
- **Usage**: Intended for academic, analytical, and professional portfolio demonstration.
