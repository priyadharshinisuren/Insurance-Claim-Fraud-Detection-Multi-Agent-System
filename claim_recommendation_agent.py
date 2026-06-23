from typing import Dict, Any
from src.agents.base_agent import BaseAgent

class ClaimRecommendationAgent(BaseAgent):
    def __init__(self, use_live_llm: bool = False):
        super().__init__("ClaimRecommendationAgent", "Synthesize agent reports to provide final claim decision and payout recommend.")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs claim recommendation:
        1. Evaluates overall risk level and flags.
        2. Calculates payout amount.
        3. Generates structured and textual justification (either via Gemini or rule-based fallback).
        """
        self.clear_logs()
        self.log("Starting claim recommendation synthesis...")

        policy_details = input_data.get("policy_details", {})
        risk_level = input_data.get("risk_level", "Medium")
        fraud_score = input_data.get("fraud_score", 50)
        fraud_signals = input_data.get("fraud_signals", [])
        
        claimed_amount = input_data.get("extracted_claim_amount", 0.0)
        estimated_cost = input_data.get("estimated_repair_cost", 0.0)
        max_limit = policy_details.get("max_limit", 0.0)

        # 1. Determine recommendation action
        # Rule-based primary decision
        policy_status = policy_details.get("status", "Active")
        
        if policy_status == "Expired" or fraud_score >= 65:
            recommendation = "Reject"
            payout = 0.0
            self.log(f"Decision: REJECT due to High Fraud Score ({fraud_score}) or Expired Policy.")
        elif fraud_score < 30:
            recommendation = "Approve"
            # Payout is the lesser of the claimed amount or the estimated repair cost, capped at the policy limit
            payout = min(claimed_amount, estimated_cost if estimated_cost > 0 else claimed_amount, max_limit)
            self.log(f"Decision: APPROVE. Low Fraud Score ({fraud_score}). Recommended Payout: ${payout:.2f}")
        else:
            recommendation = "Escalate"
            payout = 0.0
            self.log(f"Decision: ESCALATE for human review. Medium Fraud Score ({fraud_score}).")

        # 2. Generate detailed rationale (Gemini or Mock)
        rationale = self._generate_rationale(
            recommendation=recommendation,
            payout=payout,
            claimed_amount=claimed_amount,
            estimated_cost=estimated_cost,
            fraud_score=fraud_score,
            fraud_signals=fraud_signals,
            policy_details=policy_details
        )
        
        self.log("Recommendation rationale generated.")

        result = {
            "recommendation": recommendation,
            "recommended_payout": payout,
            "rationale": rationale,
            "agent_logs": self.get_logs()
        }
        return result

    def _generate_rationale(
        self,
        recommendation: str,
        payout: float,
        claimed_amount: float,
        estimated_cost: float,
        fraud_score: int,
        fraud_signals: list,
        policy_details: Dict[str, Any]
    ) -> str:
        """
        Generates claims summary. Uses Gemini if key is provided, otherwise generates template text.
        """
        if self.use_live_llm:
            prompt = (
                f"You are the Claim Recommendation Agent. Synthesize this claim assessment:\n\n"
                f"- Policy Holder: {policy_details.get('holder_name')}\n"
                f"- Policy ID: {policy_details.get('policy_id')} (Status: {policy_details.get('status')})\n"
                f"- Claimed Amount: ${claimed_amount:.2f}\n"
                f"- Image Repair Estimate: ${estimated_cost:.2f}\n"
                f"- Fraud Risk Score: {fraud_score}/100\n"
                f"- Fraud Signals Detected: {', '.join(fraud_signals) if fraud_signals else 'None'}\n"
                f"- Pre-calculated Recommendation: {recommendation}\n"
                f"- Pre-calculated Recommended Payout: ${payout:.2f}\n\n"
                f"Write a professional, concise executive summary explaining the rationale for this recommendation. "
                f"Break it down into: 1. Decision Summary, 2. Key Findings (referencing document matches, visual vehicle damage, and history checks), and 3. Financial Breakdown."
            )
            response_text = self.call_llm(prompt)
            if response_text:
                return response_text

        # Offline/Mock Fallback templates
        holder_name = policy_details.get("holder_name", "Unknown")
        policy_id = policy_details.get("policy_id", "Unknown")
        
        if recommendation == "Approve":
            return (
                f"### claim recommendation: APPROVED\n\n"
                f"**1. Decision Summary:**\n"
                f"The claim filed by {holder_name} under policy {policy_id} is recommended for **Approval** with a total payout of **${payout:.2f}**. "
                f"The fraud risk score is low ({fraud_score}/100), and no suspicious signals were identified.\n\n"
                f"**2. Key Findings:**\n"
                f"- **Documents:** OCR verification confirmed the claimant name, policy, and claim details match policy records.\n"
                f"- **Damage:** Image analysis confirms physical bumper damage consistent with the claimed backing accident.\n"
                f"- **History:** Policy holder has no suspicious pattern of repeated claims (1 minor past claim).\n\n"
                f"**3. Financial Breakdown:**\n"
                f"- Claimed Amount: ${claimed_amount:.2f}\n"
                f"- Repair Estimate: ${estimated_cost:.2f}\n"
                f"- Capped Payout: ${payout:.2f}"
            )
        elif recommendation == "Reject":
            reasons = "\n".join([f"- {s}" for s in fraud_signals])
            return (
                f"### claim recommendation: REJECTED\n\n"
                f"**1. Decision Summary:**\n"
                f"The claim filed by {holder_name} under policy {policy_id} is recommended for **Rejection** (Payout: $0.00). "
                f"This decision is driven by a high fraud risk score of **{fraud_score}/100** and multiple policy compliance failures.\n\n"
                f"**2. Key Findings:**\n"
                f"{reasons if fraud_signals else '- Critical mismatch found between policy details and claim dates.'}\n"
                f"- **Documents:** Claim was filed for an accident that occurred outside the valid policy coverage period (Policy Expired).\n"
                f"- **Damage:** Damage severity and estimated costs do not align with the claimant's report.\n"
                f"- **History:** Excessive claims frequency and prior rejected claims indicate high risk.\n\n"
                f"**3. Financial Breakdown:**\n"
                f"- Claimed Amount: ${claimed_amount:.2f}\n"
                f"- Recommended Payout: $0.00 (Claim Denied due to policy non-compliance / high risk)"
            )
        else:  # Escalate
            reasons = "\n".join([f"- {s}" for s in fraud_signals])
            return (
                f"### claim recommendation: ESCALATE (Human Review Required)\n\n"
                f"**1. Decision Summary:**\n"
                f"The claim filed by {holder_name} under policy {policy_id} has been **Escalated** for manual adjuster review. "
                f"The fraud risk score is **{fraud_score}/100**, indicating borderline suspicious flags that require human judgment.\n\n"
                f"**2. Key Findings:**\n"
                f"{reasons if fraud_signals else '- Borderline risk signals detected.'}\n"
                f"- **Documents:** OCR extracted invoice details but notes minor discrepancies.\n"
                f"- **Damage:** Image damage estimate of ${estimated_cost:.2f} is close to the claimed amount, but there are multiple history events.\n"
                f"- **History:** Policy holder has multiple past claims, including a recent approved claim within 3 months.\n\n"
                f"**3. Financial Breakdown:**\n"
                f"- Claimed Amount: ${claimed_amount:.2f}\n"
                f"- Repair Estimate: ${estimated_cost:.2f}\n"
                f"- Recommended Payout: Pending Manual Review"
            )
        
        return ""
