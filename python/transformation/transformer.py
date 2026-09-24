"""
Data Transformation & Feature Engineering Engine
================================================
Constructs analytical attributes, calculates compound metrics,
and prepares normalized tables for PostgreSQL ingestion and SQL analytics.
"""

import os
import pandas as pd
import numpy as np

DATA_PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")
os.makedirs(DATA_PROCESSED_DIR, exist_ok=True)

class BankingDataTransformer:
    def __init__(self):
        pass

    @staticmethod
    def classify_cd_ratio(ratio: float) -> str:
        """Classifies liquidity and credit deployment health."""
        if pd.isna(ratio) or ratio == 0:
            return "Unavailable"
        if ratio < 60.0:
            return "Under-deployed (Surplus Liquidity)"
        elif ratio <= 75.0:
            return "Moderate Deployment"
        elif ratio <= 85.0:
            return "Optimal Deployment"
        else:
            return "Strained (High Credit Deployment)"

    @staticmethod
    def classify_asset_quality(gnpa_ratio: float) -> str:
        """Categorizes bank credit risk according to RBI prudential standards."""
        if pd.isna(gnpa_ratio):
            return "Unknown"
        if gnpa_ratio < 3.0:
            return "Prime / Low Risk"
        elif gnpa_ratio <= 6.0:
            return "Moderate Risk"
        else:
            return "Elevated Watch / High Risk"

    def transform_district_data(self, df_clean: pd.DataFrame) -> pd.DataFrame:
        """Adds analytical dimensions to district BSR returns."""
        df = df_clean.copy()
        
        # 1. CD Ratio bucket
        df["cd_ratio_category"] = df["cd_ratio"].apply(self.classify_cd_ratio)

        # 2. Per-branch productivity metrics
        df["deposits_per_branch_crore"] = np.where(
            df["number_of_offices"] > 0,
            np.round(df["total_deposits_crore"] / df["number_of_offices"], 2),
            0.0
        )
        df["credit_per_branch_crore"] = np.where(
            df["number_of_offices"] > 0,
            np.round(df["total_credit_crore"] / df["number_of_offices"], 2),
            0.0
        )

        return df

    def transform_bank_performance(self, df_clean: pd.DataFrame) -> pd.DataFrame:
        """Adds multi-period growth and prudential coverage metrics to bank performance."""
        df = df_clean.copy()

        # Sort chronologically per bank
        df = df.sort_values(by=["bank_name", "fiscal_year"])

        # Asset quality classification
        df["risk_classification"] = df["gnpa_ratio_pct"].apply(self.classify_asset_quality)

        # YoY Growth calculations per bank
        df["deposit_yoy_growth_pct"] = df.groupby("bank_name")["total_deposits_crore"].pct_change() * 100
        df["credit_yoy_growth_pct"] = df.groupby("bank_name")["total_advances_crore"].pct_change() * 100
        df["gnpa_yoy_change_pct"] = df.groupby("bank_name")["gnpa_ratio_pct"].diff()

        # Round figures
        df["deposit_yoy_growth_pct"] = df["deposit_yoy_growth_pct"].round(2).fillna(0.0)
        df["credit_yoy_growth_pct"] = df["credit_yoy_growth_pct"].round(2).fillna(0.0)
        df["gnpa_yoy_change_pct"] = df["gnpa_yoy_change_pct"].round(2).fillna(0.0)

        return df

    def export_processed_datasets(self, district_df: pd.DataFrame, bank_df: pd.DataFrame, sector_df: pd.DataFrame):
        """Saves clean, transformed analytical datasets into data/processed/."""
        dist_path = os.path.join(DATA_PROCESSED_DIR, "district_credit_deposit_clean.parquet")
        dist_csv = os.path.join(DATA_PROCESSED_DIR, "district_credit_deposit_clean.csv")
        district_df.to_parquet(dist_path, index=False)
        # Also export compressed or sampled CSV for review
        district_df.head(10000).to_csv(dist_csv, index=False)

        bank_path = os.path.join(DATA_PROCESSED_DIR, "bank_performance_clean.csv")
        bank_df.to_csv(bank_path, index=False)

        sec_path = os.path.join(DATA_PROCESSED_DIR, "sectoral_credit_clean.csv")
        sector_df.to_csv(sec_path, index=False)

        print(f"Exported processed datasets to {DATA_PROCESSED_DIR}")
