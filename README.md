# Insurance-Claim-Fraud-Detection-Multi-Agent-System
This plan outlines the design and implementation of a multi-agent AI system to detect fraudulent insurance claims and recommend actions (Approve, Reject, or Escalate). The system integrates document verification, damage assessment, historical database checks, and fraud scoring.

Goal Description
Insurance companies face massive losses from fraudulent claims, while processing legitimate claims takes too long. This solution automates the workflow using a multi-agent system:

Document Verification Agent: Cross-checks claim forms, invoices, and police reports using OCR.
Damage Assessment Agent: Analyzes vehicle images to estimate repair cost and verify damage severity.
Fraud Detection Agent: Searches historical databases and calculates an overall fraud risk score.
Claim Recommendation Agent: Summarizes all findings and makes a final recommendation.
The project will provide a functional Python agent orchestrator, a FastAPI backend, and a premium Vanilla HTML/CSS/JS frontend dashboard to visualize the execution of the agents step-by-step.

User Review Required
IMPORTANT

API & Execution Model: By default, the system will use pre-configured mock data and rule-based fallback logic so it is fully runnable out-of-the-box without API keys. If a Google Gemini API Key (GEMINI_API_KEY) is provided, the agents will call live Gemini models to perform real OCR, image analysis, and recommendation generation.

Please let me know if you would like me to set up integration with any other specific LLM library or framework (e.g., LangChain, AutoGen). Otherwise, I will use a clean, standard Python implementation.
capstone1/
├── src/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py
│   │   ├── document_verification_agent.py
│   │   ├── damage_assessment_agent.py
│   │   ├── fraud_detection_agent.py
│   │   └── claim_recommendation_agent.py
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── ocr_tool.py
│   │   ├── image_analysis_tool.py
│   │   ├── database_search_tool.py
│   │   └── fraud_risk_scoring_tool.py
│   ├── db/
│   │   ├── mock_database.py
│   │   └── claims_history.json
│   ├── orchestrator.py
│   └── server.py
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── requirements.txt
├── README.md
└── run.bat

Backend Components (Python)
[NEW] 
base_agent.py
Defines the base class for all agents, handling common logging, environment check, and Gemini LLM calls (if enabled).

[NEW] 
document_verification_agent.py
Extracts claim details (Policy Number, Accident Date, Claim Amount) and cross-checks them against policy parameters using the OCR Tool. It flags mismatches (e.g., accident date outside policy coverage window).

[NEW] 
damage_assessment_agent.py
Inspects claim vehicle photos using the Image Analysis Tool. It estimates repair cost, detects damage location, and flags inconsistencies (e.g., claim details say front collision, but image shows rear bumper damage).

[NEW] 
fraud_detection_agent.py
Queries historical claims via the Database Search Tool to look for red flags (e.g., claimant has filed 3 claims in past 6 months). Computes a numeric risk score (0-100) using the Fraud Risk Scoring Tool.

[NEW] 
claim_recommendation_agent.py
Aggregates logs and outputs from all previous agents. Generates the final decision: Approve, Reject, or Escalate (Human Review required), along with a natural language rationale.

[NEW] Tools (src/tools/)
ocr_tool.py: Simulates text extraction from claim documents, or uses Gemini Flash to read file if key provided.
image_analysis_tool.py: Simulates damage detection, or uses Gemini Flash Multimodal capabilities to assess car damage.
database_search_tool.py: Queries policy/claims mock databases.
fraud_risk_scoring_tool.py: Applies risk matrix weights (document discrepancies + claims history + damage mismatches) to generate score.
[NEW] Orchestration & Server
orchestrator.py: Manages the sequential flow of data from one agent to the next, compiling execution trace logs.
server.py: FastAPI server that provides API endpoints:
GET /claims: Returns list of preset demo claims.
POST /analyze: Submits a claim to the orchestrator to run the agents and return step-by-step logs/results.
Frontend Components (HTML/CSS/JS)
[NEW] 
index.html
A semantic HTML5 single-page application. Features:

Clean dark-mode layout with a sidebar showing stats/metrics.
Preset claimant selector to test different scenario risks (Low, High, Suspicious).
Live execution tracker: showing visual "agent nodes" (Document Verification, Damage Assessment, Fraud Detection, Recommendation) that illuminate/pulse when active.
Result panels detailing what each agent found.
[NEW] 
styles.css
Premium, custom CSS styling including:

Zinc-inspired dark theme matching the design system (#09090b background, #0c0c0f cards, #1e1e24 borders).
Smooth grid transitions.
Glowing animations for executing agents.
Custom progress bar indicators for risk score.
[NEW] 
app.js
Handles frontend behavior:

Triggers agent execution animations.
Renders step-by-step logs in real-time to simulate agent thinking/tool usage.
Integrates with the FastAPI server if running, or falls back to an offline interactive client-side simulation.
Verification Plan
Automated Tests
Create a test script test_system.py to verify that:
OCR tool runs correctly.
Database search queries return correct records.
Fraud score is calculated correctly.
Orchestrator completes sequential execution.
Run tests via python:
powershell

python -m unittest discover -s src -p "*_test.py"
Manual Verification
Run backend server:
powershell

uvicorn src.server:app --reload --port 8000
Open frontend/index.html in browser.
Verify that selecting presets (Low Risk, Suspicious, High Risk) triggers appropriate step-by-step animations and yields the correct final recommendations.
Verify layout responsiveness across desktop and mobile screen sizes.
youtube link: https://lnkd.in/ga_xixV8
