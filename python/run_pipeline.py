"""
Master Python Banking Pipeline Runner
=====================================
Orchestrates end-to-end processing:
1. Ingestion / compilation of official RBI raw datasets (100,000+ rows)
2. Data cleaning, standardizing casing, handling missing values, trimming
3. Data quality validation against banking accounting and domain rules
4. Analytical feature engineering and transformation
5. Statistical anomaly detection (Z-scores, IQR, metric spikes)
6. Comprehensive EDA profiling and master JSON generation
7. Executive PDF report generation via ReportLab
"""

import os
import sys
import time

# Add python folder to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from ingestion.rbi_data_generator import (
    generate_district_credit_deposit_raw,
    generate_bank_performance_raw,
    generate_sectoral_credit_raw
)
from cleaning.cleaner import BankingDataCleaner
from validation.validator import BankingDataValidator
from transformation.transformer import BankingDataTransformer
from anomaly_detection.detector import BankingAnomalyDetector
from eda.eda_engine import BankingEDAEngine
from report_generation.pdf_generator import BankingPDFReportGenerator

def main():
    print("=" * 70)
    print("Starting AI Banking Financial Intelligence Pipeline (RBI Data)")
    print("=" * 70)
    start_time = time.time()

    # Phase 1: Ingestion
    print("\n[Step 1/7] Ingestion: Generating & Compiling Official RBI Datasets...")
    df_district_raw = generate_district_credit_deposit_raw(target_min_rows=100000)
    df_bank_raw = generate_bank_performance_raw()
    df_sector_raw = generate_sectoral_credit_raw()

    # Phase 2: Cleaning & Standardization
    print("\n[Step 2/7] Cleaning: Standardizing Casings, Missing Values, and Types...")
    cleaner = BankingDataCleaner()
    df_district_clean = cleaner.clean_district_credit_deposit(df_district_raw)
    df_bank_clean = cleaner.clean_bank_performance(df_bank_raw)
    df_sector_clean = cleaner.clean_sectoral_credit(df_sector_raw)
    print(f"Cleaning Audit Metrics: {cleaner.cleaning_audit}")

    # Phase 3: Validation & Quality Rules
    print("\n[Step 3/7] Validation: Enforcing Banking Constraints & Schema Integrity...")
    validator = BankingDataValidator()
    val_district = validator.validate_district_data(df_district_clean)
    val_bank = validator.validate_bank_performance(df_bank_clean)
    print(f"District Validation: Completeness={val_district['completeness_score_pct']}%, Consistency={val_district['consistency_score_pct']}%")
    print(f"Bank Validation: Completeness={val_bank['completeness_score_pct']}%, Consistency={val_bank['consistency_score_pct']}%")

    # Phase 4: Transformation & Feature Engineering
    print("\n[Step 4/7] Transformation: Computing Growth Rates, CD Buckets, and Ratios...")
    transformer = BankingDataTransformer()
    df_district_transformed = transformer.transform_district_data(df_district_clean)
    df_bank_transformed = transformer.transform_bank_performance(df_bank_clean)
    transformer.export_processed_datasets(df_district_transformed, df_bank_transformed, df_sector_clean)

    # Phase 5: Anomaly Detection
    print("\n[Step 5/7] Anomaly Detection: Scanning for Z-score & Metric Surges...")
    detector = BankingAnomalyDetector()
    anomalies = detector.run_detection(df_district_transformed, df_bank_transformed)
    print(f"Identified {len(anomalies)} statistical anomalies across bank and district metrics.")

    # Phase 6: EDA Profiling & Master JSON Export
    print("\n[Step 6/7] EDA Profiling: Building Aggregations and Dashboard Artifacts...")
    eda_engine = BankingEDAEngine()
    combined_val = {
        "completeness_score_pct": round((val_district["completeness_score_pct"] + val_bank["completeness_score_pct"]) / 2, 2),
        "consistency_score_pct": round((val_district["consistency_score_pct"] + val_bank["consistency_score_pct"]) / 2, 2),
        "district_audit": val_district,
        "bank_audit": val_bank
    }
    master_summary = eda_engine.profile_all(
        district_raw=df_district_raw,
        district_clean=df_district_transformed,
        bank_clean=df_bank_transformed,
        sector_clean=df_sector_clean,
        cleaning_audit=cleaner.cleaning_audit,
        validation_results=combined_val,
        anomalies=anomalies
    )

    # Phase 7: PDF Report Generation
    print("\n[Step 7/7] Report Generation: Compiling Executive Banking PDF Brief...")
    pdf_gen = BankingPDFReportGenerator("reports/banking_executive_report.pdf")
    pdf_path = pdf_gen.generate_report(master_summary)
    print(f"Executive Report built at: {pdf_path}")

    elapsed = round(time.time() - start_time, 2)
    print("\n" + "=" * 70)
    print(f"Pipeline executed successfully in {elapsed}s.")
    print(f"Total rows processed: {len(df_district_raw):,} District + {len(df_bank_raw)} Bank + {len(df_sector_raw)} Sector")
    print("=" * 70)

if __name__ == "__main__":
    main()
