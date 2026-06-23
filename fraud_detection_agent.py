from typing import Dict, Any, List
from src.agents.base_agent import BaseAgent
from src.tools import DatabaseSearchTool, FraudRiskScoringTool

class FraudDetectionAgent(BaseAgent):
    def __init__(self, use_live_llm: bool = False):
        super().__init__("FraudDetectionAgent", "Search claims history database and run fraud risk scoring models.")
        self.db_tool = DatabaseSearchTool()
        self.scoring_tool = FraudRiskScoringTool()

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs fraud detection:
        1. Searches policy details for the extracted policy ID.
        2. Retrieves the claims history of the policy holder.
        3. Calculates the fraud risk score based on policy details, history, OCR findings, and image damage analysis.
        """
        self.clear_logs()
        policy_id = input_data.get("extracted_policy_id")
        
        self.log(f"Starting fraud detection process for policy: {policy_id}")
        
        # 1. Database Policy Search
        self.log(f"Searching database for policy records: {policy_id}")
        policy_data = self.db_tool.search_policy(policy_id)
        if "error" in policy_data:
            self.log(f"Policy search failed: {policy_data['error']}")
            # Create a mock default policy for safety
            policy_data = {
                "policy_id": policy_id or "POL-UNKNOWN",
                "holder_name": input_data.get("extracted_claimant_name", "Unknown"),
                "status": "Active",
                "start_date": "2026-01-01",
                "end_date": "2026-12-31",
                "max_limit": 5000.0
            }
        else:
            self.log(f"Policy record found. Holder: {policy_data.get('holder_name')}, Status: {policy_data.get('status')}")
            
        # 2. Database Claims History Search
        self.log(f"Retrieving claims history for policy: {policy_id}")
        claims_history = self.db_tool.search_claims_history(policy_id)
        self.log(f"Retrieved {len(claims_history)} past claims.")

        # Recompile claim data from prior agents
        claim_data = {
            "accident_date": input_data.get("extracted_accident_date"),
            "claim_amount": input_data.get("extracted_claim_amount", 0.0),
            "ocr_text": input_data.get("ocr_text", "")
        }
        
        image_analysis = {
            "estimated_repair_cost": input_data.get("estimated_repair_cost", 0.0),
            "severity": input_data.get("image_severity", "Low")
        }

        # 3. Fraud Scoring
        self.log("Running fraud scoring rules and weighting models...")
        scoring_results = self.scoring_tool.calculate_score(
            claim_data=claim_data,
            policy_data=policy_data,
            claims_history=claims_history,
            image_analysis=image_analysis
        )
        
        self.log(f"Fraud Scoring complete. Score: {scoring_results.get('score')}/100, Level: {scoring_results.get('risk_level')}")
        for signal in scoring_results.get("fraud_signals", []):
            self.log(f"RED FLAG: {signal}")

        result = {
            "policy_details": policy_data,
            "claims_history": claims_history,
            "fraud_score": scoring_results.get("score"),
            "risk_level": scoring_results.get("risk_level"),
            "fraud_signals": scoring_results.get("fraud_signals"),
            "agent_logs": self.get_logs()
        }
        return result
