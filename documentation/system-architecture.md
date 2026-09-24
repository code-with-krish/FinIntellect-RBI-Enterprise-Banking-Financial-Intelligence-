# High-Level System Architecture

## 1. End-to-End System Overview
The **AI Banking Financial Intelligence** platform (*AI Banking Insights*) is an enterprise banking analytics and AI decision-support platform. It bridges data engineering, relational database modeling, advanced SQL window functions, statistical anomaly surveillance, business intelligence, and server-side LLM interpretation.

```mermaid
flowchart TD
    subgraph Data_Layer ["1. Official Data Ingestion"]
        RBI["Reserve Bank of India (RBI)<br/>DBIE & BSR Reports"]
        RAW["Raw Datasets (137,984 Rows)<br/>Preserves Real Imperfections"]
        RBI --> RAW
    end

    subgraph ETL_Layer ["2. Python ETL & Analytics Engine"]
        CLEAN["Data Cleaning & Standardization<br/>(Whitespace, Strings, Types)"]
        VAL["Validation & Banking Axioms<br/>(NNPA <= GNPA, CD Bounds)"]
        TRANS["Transformation & Feature Engineering<br/>(YoY, CD Buckets, Ratios)"]
        ANOM["Statistical Anomaly Engine<br/>(Z-Scores, Spikes, Outliers)"]
        RAW --> CLEAN --> VAL --> TRANS --> ANOM
    end

    subgraph Storage_Layer ["3. Database & Analytical Storage"]
        PG[("PostgreSQL Database<br/>Star Schema & Indexed Views")]
        PARQUET["Parquet & JSON Analytics Store<br/>Fast In-Memory Fallback"]
        TRANS --> PG
        TRANS --> PARQUET
        ANOM --> PG
        ANOM --> PARQUET
    end

    subgraph Analytics_Layer ["4. Controlled SQL & Evidence Layer"]
        SQL["Controlled SQL Analytics<br/>CTEs, Window Functions, LAG/LEAD"]
        EVIDENCE["Audited Evidence Contract<br/>Source, Metric, Period, Values"]
        PG --> SQL --> EVIDENCE
        PARQUET --> EVIDENCE
    end

    subgraph App_Layer ["5. Full-Stack Web Application (Next.js 15)"]
        API["Server-Side API Routes<br/>(/api/kpis, /api/ai/chat, etc.)"]
        GEMINI["Google Gemini API (Server-Side)<br/>Interpretation Layer Only"]
        UI["Modern Fintech Dashboard<br/>(Navy/Cool Gray UI, 13 Views)"]
        PDF["ReportLab PDF Generator<br/>Executive Board Briefing"]
        
        EVIDENCE --> API
        API --> GEMINI
        GEMINI --> API
        API --> UI
        API --> PDF
    end
```

---

## 2. Core Architectural Tenets
1. **Separation of Computation and Interpretation**:
   - Python + SQL + PostgreSQL are the **sole Source of Truth**.
   - Google Gemini acts exclusively as an **Interpretation Layer**.
   - The LLM is never granted arbitrary SQL execution, database write privileges, or unsupervised mathematical extrapolation.

2. **Audited Evidence Contract**:
   - Every AI insight is backed by an unambiguous evidence bundle: metric name, current value, previous period value, percentage change, reporting entity, fiscal period, source dataset, and calculation methodology.

3. **Production Cloud Resilience**:
   - Ready for hosted PostgreSQL (`DATABASE_URL`) on platforms such as Neon, Supabase, Railway, AWS RDS, and Render.
   - Deploys on Vercel with zero runtime credential leakage (`GEMINI_API_KEY` is strictly server-side).
