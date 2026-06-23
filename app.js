// Guardian AI — Frontend Controller

// Local Offline Simulation Preset Data (Matches Python Mock DB exactly)
const LOCAL_PRESETS = {
    "low_risk": {
        "claim_id": "CLM-DEMO-LOW",
        "scenario": "low_risk",
        "recommendation": "Approve",
        "recommended_payout": 800.0,
        "rationale": "### Claim Recommendation: APPROVED\n\n**1. Decision Summary:**\nThe claim filed by Jane Doe under policy POL-1001 is recommended for **Approval** with a total payout of **$800.00**. The fraud risk score is low (12/100), and no suspicious signals were identified.\n\n**2. Key Findings:**\n- **Documents:** OCR verification confirmed the claimant name, policy, and claim details match policy records.\n- **Damage:** Image analysis confirms physical bumper damage consistent with the claimed backing accident.\n- **History:** Policy holder has no suspicious pattern of repeated claims (1 minor past claim).\n\n**3. Financial Breakdown:**\n- Claimed Amount: $850.00\n- Repair Estimate: $800.00\n- Capped Payout: $800.00",
        "document_verification": {
            "policy_id": "POL-1001",
            "claimant_name": "Jane Doe",
            "accident_date": "2026-06-18",
            "claim_amount": 850.0,
            "description": "Backed into a low concrete pillar in a parking garage.",
            "ocr_text": "CLAIM FORM - SECURE INSURANCE\nPolicy: POL-1001\nHolder: Jane Doe\nAccident Date: 2026-06-18\nReported Amount: $850.00\nDetails: Backed into pillar, rear bumper scraped."
        },
        "damage_assessment": {
            "vehicle_detected": "Toyota Camry",
            "damage_detected": "Minor scrape and surface dent on rear bumper",
            "estimated_repair_cost": 800.0,
            "severity": "Low"
        },
        "fraud_detection": {
            "policy_holder": "Jane Doe",
            "policy_status": "Active",
            "policy_limit": 5000.0,
            "claims_history_count": 1,
            "fraud_score": 12,
            "risk_level": "Low",
            "fraud_signals": ["Policy holder has 1 previous claim(s) in history"]
        },
        "execution_trace": [
            {
                "agent": "DocumentVerificationAgent",
                "logs": [
                    "Starting document verification process for claim input: CLM-DEMO-LOW",
                    "Retrieving claims document from path/identifier: jane_doe_claim_form.pdf",
                    "OCR scan completed. Character count: 147",
                    "Extracted claim details: Policy: POL-1001, Date: 2026-06-18, Amount: $850.0"
                ]
            },
            {
                "agent": "DamageAssessmentAgent",
                "logs": [
                    "Starting damage assessment process for claim: CLM-DEMO-LOW",
                    "Retrieving damage photo from path/identifier: rear_bumper_scratch.jpg",
                    "Image analysis complete. Vehicle: Toyota Camry",
                    "Severity: Low, Repair Estimate: $800.0"
                ]
            },
            {
                "agent": "FraudDetectionAgent",
                "logs": [
                    "Starting fraud detection process for policy: POL-1001",
                    "Searching database for policy records: POL-1001",
                    "Policy record found. Holder: Jane Doe, Status: Active",
                    "Retrieving claims history for policy: POL-1001",
                    "Retrieved 1 past claims.",
                    "Running fraud scoring rules and weighting models...",
                    "Fraud Scoring complete. Score: 12/100, Level: Low",
                    "RED FLAG: Policy holder has 1 previous claim(s) in history"
                ]
            },
            {
                "agent": "ClaimRecommendationAgent",
                "logs": [
                    "Starting claim recommendation synthesis...",
                    "Decision: APPROVE. Low Fraud Score (12). Recommended Payout: $800.00",
                    "Recommendation rationale generated."
                ]
            }
        ]
    },
    "suspicious": {
        "claim_id": "CLM-DEMO-SUSP",
        "scenario": "suspicious",
        "recommendation": "Escalate",
        "recommended_payout": 0.0,
        "rationale": "### Claim Recommendation: ESCALATE (Human Review Required)\n\n**1. Decision Summary:**\nThe claim filed by Bob Johnson under policy POL-3003 has been **Escalated** for manual adjuster review. The fraud risk score is **45/100**, indicating borderline suspicious flags that require human judgment.\n\n**2. Key Findings:**\n- **History:** Policy holder has multiple past claims, including a recent approved claim within 3 months.\n- **Documents:** OCR extracted invoice details but notes minor discrepancies.\n- **Damage:** Image damage estimate of $3,100.00 is close to the claimed amount, but there are multiple history events.\n\n**3. Financial Breakdown:**\n- Claimed Amount: $3,200.00\n- Repair Estimate: $3,100.00\n- Recommended Payout: Pending Manual Review",
        "document_verification": {
            "policy_id": "POL-3003",
            "claimant_name": "Bob Johnson",
            "accident_date": "2026-06-20",
            "claim_amount": 3200.0,
            "description": "Hit a stray deer while driving at night. Bumper dent and cracked headlight.",
            "ocr_text": "INVOICE - AUTOBODY EXPERTS\nClient: Bob Johnson\nPolicy: POL-3003\nDate: 2026-06-22\nAmount Due: $3,200.00\nServices: Replaced front bumper assembly and left headlight unit."
        },
        "damage_assessment": {
            "vehicle_detected": "Ford F-150",
            "damage_detected": "Moderate front-left bumper dent, headlight assembly missing/smashed",
            "estimated_repair_cost": 3100.0,
            "severity": "Medium"
        },
        "fraud_detection": {
            "policy_holder": "Bob Johnson",
            "policy_status": "Active",
            "policy_limit": 15000.0,
            "claims_history_count": 1,
            "fraud_score": 45,
            "risk_level": "Medium",
            "fraud_signals": [
                "Policy holder has 1 previous claim(s) in history",
                "Policy holder name 'Bob Johnson' not found in OCR extracted document text"
            ]
        },
        "execution_trace": [
            {
                "agent": "DocumentVerificationAgent",
                "logs": [
                    "Starting document verification process for claim input: CLM-DEMO-SUSP",
                    "Retrieving claims document from path/identifier: bob_johnson_invoice.jpg",
                    "OCR scan completed. Character count: 162",
                    "Extracted claim details: Policy: POL-3003, Date: 2026-06-20, Amount: $3,200.0"
                ]
            },
            {
                "agent": "DamageAssessmentAgent",
                "logs": [
                    "Starting damage assessment process for claim: CLM-DEMO-SUSP",
                    "Retrieving damage photo from path/identifier: deer_damage.jpg",
                    "Image analysis complete. Vehicle: Ford F-150",
                    "Severity: Medium, Repair Estimate: $3,100.0"
                ]
            },
            {
                "agent": "FraudDetectionAgent",
                "logs": [
                    "Starting fraud detection process for policy: POL-3003",
                    "Searching database for policy records: POL-3003",
                    "Policy record found. Holder: Bob Johnson, Status: Active",
                    "Retrieving claims history for policy: POL-3003",
                    "Retrieved 1 past claims.",
                    "Running fraud scoring rules and weighting models...",
                    "Fraud Scoring complete. Score: 45/100, Level: Medium",
                    "RED FLAG: Policy holder has 1 previous claim(s) in history",
                    "RED FLAG: Policy holder name 'Bob Johnson' not found in OCR extracted document text"
                ]
            },
            {
                "agent": "ClaimRecommendationAgent",
                "logs": [
                    "Starting claim recommendation synthesis...",
                    "Decision: ESCALATE for human review. Medium Fraud Score (45).",
                    "Recommendation rationale generated."
                ]
            }
        ]
    },
    "high_risk": {
        "claim_id": "CLM-DEMO-HIGH",
        "scenario": "high_risk",
        "recommendation": "Reject",
        "recommended_payout": 0.0,
        "rationale": "### Claim Recommendation: REJECTED\n\n**1. Decision Summary:**\nThe claim filed by John Smith under policy POL-2002 is recommended for **Rejection** (Payout: $0.00). This decision is driven by a high fraud risk score of **83/100** and multiple policy compliance failures.\n\n**2. Key Findings:**\n- **Critical:** Claim was filed for an accident that occurred outside the valid policy coverage period (Policy Expired).\n- **Documents:** OCR verification confirmed the accident date of June 15, 2026, while the policy expired on June 10, 2026.\n- **History:** Claimant has a high claims frequency (4 past claims) and prior rejected claims.\n- **Damage:** Discrepancy between claimed repairs ($4,500.00) and visual estimate of $7,500.00.\n\n**3. Financial Breakdown:**\n- Claimed Amount: $4,500.00\n- Recommended Payout: $0.00 (Claim Denied due to policy non-compliance / high risk)",
        "document_verification": {
            "policy_id": "POL-2002",
            "claimant_name": "John Smith",
            "accident_date": "2026-06-15",
            "claim_amount": 4500.0,
            "description": "Front collision with another vehicle at an intersection.",
            "ocr_text": "POLICE ACCIDENT REPORT\nDate of Incident: June 15, 2026\nLocation: Main St & 5th Ave\nDriver: John Smith\nVehicle: 2019 Honda Civic\nLicense Plate: ABC-1234\nPolicy Number: POL-2002\nEstimated Damage: $4,500.00"
        },
        "damage_assessment": {
            "vehicle_detected": "Honda Civic (Pre-existing severe side panel damage)",
            "damage_detected": "Severe front-end damage to grille, headlights, and hood. Frame distortion noted.",
            "estimated_repair_cost": 7500.0,
            "severity": "High"
        },
        "fraud_detection": {
            "policy_holder": "John Smith",
            "policy_status": "Expired",
            "policy_limit": 10000.0,
            "claims_history_count": 5,
            "fraud_score": 83,
            "risk_level": "High",
            "fraud_signals": [
                "Accident date (2026-06-15) is outside policy coverage window (2025-06-10 to 2026-06-10)",
                "Claim filed under an expired policy",
                "Policy holder has 5 previous claim(s) in history",
                "History contains 1 rejected claim(s) for potential past fraud",
                "Claimed amount ($4500.00) differs significantly from image analysis repair estimate ($7500.00)"
            ]
        },
        "execution_trace": [
            {
                "agent": "DocumentVerificationAgent",
                "logs": [
                    "Starting document verification process for claim input: CLM-DEMO-HIGH",
                    "Retrieving claims document from path/identifier: john_smith_police_report.pdf",
                    "OCR scan completed. Character count: 215",
                    "Extracted claim details: Policy: POL-2002, Date: 2026-06-15, Amount: $4,500.0"
                ]
            },
            {
                "agent": "DamageAssessmentAgent",
                "logs": [
                    "Starting damage assessment process for claim: CLM-DEMO-HIGH",
                    "Retrieving damage photo from path/identifier: front_end_wreck.jpg",
                    "Image analysis complete. Vehicle: Honda Civic (Pre-existing damage present)",
                    "Severity: High, Repair Estimate: $7,500.0"
                ]
            },
            {
                "agent": "FraudDetectionAgent",
                "logs": [
                    "Starting fraud detection process for policy: POL-2002",
                    "Searching database for policy records: POL-2002",
                    "Policy record found. Holder: John Smith, Status: Expired",
                    "Retrieving claims history for policy: POL-2002",
                    "Retrieved 5 past claims.",
                    "Running fraud scoring rules and weighting models...",
                    "Fraud Scoring complete. Score: 83/100, Level: High",
                    "RED FLAG: Accident date (2026-06-15) is outside policy coverage window",
                    "RED FLAG: Claim filed under an expired policy",
                    "RED FLAG: Policy holder has 5 previous claim(s) in history",
                    "RED FLAG: History contains 1 rejected claim(s) for potential past fraud",
                    "RED FLAG: Claimed amount differs significantly from image analysis repair estimate"
                ]
            },
            {
                "agent": "ClaimRecommendationAgent",
                "logs": [
                    "Starting claim recommendation synthesis...",
                    "Decision: REJECT due to High Fraud Score (83) or Expired Policy.",
                    "Recommendation rationale generated."
                ]
            }
        ]
    }
};

// Global Variables
let currentPreset = "low_risk";
let isPipelineRunning = false;
let backendUrl = "http://localhost:8000";
let isBackendOnline = false;

// DOM Elements
const runBtn = document.getElementById("run-pipeline-btn");
const logConsole = document.getElementById("log-console");
const presetButtons = document.querySelectorAll(".preset-btn");
const apiModeBadge = document.getElementById("api-mode-badge");
const themeToggleBtn = document.getElementById("theme-toggle");
const pipelineStatus = document.getElementById("pipeline-status");

// Agent Nodes & Connectors
const nodes = {
    doc: document.getElementById("node-doc"),
    dmg: document.getElementById("node-dmg"),
    fraud: document.getElementById("node-fraud"),
    rec: document.getElementById("node-rec")
};
const connectors = {
    c1: document.getElementById("conn-1"),
    c2: document.getElementById("conn-2"),
    c3: document.getElementById("conn-3")
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Check if backend is online
    checkBackendHealth();
    
    // Setup Theme (Default: Dark)
    if (localStorage.getItem("theme") === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.getElementById("theme-icon-sun").style.display = "none";
        document.getElementById("theme-icon-moon").style.display = "inline";
    }

    // Bind Event Listeners
    themeToggleBtn.addEventListener("click", toggleTheme);
    presetButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (isPipelineRunning) return;
            
            // Switch active preset button
            presetButtons.forEach(b => b.classList.remove("active"));
            const targetBtn = e.currentTarget;
            targetBtn.classList.add("active");
            
            currentPreset = targetBtn.getAttribute("data-preset");
            resetOutputs();
            appendLog(`[SYSTEM] Switched claimant preset scenario to: ${currentPreset.toUpperCase()}`);
        });
    });

    runBtn.addEventListener("click", startPipelineExecution);
});

// Check if backend FastAPI server is running
async function checkBackendHealth() {
    try {
        const response = await fetch(backendUrl + "/");
        if (response.ok) {
            const data = await response.json();
            isBackendOnline = true;
            apiModeBadge.className = "badge badge-green";
            apiModeBadge.textContent = data.api_mode === "live_llm" ? "API: Gemini Live" : "API: Backend Fallback";
            appendLog(`[SYSTEM] Backend API found online. Mode: ${data.api_mode}`);
        }
    } catch (e) {
        isBackendOnline = false;
        apiModeBadge.className = "badge badge-blue";
        apiModeBadge.textContent = "Offline (Demo)";
        appendLog(`[SYSTEM] Backend API offline. Operating in frontend local simulation mode.`);
    }
}

// Reset output values to default empty states
function resetOutputs() {
    // Clear Nodes
    Object.values(nodes).forEach(n => {
        n.classList.remove("active", "completed");
    });
    Object.values(connectors).forEach(c => {
        c.classList.remove("active", "completed");
    });

    // Clear Badges
    document.getElementById("ocr-badge").className = "badge badge-gray";
    document.getElementById("ocr-badge").textContent = "Pending";
    document.getElementById("dmg-badge").className = "badge badge-gray";
    document.getElementById("dmg-badge").textContent = "Pending";
    document.getElementById("fraud-badge").className = "badge badge-gray";
    document.getElementById("fraud-badge").textContent = "Pending";
    document.getElementById("rec-badge").className = "badge badge-gray";
    document.getElementById("rec-badge").textContent = "Pending";

    // Clear Details
    document.getElementById("val-policy-id").textContent = "-";
    document.getElementById("val-claimant-name").textContent = "-";
    document.getElementById("val-accident-date").textContent = "-";
    document.getElementById("val-claim-amount").textContent = "-";
    document.getElementById("val-ocr-text").textContent = "OCR text will appear here once the pipeline executes...";
    
    document.getElementById("val-car-model").textContent = "-";
    document.getElementById("val-repair-cost").textContent = "-";
    document.getElementById("val-dmg-severity").textContent = "-";
    document.getElementById("val-dmg-desc").textContent = "Image analysis notes will appear here...";

    document.getElementById("val-fraud-score").textContent = "-";
    document.getElementById("val-risk-level").textContent = "-";
    document.getElementById("val-sparkline-fill").style.width = "0%";
    const signalList = document.getElementById("val-signals-list");
    signalList.innerHTML = '<li class="no-signals">No alerts flagged. Execute system.</li>';

    document.getElementById("val-decision").textContent = "-";
    document.getElementById("val-payout").textContent = "-";
    document.getElementById("val-rationale").textContent = "Rationale summary will populate here once the final agent makes its recommendation.";
    
    const recCard = document.getElementById("card-recommendation");
    recCard.style.borderColor = "var(--border)";
    
    pipelineStatus.className = "status-indicator idle";
    pipelineStatus.textContent = "System Idle";
}

// Log formatting inside the shell console
function appendLog(message, agentClass = "system-line") {
    const line = document.createElement("div");
    line.className = `log-line ${agentClass}`;
    line.textContent = message;
    logConsole.appendChild(line);
    logConsole.scrollTop = logConsole.scrollHeight;
}

// Run the full pipeline simulation or API request
async function startPipelineExecution() {
    if (isPipelineRunning) return;
    
    isPipelineRunning = true;
    runBtn.disabled = true;
    resetOutputs();

    pipelineStatus.className = "status-indicator running";
    pipelineStatus.textContent = "Processing Claims";

    appendLog("[SYSTEM] Initializing multi-agent claim verification system...");

    let resultsData = null;

    if (isBackendOnline) {
        try {
            appendLog(`[SYSTEM] Sending claims request to backend API...`);
            const response = await fetch(backendUrl + "/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scenario_name: currentPreset })
            });
            if (response.ok) {
                resultsData = await response.json();
            } else {
                throw new Error("API call failed");
            }
        } catch (e) {
            appendLog(`[ERROR] Failed to query backend API: ${e.message}. Switching to local simulation fallback.`);
            resultsData = LOCAL_PRESETS[currentPreset];
        }
    } else {
        // Use client-side mock presets
        resultsData = LOCAL_PRESETS[currentPreset];
    }

    if (!resultsData) {
        appendLog("[ERROR] Failed to retrieve analysis results. Pipeline aborted.", "error-line");
        isPipelineRunning = false;
        runBtn.disabled = false;
        return;
    }

    // Playback steps dynamically
    await runAgentPlayback(resultsData);
}

// Playback animation steps
async function runAgentPlayback(data) {
    const trace = data.execution_trace;
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    // --- STEP 1: Document Agent ---
    nodes.doc.classList.add("active");
    appendLog("[SYSTEM] Triggering: DocumentVerificationAgent", "agent-doc-line");
    
    const docTrace = trace.find(t => t.agent === "DocumentVerificationAgent") || { logs: ["Processing document..."] };
    for (const log of docTrace.logs) {
        await delay(450);
        appendLog(`[DocumentAgent] ${log}`, "agent-doc-line");
    }
    
    await delay(300);
    // Populate Card 1
    document.getElementById("ocr-badge").className = "badge badge-green";
    document.getElementById("ocr-badge").textContent = "Verified";
    document.getElementById("val-policy-id").textContent = data.document_verification.policy_id;
    document.getElementById("val-claimant-name").textContent = data.document_verification.claimant_name;
    document.getElementById("val-accident-date").textContent = data.document_verification.accident_date;
    document.getElementById("val-claim-amount").textContent = `$${data.document_verification.claim_amount.toLocaleString()}`;
    document.getElementById("val-ocr-text").textContent = data.document_verification.ocr_text;
    
    nodes.doc.classList.remove("active");
    nodes.doc.classList.add("completed");
    connectors.c1.classList.add("completed");

    // --- STEP 2: Damage Agent ---
    nodes.dmg.classList.add("active");
    connectors.c1.classList.add("active");
    appendLog("[SYSTEM] Triggering: DamageAssessmentAgent", "agent-dmg-line");
    
    const dmgTrace = trace.find(t => t.agent === "DamageAssessmentAgent") || { logs: ["Running damage vision model..."] };
    for (const log of dmgTrace.logs) {
        await delay(450);
        appendLog(`[DamageAgent] ${log}`, "agent-dmg-line");
    }

    await delay(300);
    // Populate Card 2
    const sevClass = data.damage_assessment.severity === "Low" ? "badge-green" : (data.damage_assessment.severity === "Medium" ? "badge-amber" : "badge-red");
    document.getElementById("dmg-badge").className = `badge ${sevClass}`;
    document.getElementById("dmg-badge").textContent = `Severity: ${data.damage_assessment.severity}`;
    document.getElementById("val-car-model").textContent = data.damage_assessment.vehicle_detected;
    document.getElementById("val-repair-cost").textContent = `$${data.damage_assessment.estimated_repair_cost.toLocaleString()}`;
    document.getElementById("val-dmg-severity").className = `detail-value ${data.damage_assessment.severity === "Low" ? "text-green" : (data.damage_assessment.severity === "Medium" ? "text-amber" : "text-red")}`;
    document.getElementById("val-dmg-severity").textContent = data.damage_assessment.severity;
    document.getElementById("val-dmg-desc").textContent = data.damage_assessment.damage_detected;

    nodes.dmg.classList.remove("active");
    nodes.dmg.classList.add("completed");
    connectors.c2.classList.add("completed");

    // --- STEP 3: Fraud Agent ---
    nodes.fraud.classList.add("active");
    connectors.c2.classList.add("active");
    appendLog("[SYSTEM] Triggering: FraudDetectionAgent", "agent-fraud-line");
    
    const fraudTrace = trace.find(t => t.agent === "FraudDetectionAgent") || { logs: ["Querying policy history..."] };
    for (const log of fraudTrace.logs) {
        await delay(450);
        if (log.startsWith("RED FLAG:")) {
            appendLog(`[FraudAgent] ${log}`, "error-line");
        } else {
            appendLog(`[FraudAgent] ${log}`, "agent-fraud-line");
        }
    }

    await delay(300);
    // Populate Card 3
    const risk = data.fraud_detection.risk_level;
    const fraudClass = risk === "Low" ? "badge-green" : (risk === "Medium" ? "badge-amber" : "badge-red");
    document.getElementById("fraud-badge").className = `badge ${fraudClass}`;
    document.getElementById("fraud-badge").textContent = `Risk: ${risk}`;
    
    const scoreNum = document.getElementById("val-fraud-score");
    scoreNum.textContent = data.fraud_detection.fraud_score;
    scoreNum.className = `score-num ${risk === "Low" ? "text-green" : (risk === "Medium" ? "text-amber" : "text-red")}`;
    
    document.getElementById("val-risk-level").className = `score-level-text ${risk === "Low" ? "text-green" : (risk === "Medium" ? "text-amber" : "text-red")}`;
    document.getElementById("val-risk-level").textContent = `${risk} Risk`;
    
    const sparkline = document.getElementById("val-sparkline-fill");
    sparkline.style.width = `${data.fraud_detection.fraud_score}%`;
    sparkline.style.backgroundColor = risk === "Low" ? "var(--green)" : (risk === "Medium" ? "var(--amber)" : "var(--red)");
    
    const signalList = document.getElementById("val-signals-list");
    signalList.innerHTML = "";
    if (data.fraud_detection.fraud_signals.length === 0) {
        signalList.innerHTML = '<li class="no-signals" style="color: var(--green);">✦ No risk signals flagged. Clean record.</li>';
    } else {
        data.fraud_detection.fraud_signals.forEach(sig => {
            const li = document.createElement("li");
            li.textContent = sig;
            signalList.appendChild(li);
        });
    }

    nodes.fraud.classList.remove("active");
    nodes.fraud.classList.add("completed");
    connectors.c3.classList.add("completed");

    // --- STEP 4: Recommendation Agent ---
    nodes.rec.classList.add("active");
    connectors.c3.classList.add("active");
    appendLog("[SYSTEM] Triggering: ClaimRecommendationAgent", "agent-rec-line");
    
    const recTrace = trace.find(t => t.agent === "ClaimRecommendationAgent") || { logs: ["Generating final payout synthesis..."] };
    for (const log of recTrace.logs) {
        await delay(450);
        appendLog(`[RecommendationAgent] ${log}`, "agent-rec-line");
    }

    await delay(300);
    // Populate Card 4
    const rec = data.recommendation;
    const recClass = rec === "Approve" ? "badge-green" : (rec === "Escalate" ? "badge-amber" : "badge-red");
    document.getElementById("rec-badge").className = `badge ${recClass}`;
    document.getElementById("rec-badge").textContent = rec;
    
    const decisionVal = document.getElementById("val-decision");
    decisionVal.textContent = rec === "Approve" ? "APPROVED" : (rec === "Escalate" ? "ESCALATE" : "REJECTED");
    decisionVal.className = `decision-value ${rec === "Approve" ? "text-green" : (rec === "Escalate" ? "text-amber" : "text-red")}`;
    
    document.getElementById("val-payout").textContent = `$${data.recommended_payout.toLocaleString()}`;
    document.getElementById("val-payout").className = `decision-payout-value ${rec === "Approve" ? "text-green" : "text-muted"}`;
    
    // Parse Markdown rationale roughly
    document.getElementById("val-rationale").innerHTML = parseSimpleMarkdown(data.rationale);
    
    // Highlight Recommendation Card border
    const recCard = document.getElementById("card-recommendation");
    recCard.style.borderColor = rec === "Approve" ? "var(--green)" : (rec === "Escalate" ? "var(--amber)" : "var(--red)");

    nodes.rec.classList.remove("active");
    nodes.rec.classList.add("completed");

    // Complete Execution
    appendLog("[SYSTEM] Claim audit workflow finished successfully.");
    pipelineStatus.className = "status-indicator idle";
    pipelineStatus.textContent = "Inspection Finished";
    isPipelineRunning = false;
    runBtn.disabled = false;
}

// Very basic Markdown to HTML parser for the rationale field
function parseSimpleMarkdown(md) {
    if (!md) return "";
    return md
        .replace(/### (.*)/g, '<h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/- (.*)/g, '<p style="margin-left: 0.5rem; display: list-item; list-style-type: square; font-size: 0.76rem; margin-bottom: 0.15rem;">$1</p>')
        .split('\n\n').map(p => p.startsWith('<h3') || p.startsWith('<p') ? p : `<p style="margin-bottom: 0.4rem;">${p}</p>`).join('');
}

// Toggle light/dark modes
function toggleTheme() {
    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");
    
    if (document.documentElement.classList.contains("dark")) {
        // Switch to Light
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        sunIcon.style.display = "none";
        moonIcon.style.display = "inline";
        localStorage.setItem("theme", "light");
        appendLog("[SYSTEM] UI Theme changed to Light mode.");
    } else {
        // Switch to Dark
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        sunIcon.style.display = "inline";
        moonIcon.style.display = "none";
        localStorage.setItem("theme", "dark");
        appendLog("[SYSTEM] UI Theme changed to Dark mode.");
    }
}
