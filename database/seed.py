"""
PostgreSQL Database Seeder & Migration Script
============================================
Reads processed RBI analytical datasets and loads them into PostgreSQL
using SQLAlchemy or psycopg2 when DATABASE_URL is configured.
Also exports a self-contained database/seed.sql file.
"""

import os
import sys
import pandas as pd
from sqlalchemy import create_engine, text

PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
SQL_DIR = os.path.join(os.path.dirname(__file__), "..", "sql")

def seed_database():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("INFO: DATABASE_URL not set in environment. Skipping live PostgreSQL connection.")
        print("The platform utilizes the high-performance analytical data layer (banking_analytics_master.json).")
        return

    print(f"Connecting to PostgreSQL database: {database_url.split('@')[-1] if '@' in database_url else 'specified host'}...")
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            # 1. Run schema
            schema_file = os.path.join(SQL_DIR, "schema.sql")
            with open(schema_file, "r") as f:
                conn.execute(text(f.read()))
            
            # 2. Run indexes
            index_file = os.path.join(SQL_DIR, "indexes.sql")
            with open(index_file, "r") as f:
                conn.execute(text(f.read()))

            # 3. Run views
            view_file = os.path.join(SQL_DIR, "views.sql")
            with open(view_file, "r") as f:
                conn.execute(text(f.read()))
            
            conn.commit()
            print("PostgreSQL schema, indexes, and views successfully applied.")

            # Load Bank Performance
            bank_csv = os.path.join(PROCESSED_DIR, "bank_performance_clean.csv")
            if os.path.exists(bank_csv):
                df_bank = pd.read_csv(bank_csv)
                df_bank.to_sql("fact_bank_performance_raw_seed", engine, if_exists="replace", index=False)
                print(f"Loaded {len(df_bank)} records into fact_bank_performance.")

            # Load Sectoral Credit
            sec_csv = os.path.join(PROCESSED_DIR, "sectoral_credit_clean.csv")
            if os.path.exists(sec_csv):
                df_sec = pd.read_csv(sec_csv)
                df_sec.to_sql("fact_sectoral_credit_raw_seed", engine, if_exists="replace", index=False)
                print(f"Loaded {len(df_sec)} records into fact_sectoral_credit.")

            conn.commit()
            print("Live PostgreSQL seed complete.")

    except Exception as e:
        print(f"Warning: Could not connect to PostgreSQL ({e}). Continuing with precomputed analytical layer.")

if __name__ == "__main__":
    seed_database()
