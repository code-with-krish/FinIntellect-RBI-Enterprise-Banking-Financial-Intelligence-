# Database Architecture & PostgreSQL Analytical Design

## 1. Relational Star/Snowflake Schema
The analytical database uses a dimensional model optimized for multi-year aggregation, slicing across geographic entities, and tracking banking balance sheet metrics.

```mermaid
erDiagram
    dim_banks ||--o{ fact_bank_performance : "has"
    dim_periods ||--o{ fact_bank_performance : "reported in"
    dim_periods ||--o{ fact_district_credit_deposit : "reported in"
    dim_geography ||--o{ fact_district_credit_deposit : "located at"
    dim_periods ||--o{ fact_sectoral_credit : "reported in"
    dim_sectors ||--o{ fact_sectoral_credit : "deployed to"

    dim_banks {
        int bank_id PK
        string bank_code UK
        string bank_name
        string bank_group
        string ownership_type
        int established_year
    }

    dim_geography {
        int geo_id PK
        string state_name
        string district_name
        string region
    }

    dim_sectors {
        int sector_id PK
        string sector_name UK
        string category
    }

    dim_periods {
        int period_id PK
        string quarter_code UK
        string fiscal_year
        int quarter_number
        date period_end_date
    }

    fact_bank_performance {
        bigint fact_id PK
        int bank_id FK
        int period_id FK
        numeric total_deposits_crore
        numeric total_advances_crore
        numeric gross_npa_crore
        numeric net_npa_crore
        numeric gnpa_ratio_pct
        numeric cd_ratio_pct
        numeric return_on_assets_pct
    }

    fact_district_credit_deposit {
        bigint record_id PK
        int period_id FK
        int geo_id FK
        string bank_group
        string population_group
        int number_of_offices
        numeric total_deposits_crore
        numeric total_credit_crore
        numeric cd_ratio
    }

    fact_sectoral_credit {
        bigint sectoral_id PK
        int period_id FK
        int sector_id FK
        numeric credit_deployed_crore
        numeric yoy_growth_pct
    }
```

---

## 2. Indexing and Query Performance Strategy
- **Composite State & Period Indexes**: `CREATE INDEX idx_fact_dist_geo_period ON fact_district_credit_deposit(geo_id, period_id);` ensures that geographic filtering across 137,984 rows executes in sub-millisecond time.
- **Analytical Views with Window Functions**:
  - `v_bank_performance_summary` utilizes `LAG()` over partitioned bank series for instant YoY growth computation.
  - `v_state_credit_deposit_rankings` pre-computes national credit share and state ranks using `DENSE_RANK() OVER (PARTITION BY quarter_code ORDER BY state_credit_crore DESC)`.

---

## 3. Hosted PostgreSQL Support
The application connects via standard connection strings:
`DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require`
Supports providers including Neon, Supabase, Railway, Render, and AWS RDS. If `DATABASE_URL` is absent during local development or offline interview presentations, the service automatically falls back to pre-compiled relational analytical parquet/JSON data without interruption.
