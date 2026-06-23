import unittest
import sys
import os

# Append src directory to python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from src.db.mock_database import get_policy, get_claims_history
from src.tools import OCRTool, ImageAnalysisTool, FraudRiskScoringTool
from src.orchestrator import AgentOrchestrator

class TestInsuranceClaimSystem(unittest.TestCase):

    def setUp(self):
        # We run the tests in offline/mock fallback mode
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
        self.orchestrator = AgentOrchestrator(use_live_llm=False)

    def test_database_records(self):
        """Test retrieving policy and claim history records from mock database."""
        policy_jane = get_policy("POL-1001")
        self.assertIsNotNone(policy_jane)
        self.assertEqual(policy_jane["holder_name"], "Jane Doe")
        self.assertEqual(policy_jane["status"], "Active")

        policy_expired = get_policy("POL-2002")
        self.assertEqual(policy_expired["status"], "Expired")

        history = get_claims_history("POL-2002")
        self.assertEqual(len(history), 4)  # 4 historical claims for POL-2002

    def test_ocr_tool_presets(self):
        """Test OCR tool preset outputs."""
        ocr = OCRTool(use_live_llm=False)
        text = ocr.extract_text("low_risk")
        self.assertIn("POL-1001", text)
        self.assertIn("Jane Doe", text)

    def test_image_analysis_presets(self):
        """Test image analysis preset outputs."""
        vision = ImageAnalysisTool(use_live_llm=False)
        analysis = vision.analyze_image("high_risk")
        self.assertEqual(analysis["severity"], "High")
        self.assertEqual(analysis["estimated_repair_cost"], 7500.0)

    def test_fraud_risk_scoring(self):
        """Test the fraud scoring logic directly."""
        scorer = FraudRiskScoringTool()
        
        # Test case for expired policy
        policy = get_policy("POL-2002")  # Expired
        claim = {
            "accident_date": "2026-06-15",
            "claim_amount": 4500.0,
            "ocr_text": "POL-2002 John Smith"
        }
        history = get_claims_history("POL-2002")
        image = {"estimated_repair_cost": 7500.0, "severity": "High"}
        
        res = scorer.calculate_score(claim, policy, history, image)
        self.assertGreaterEqual(res["score"], 65)  # High risk expected
        self.assertEqual(res["risk_level"], "High")
        self.assertTrue(any("expired" in sig.lower() for sig in res["fraud_signals"]))

    def test_orchestrator_end_to_end_low_risk(self):
        """Test end-to-end processing for a low-risk claim."""
        claim_input = {
            "claim_id": "CLM-DEMO-LOW",
            "scenario_name": "low_risk"
        }
        res = self.orchestrator.process_claim(claim_input)
        
        self.assertTrue(res["success"])
        self.assertEqual(res["recommendation"], "Approve")
        self.assertEqual(res["recommended_payout"], 800.0)
        self.assertEqual(res["document_verification"]["policy_id"], "POL-1001")
        self.assertEqual(res["damage_assessment"]["vehicle_detected"], "Toyota Camry")
        self.assertEqual(res["fraud_detection"]["risk_level"], "Low")

    def test_orchestrator_end_to_end_high_risk(self):
        """Test end-to-end processing for a high-risk claim."""
        claim_input = {
            "claim_id": "CLM-DEMO-HIGH",
            "scenario_name": "high_risk"
        }
        res = self.orchestrator.process_claim(claim_input)
        
        self.assertTrue(res["success"])
        self.assertEqual(res["recommendation"], "Reject")
        self.assertEqual(res["recommended_payout"], 0.0)
        self.assertEqual(res["fraud_detection"]["risk_level"], "High")
        self.assertIn("Claim filed under an expired policy", res["fraud_detection"]["fraud_signals"])

if __name__ == "__main__":
    unittest.main()
