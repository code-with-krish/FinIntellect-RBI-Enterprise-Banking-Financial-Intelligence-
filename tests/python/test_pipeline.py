"""
Automated Test Suite for Python ETL, Validation & Analytics Pipeline
===================================================================
Tests cleaning rules, KPI accounting math, boundary checks,
anomaly detection, and ReportLab PDF compilation.
"""

import os
import sys
import unittest
import pandas as pd
import numpy as np

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from python.cleaning.cleaner import BankingDataCleaner
from python.validation.validator import BankingDataValidator
from python.anomaly_detection.detector import BankingAnomalyDetector
from python.report_generation.pdf_generator import BankingPDFReportGenerator

class TestBankingPipeline(unittest.TestCase):

    def setUp(self):
        self.cleaner = BankingDataCleaner()
        self.validator = BankingDataValidator()
        self.detector = BankingAnomalyDetector()

    def test_cleaning_whitespace_and_casing(self):
        raw_df = pd.DataFrame({
            "state_name": ["  maharashtra ", "DELHI  "],
            "district_name": ["mumbai ", " new delhi"],
            "region": [" western", "northern "],
            "bank_group": ["public sector banks ", "private sector banks"],
            "population_group": ["urban ", "metropolitan"],
            "total_deposits_crore": ["1,200.50", "4,500.00"],
            "total_credit_crore": ["950.00", "3,800.00"],
            "number_of_offices": [5, 12]
        })
        clean_df = self.cleaner.clean_district_credit_deposit(raw_df)
        
        # Verify casing
        self.assertEqual(clean_df["state_name"].iloc[0], "Maharashtra")
        self.assertEqual(clean_df["state_name"].iloc[1], "Delhi")
        # Verify numeric conversion from string
        self.assertIsInstance(clean_df["total_deposits_crore"].iloc[0], float)
        self.assertEqual(clean_df["total_deposits_crore"].iloc[0], 1200.50)

    def test_negative_financials_rectified(self):
        raw_df = pd.DataFrame({
            "state_name": ["Karnataka"],
            "district_name": ["Bengaluru"],
            "region": ["Southern"],
            "bank_group": ["Public Sector Banks"],
            "population_group": ["Metropolitan"],
            "total_deposits_crore": [-500.0],
            "total_credit_crore": [-400.0],
            "number_of_offices": [2]
        })
        clean_df = self.cleaner.clean_district_credit_deposit(raw_df)
        self.assertTrue((clean_df["total_deposits_crore"] >= 0).all())
        self.assertTrue((clean_df["total_credit_crore"] >= 0).all())

    def test_missing_value_imputation(self):
        raw_df = pd.DataFrame({
            "state_name": ["Gujarat", "Gujarat"],
            "district_name": ["Ahmedabad", "Surat"],
            "region": ["Western", "Western"],
            "bank_group": ["Private Sector Banks", "Private Sector Banks"],
            "population_group": ["Urban", "Urban"],
            "total_deposits_crore": [1000.0, np.nan],
            "total_credit_crore": [800.0, 750.0],
            "number_of_offices": [4, 6]
        })
        clean_df = self.cleaner.clean_district_credit_deposit(raw_df)
        self.assertFalse(clean_df["total_deposits_crore"].isna().any())

    def test_accounting_axiom_nnpa_le_gnpa(self):
        # Validation test
        bank_df = pd.DataFrame({
            "bank_name": ["Bank A"],
            "gross_npa_crore": [100.0],
            "net_npa_crore": [120.0], # Inconsistent: NNPA > GNPA
            "gnpa_ratio_pct": [5.0],
            "nnpa_ratio_pct": [6.0]
        })
        val = self.validator.validate_bank_performance(bank_df)
        self.assertIn("nnpa_exceeds_gnpa", val["violations_detail"])

    def test_anomaly_detection_zscore(self):
        # Create series with a deliberate extreme outlier
        normal_values = list(np.random.normal(100, 5, 50))
        outlier = [1000.0] # Massive outlier
        df = pd.DataFrame({
            "total_credit_crore": normal_values + outlier,
            "district_name": [f"Dist_{i}" for i in range(50)] + ["Anomalous_Dist"],
            "quarter": ["FY2024-Q4"] * 51
        })
        self.detector.detect_zscore_anomalies(df, "total_credit_crore", "district_name", "quarter", threshold=2.5)
        self.assertTrue(len(self.detector.anomalies) > 0)
        self.assertEqual(self.detector.anomalies[0]["entity"], "Anomalous_Dist")

    def test_pdf_generation(self):
        dummy_summary = {
            "metadata": {"total_records_processed": 5000},
            "kpis": {
                "total_deposits_crore": 1000000.0,
                "total_advances_crore": 800000.0,
                "cd_ratio_pct": 80.0,
                "gnpa_ratio_pct": 2.5,
                "avg_roa_pct": 1.2,
                "total_branches": 1500
            },
            "bank_groups": [{"bank_group": "Public Sector Banks", "total_deposits": 600000, "total_advances": 480000, "avg_gnpa_ratio": 2.8, "avg_roa": 1.1}],
            "states": [{"state": "Maharashtra", "credit": 200000, "deposits": 250000, "offices": 800, "cd_ratio": 80.0}]
        }
        test_pdf_path = "reports/test_executive_report.pdf"
        gen = BankingPDFReportGenerator(test_pdf_path)
        result_path = gen.generate_report(dummy_summary)
        self.assertTrue(os.path.exists(result_path))
        self.assertTrue(os.path.getsize(result_path) > 1000)

if __name__ == "__main__":
    unittest.main()
