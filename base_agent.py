import os
import logging
from typing import Dict, Any, List
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.logger = logging.getLogger(name)
        self.logs: List[str] = []
        
        # Check for Gemini API key
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.use_live_llm = bool(self.api_key)
        
        if self.use_live_llm:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
            self.log(f"Initialized agent with live Gemini LLM capabilities.")
        else:
            self.log(f"Initialized agent in offline/mock fallback mode.")

    def log(self, message: str):
        self.logger.info(message)
        self.logs.append(message)

    def get_logs(self) -> List[str]:
        return self.logs

    def clear_logs(self):
        self.logs = []

    def call_llm(self, prompt: str, system_instruction: str = None) -> str:
        if not self.use_live_llm:
            return ""
        
        try:
            self.log(f"Sending prompt to Gemini (length: {len(prompt)})...")
            
            kwargs = {}
            if system_instruction:
                # Note: System instructions are supported in newer SDK versions as part of GenerativeModel initialization
                # or generation config, we'll initialize a temp model with it to be safe
                temp_model = genai.GenerativeModel(
                    "gemini-1.5-flash",
                    system_instruction=system_instruction
                )
                response = temp_model.generate_content(prompt)
            else:
                response = self.model.generate_content(prompt)
                
            self.log("Received response from Gemini successfully.")
            return response.text
        except Exception as e:
            self.log(f"Error calling Gemini: {str(e)}. Falling back to mock responses.")
            return ""
            
    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main execution function to be overridden by subclasses."""
        raise NotImplementedError("Subclasses must implement run()")
