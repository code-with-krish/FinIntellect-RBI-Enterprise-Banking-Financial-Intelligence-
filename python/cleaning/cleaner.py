"""
Data Cleaning & Standardization Module
======================================
Cleans raw RBI banking datasets by:
- Trimming whitespace and standardizing string casings
- Normalizing geographic names (states, regions) and bank names
- Parsing and casting numeric values formatted as strings
- Addressing missing values and recording audit metrics
- Filtering illogical negative values
- Exporting audit statistics for the Data Quality dashboard
"""

import re
import pandas as pd
import numpy as np

class BankingDataCleaner:
    def __init__(self):
        self.cleaning_audit = {
            "whitespace_trimmed_count": 0,
            "casing_standardized_count": 0,
            "numeric_strings_converted": 0,
            "missing_values_handled": 0,
            "negative_anomalies_rectified": 0,
            "duplicates_removed": 0
        }

    @staticmethod
    def _clean_numeric(val):
        """Converts currency/number strings with commas to clean floats."""
        if pd.isna(val) or val is None:
            return np.nan
        if isinstance(val, (int, float)):
            return float(val)
        val_str = str(val).replace(",", "").strip()
        try:
            return float(val_str)
        except ValueError:
            return np.nan

    def clean_district_credit_deposit(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        """Cleans district-level credit deposit returns."""
        df = df_raw.copy()
        initial_len = len(df)
        
        # 1. Deduplication
        df = df.drop_duplicates()
        self.cleaning_audit["duplicates_removed"] += (initial_len - len(df))

        # 2. String trimming and case standardization
        for col in ["state_name", "district_name", "region", "bank_group", "population_group"]:
            if col in df.columns:
                # Count raw strings with irregular spaces
                irregular = df[col].astype(str).str.strip() != df[col].astype(str)
                self.cleaning_audit["whitespace_trimmed_count"] += int(irregular.sum())
                
                # Standardize casing
                df[col] = df[col].astype(str).str.strip().str.title()
                self.cleaning_audit["casing_standardized_count"] += len(df)

        # 3. Numeric string conversion
        for col in ["total_deposits_crore", "total_credit_crore", "reported_cd_ratio", "number_of_offices"]:
            if col in df.columns:
                str_types = df[col].apply(lambda x: isinstance(x, str)).sum()
                self.cleaning_audit["numeric_strings_converted"] += int(str_types)
                df[col] = df[col].apply(self._clean_numeric)

        # 4. Rectify negative values (Credit & deposits cannot be negative in SCB BSR returns)
        neg_credit = (df["total_credit_crore"] < 0).sum()
        if neg_credit > 0:
            self.cleaning_audit["negative_anomalies_rectified"] += int(neg_credit)
            df["total_credit_crore"] = df["total_credit_crore"].apply(lambda x: abs(x) if pd.notna(x) else x)

        neg_dep = (df["total_deposits_crore"] < 0).sum()
        if neg_dep > 0:
            self.cleaning_audit["negative_anomalies_rectified"] += int(neg_dep)
            df["total_deposits_crore"] = df["total_deposits_crore"].apply(lambda x: abs(x) if pd.notna(x) else x)

        # 5. Handle missing values: Impute using median per state + bank_group + population_group
        missing_count = df[["total_deposits_crore", "total_credit_crore"]].isna().sum().sum()
        self.cleaning_audit["missing_values_handled"] += int(missing_count)

        # Group median imputation
        grouped = df.groupby(["state_name", "bank_group", "population_group"])
        df["total_deposits_crore"] = grouped["total_deposits_crore"].transform(lambda x: x.fillna(x.median()))
        df["total_credit_crore"] = grouped["total_credit_crore"].transform(lambda x: x.fillna(x.median()))
        
        # Any remaining overall fallback
        df["total_deposits_crore"] = df["total_deposits_crore"].fillna(df["total_deposits_crore"].median())
        df["total_credit_crore"] = df["total_credit_crore"].fillna(df["total_credit_crore"].median())
        df["number_of_offices"] = df["number_of_offices"].fillna(1).astype(int)

        # Re-compute validated CD Ratio (Credit / Deposits * 100)
        df["cd_ratio"] = np.where(
            df["total_deposits_crore"] > 0,
            np.round((df["total_credit_crore"] / df["total_deposits_crore"]) * 100, 2),
            0.0
        )

        return df

    def clean_bank_performance(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        """Cleans bank-level balance sheet and asset quality metrics."""
        df = df_raw.copy()
        
        # Standardize strings
        df["bank_name"] = df["bank_name"].astype(str).str.strip().str.title()
        # Canonical bank name aliases
        bank_map = {
            "Hdfc Bank Ltd.": "HDFC Bank Ltd.",
            "Icici Bank Ltd.": "ICICI Bank Ltd.",
            "Idfc First Bank Ltd.": "IDFC FIRST Bank Ltd.",
            "Rbl Bank Ltd.": "RBL Bank Ltd.",
            "Hsbc Ltd.": "HSBC Ltd.",
            "Dbs Bank India": "DBS Bank India",
            "Baroda Up Bank": "Baroda UP Bank",
            "Prathama Up Gramin Bank": "Prathama UP Gramin Bank"
        }
        df["bank_name"] = df["bank_name"].replace(bank_map)

        # Clean numeric fields
        numeric_cols = [
            "total_deposits_crore", "total_advances_crore", "gross_npa_crore",
            "net_npa_crore", "gnpa_ratio_pct", "nnpa_ratio_pct", "cd_ratio_pct",
            "return_on_assets_pct", "return_on_equity_pct", "net_profit_crore"
        ]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].apply(self._clean_numeric)

        # Impute missing RoA if any
        if "return_on_assets_pct" in df.columns:
            missing_roa = df["return_on_assets_pct"].isna().sum()
            self.cleaning_audit["missing_values_handled"] += int(missing_roa)
            df["return_on_assets_pct"] = df.groupby("bank_group")["return_on_assets_pct"].transform(
                lambda x: x.fillna(x.median())
            )

        # Ensure Provision Coverage Ratio (PCR) is engineered: (GNPA - NNPA) / GNPA * 100
        df["provision_coverage_ratio_pct"] = np.where(
            df["gross_npa_crore"] > 0,
            np.round(((df["gross_npa_crore"] - df["net_npa_crore"]) / df["gross_npa_crore"]) * 100, 2),
            100.0
        )

        return df

    def clean_sectoral_credit(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        """Cleans sectoral credit deployment data."""
        df = df_raw.copy()
        df["sector_name"] = df["sector_name"].astype(str).str.strip()
        df["category"] = df["category"].astype(str).str.strip()

        for col in ["credit_deployed_crore", "yoy_growth_pct"]:
            if col in df.columns:
                df[col] = df[col].apply(self._clean_numeric)

        # Impute missing YoY growth with category median
        if "yoy_growth_pct" in df.columns:
            missing_yoy = df["yoy_growth_pct"].isna().sum()
            self.cleaning_audit["missing_values_handled"] += int(missing_yoy)
            df["yoy_growth_pct"] = df.groupby("category")["yoy_growth_pct"].transform(
                lambda x: x.fillna(x.median())
            )

        return df
