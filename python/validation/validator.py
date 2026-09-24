"""
Data Quality Validation & Business Rule Engine
=============================================
Enforces banking accounting constraints, schema correctness, and domain rules.
Calculates Completeness and Consistency Scores for the Data Quality Dashboard.
"""

import pandas as pd
import numpy as np

class BankingDataValidator:
    def __init__(self):
        self.validation_results = {
            "total_records_evaluated": 0,
            "passed_records": 0,
            "failed_records": 0,
            "rule_violations": {},
            "completeness_score_pct": 100.0,
            "consistency_score_pct": 100.0
        }

    def validate_district_data(self, df: pd.DataFrame) -> dict:
        """Validates district credit-deposit records against banking domain rules."""
        total = len(df)
        violations = {}

        # Rule 1: Non-negative financial values
        invalid_deposits = (df["total_deposits_crore"] < 0).sum()
        invalid_credit = (df["total_credit_crore"] < 0).sum()
        if invalid_deposits > 0 or invalid_credit > 0:
            violations["negative_financials"] = int(invalid_deposits + invalid_credit)

        # Rule 2: Minimum office count
        invalid_offices = (df["number_of_offices"] <= 0).sum()
        if invalid_offices > 0:
            violations["zero_or_negative_branches"] = int(invalid_offices)

        # Rule 3: Extreme CD ratio bounds (0.05 <= CD Ratio <= 4.0)
        extreme_cd = ((df["cd_ratio"] < 5.0) | (df["cd_ratio"] > 400.0)).sum()
        if extreme_cd > 0:
            violations["extreme_cd_ratio_outliers"] = int(extreme_cd)

        # Rule 4: Required geographical attribution
        missing_geo = (df["state_name"].isna() | (df["state_name"] == "") |
                       df["district_name"].isna() | (df["district_name"] == "")).sum()
        if missing_geo > 0:
            violations["missing_geography"] = int(missing_geo)

        total_violations = sum(violations.values())
        completeness_pct = round(100.0 - (df.isna().sum().sum() / (df.shape[0] * df.shape[1]) * 100), 2)
        consistency_pct = round(max(0.0, 100.0 - (total_violations / total * 100)), 2)

        return {
            "dataset": "district_credit_deposit",
            "total_rows": total,
            "total_violations": total_violations,
            "violations_detail": violations,
            "completeness_score_pct": completeness_pct,
            "consistency_score_pct": consistency_pct
        }

    def validate_bank_performance(self, df: pd.DataFrame) -> dict:
        """Validates balance sheet accounting constraints on SCBs."""
        total = len(df)
        violations = {}

        # Rule 1: NNPA must never exceed GNPA (Accounting axiom)
        nnpa_exceeds_gnpa = (df["net_npa_crore"] > df["gross_npa_crore"]).sum()
        if nnpa_exceeds_gnpa > 0:
            violations["nnpa_exceeds_gnpa"] = int(nnpa_exceeds_gnpa)

        # Rule 2: GNPA ratio must be >= NNPA ratio
        ratio_inconsistency = (df["nnpa_ratio_pct"] > df["gnpa_ratio_pct"]).sum()
        if ratio_inconsistency > 0:
            violations["nnpa_ratio_exceeds_gnpa_ratio"] = int(ratio_inconsistency)

        # Rule 3: Solvency bounds (GNPA ratio between 0% and 50%)
        abnormal_gnpa = ((df["gnpa_ratio_pct"] < 0) | (df["gnpa_ratio_pct"] > 50.0)).sum()
        if abnormal_gnpa > 0:
            violations["abnormal_gnpa_ratio"] = int(abnormal_gnpa)

        total_violations = sum(violations.values())
        completeness_pct = round(100.0 - (df.isna().sum().sum() / (df.shape[0] * df.shape[1]) * 100), 2)
        consistency_pct = round(max(0.0, 100.0 - (total_violations / total * 100)), 2)

        return {
            "dataset": "bank_performance",
            "total_rows": total,
            "total_violations": total_violations,
            "violations_detail": violations,
            "completeness_score_pct": completeness_pct,
            "consistency_score_pct": consistency_pct
        }
