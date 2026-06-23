from typing import Dict, Any
from src.agents.base_agent import BaseAgent
from src.tools import ImageAnalysisTool

class DamageAssessmentAgent(BaseAgent):
    def __init__(self, use_live_llm: bool = False):
        super().__init__("DamageAssessmentAgent", "Inspect vehicle images to analyze damage location, severity, and repair cost.")
        self.image_tool = ImageAnalysisTool(use_live_llm)

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs damage assessment:
        1. Calls ImageAnalysisTool to inspect the vehicle photo.
        2. Compiles a summary of detected vehicle details and repair estimate.
        """
        self.clear_logs()
        self.log(f"Starting damage assessment process for claim: {input_data.get('claim_id', 'Unknown')}")
        
        image_path = input_data.get("image_path", "")
        if not image_path:
            # Fallback to scenario
            image_path = input_data.get("scenario_name", "low_risk")
            
        self.log(f"Retrieving damage photo from path/identifier: {image_path}")
        analysis = self.image_tool.analyze_image(image_path)
        
        self.log(f"Image analysis complete. Vehicle: {analysis.get('vehicle_detected')}")
        self.log(f"Severity: {analysis.get('severity')}, Repair Estimate: ${analysis.get('estimated_repair_cost')}")
        
        result = {
            "vehicle_detected": analysis.get("vehicle_detected"),
            "damage_detected": analysis.get("damage_detected"),
            "estimated_repair_cost": analysis.get("estimated_repair_cost"),
            "image_severity": analysis.get("severity"),
            "agent_logs": self.get_logs()
        }
        return result
