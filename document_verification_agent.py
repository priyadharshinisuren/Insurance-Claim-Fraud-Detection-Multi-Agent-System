import re
import json
from typing import Dict, Any
from src.agents.base_agent import BaseAgent
from src.tools import OCRTool

class DocumentVerificationAgent(BaseAgent):
    def __init__(self, use_live_llm: bool = False):
        super().__init__("DocumentVerificationAgent", "Verify claims documents and extract key claim metadata using OCR.")
        self.ocr_tool = OCRTool(use_live_llm)

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs document verification:
        1. Calls OCR Tool to get text from the claim document.
        2. Parses raw text to extract Policy ID, Claimant Name, Accident Date, and Claim Amount.
        3. Returns structured data.
        """
        self.clear_logs()
        self.log(f"Starting document verification process for claim input: {input_data.get('claim_id', 'Unknown')}")
        
        document_path = input_data.get("document_path", "")
        if not document_path:
            # Fallback to claim_id or scenario if no specific path
            document_path = input_data.get("scenario_name", "low_risk")
            
        self.log(f"Retrieving claims document from path/identifier: {document_path}")
        ocr_text = self.ocr_tool.extract_text(document_path)
        self.log(f"OCR scan completed. Character count: {len(ocr_text)}")
        
        # Parse text into structured fields
        extracted = self._parse_ocr_text(ocr_text, input_data)
        
        self.log(f"Extracted claim details: Policy: {extracted.get('policy_id')}, Date: {extracted.get('accident_date')}, Amount: ${extracted.get('claim_amount')}")
        
        # Return merged result
        result = {
            "ocr_text": ocr_text,
            "extracted_policy_id": extracted.get("policy_id"),
            "extracted_claimant_name": extracted.get("claimant_name"),
            "extracted_accident_date": extracted.get("accident_date"),
            "extracted_claim_amount": extracted.get("claim_amount"),
            "extracted_description": extracted.get("description"),
            "agent_logs": self.get_logs()
        }
        return result

    def _parse_ocr_text(self, ocr_text: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Helper to parse OCR text. Uses Gemini LLM if available, otherwise regex/preset fallback.
        """
        if self.use_live_llm:
            prompt = (
                f"Below is text extracted from an insurance claim document via OCR.\n\n"
                f"--- OCR TEXT START ---\n{ocr_text}\n--- OCR TEXT END ---\n\n"
                f"Extract the following values and return them strictly as a JSON object:\n"
                f"- policy_id: Policy number (e.g. POL-XXXX)\n"
                f"- claimant_name: Name of the claimant/holder\n"
                f"- accident_date: Date of the accident (format: YYYY-MM-DD)\n"
                f"- claim_amount: Estimated or requested amount (number, e.g. 1200.00)\n"
                f"- description: Brief description of the accident from the text\n\n"
                f"Format details: Output only the raw JSON. Do not include markdown wraps."
            )
            response_text = self.call_llm(prompt)
            if response_text:
                try:
                    # Clean response text in case it wrapped with ```json ... ```
                    cleaned_text = response_text.strip()
                    match = re.search(r"\{.*\}", cleaned_text, re.DOTALL)
                    if match:
                        return json.loads(match.group(0))
                except Exception as e:
                    self.log(f"Failed to parse LLM response: {str(e)}. Falling back to rules.")

        # Rules-based parsing fallback
        parsed = {
            "policy_id": "POL-1001",
            "claimant_name": "Jane Doe",
            "accident_date": "2026-06-18",
            "claim_amount": 850.00,
            "description": "Minor scrape on bumper"
        }
        
        # If we have preset data matched, extract directly
        scenario = input_data.get("scenario_name", "")
        if "high" in scenario or "POL-2002" in ocr_text:
            parsed = {
                "policy_id": "POL-2002",
                "claimant_name": "John Smith",
                "accident_date": "2026-06-15",
                "claim_amount": 4500.00,
                "description": "Front collision with another vehicle"
            }
        elif "susp" in scenario or "POL-3003" in ocr_text:
            parsed = {
                "policy_id": "POL-3003",
                "claimant_name": "Bob Johnson",
                "accident_date": "2026-06-20",
                "claim_amount": 3200.00,
                "description": "Collision with stray deer, bumper/headlight damage"
            }
        else:
            # Let's try simple regex search on the OCR text
            policy_match = re.search(r"POL-\d{4}", ocr_text)
            if policy_match:
                parsed["policy_id"] = policy_match.group(0)
                
            amount_match = re.search(r"\$\s*([\d,]+\.?\d*)", ocr_text)
            if amount_match:
                parsed["claim_amount"] = float(amount_match.group(1).replace(",", ""))
                
            date_match = re.search(r"(\d{4}-\d{2}-\d{2})", ocr_text)
            if date_match:
                parsed["accident_date"] = date_match.group(1)

        return parsed
