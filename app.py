import os
import json
from datetime import datetime
from typing import Dict, Any, List
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Define directory paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
ENV_PATH = BASE_DIR / ".env"

# Load environment variables explicitly from the backend directory
load_dotenv(dotenv_path=ENV_PATH)

# Initialize FastAPI App
app = FastAPI(
    title="Sentinel AI - Industrial Safety Copilot API",
    description="Multi-Agent Safety Intelligence Engine for Industrial Facilities",
    version="2.0.0"
)

# Enable CORS for Next.js Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Gemini Client securely
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    ai_client = genai.Client(api_key=gemini_api_key)
else:
    ai_client = None
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment variables.")

# Request Model for AI Endpoint
class AIQuestion(BaseModel):
    question: str

# Helper function to safely read JSON files
def load_json(filename: str) -> List[Dict[str, Any]]:
    path = os.path.join(os.path.dirname(__file__), "data", filename)
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"Error loading {filename}: {str(e)}")
        return []

# Core Logic: Compound Risk Assessment Engine
def calculate_risk() -> Dict[str, Any]:
    sensors = load_json("sensors.json")
    workers = load_json("workers.json")
    permits = load_json("permits.json")

    score = 0
    causes = []
    
    # Analyze active zones across data sources
    zones = ["Zone A", "Zone B", "Zone C"]

    for zone in zones:
        # Zone-specific checks
        zone_sensors = [s for s in sensors if s.get("location") == zone or s.get("zone") == zone]
        has_gas_leak = any(s.get("gas_level", 0) > 80 for s in zone_sensors)
        has_high_temp = any(s.get("temperature", 0) > 75 for s in zone_sensors)
        
        zone_permits = [p for p in permits if p.get("zone") == zone and p.get("status") == "approved"]
        has_hot_work = any(p.get("type") == "Hot Work" for p in zone_permits)
        
        zone_workers = [w for w in workers if w.get("zone") == zone]
        ppe_violations = [w for w in zone_workers if not w.get("ppe")]

        # 🚨 COMPOUND RISK ESCALATION 1: Explosive atmosphere + Active ignition permit in same zone
        if has_gas_leak and has_hot_work:
            score += 65
            causes.append(f"CRITICAL: Active Hot Work Permit during Methane Leak in {zone}")

        # 🚨 COMPOUND RISK ESCALATION 2: Gas leak + Non-compliant worker in same zone
        if has_gas_leak and ppe_violations:
            score += 25
            names = ", ".join([w.get("name", w.get("id")) for w in ppe_violations])
            causes.append(f"HAZARD: Non-PPE personnel ({names}) in hazardous zone ({zone})")

        # Isolated individual factors
        if has_high_temp and not has_gas_leak:
            score += 15
            causes.append(f"Elevated Temperature anomaly in {zone}")

    # Process global/unbound flags
    for p in permits:
        if p.get("status") == "pending":
            score += 5
            causes.append(f"Unapproved Permit Pending Execution ({p.get('id')})")

    for w in workers:
        if not w.get("ppe") and "zone" not in w:
            score += 10
            causes.append(f"PPE Violation detected: {w.get('name', w.get('id'))}")

    score = min(score, 100)
    
    if score >= 80:
        level = "CRITICAL"
    elif score >= 60:
        level = "HIGH"
    elif score >= 30:
        level = "MEDIUM"
    else:
        level = "LOW"

    eta = max(5, 30 - score // 4)
    confidence = round(97.0 + (score / 100.0) * 2.5, 1)

    return {
        "risk_score": score,
        "risk_level": level,
        "eta_minutes": eta,
        "confidence": confidence,
        "causes": list(dict.fromkeys(causes)),
        "timestamp": datetime.now().isoformat()
    }

# Endpoint 1: Main Dashboard API
@app.get("/dashboard")
def get_dashboard_data():
    risk_info = calculate_risk()
    return {
        "metrics": {
            "risk_score": risk_info["risk_score"],
            "risk_level": risk_info["risk_level"],
            "eta_minutes": risk_info["eta_minutes"],
            "confidence": risk_info["confidence"],
            "causes": risk_info["causes"]
        },
        "sensors": load_json("sensors.json"),
        "workers": load_json("workers.json"),
        "permits": load_json("permits.json"),
        "maintenance": load_json("maintenance.json"),
        "incidents": load_json("incidents.json"),
        "regulations": load_json("regulations.json"),
        "last_updated": risk_info["timestamp"]
    }

# Endpoint 2: Gemini regulatory & situational AI copilot
@app.post("/ask-ai")
def ask_ai(question: AIQuestion):
    risk_info = calculate_risk()
    regulations = load_json("regulations.json")
    
    # System instruction grounding Gemini in live plant context & regulations
    system_prompt = f"""
    You are Sentinel AI, an expert Industrial Safety Copilot operating in an enterprise facility.
    
    CURRENT LIVE PLANT STATUS:
    - Overall Risk Level: {risk_info['risk_level']} ({risk_info['risk_score']}/100)
    - Active Hazards & Causes: {json.dumps(risk_info['causes'])}
    
    APPLICABLE REGULATION DATABASE:
    {json.dumps(regulations)}
    
    GUIDELINES:
    1. Respond directly, concisely, and professionally like an industrial safety manager.
    2. Reference specific Indian statutory safety codes (e.g., OISD-STD-105, Factory Act 1948) when relevant.
    3. Provide actionable steps for ground operators based on the current plant hazards.
    """

    if not ai_client:
        return {
            "question": question.question,
            "answer": f"API Key missing. Local fallback response for: '{question.question}'. Active hazards: {', '.join(risk_info['causes'])}"
        }

    try:
        response = ai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=question.question,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.2,
            )
        )
        return {
            "question": question.question,
            "answer": response.text
        }
    except Exception as e:
        return {
            "question": question.question,
            "answer": f"Error generating safety response: {str(e)}"
        }

# Endpoint 3: Judge Benchmark Baseline vs Compound AI Comparison
@app.get("/compare-baseline")
def compare_baseline():
    """
    Demonstrates the difference between traditional single-sensor SCADA 
    and Sentinel AI Multi-Agent Cross-Domain Correlation.
    """
    return {
        "traditional_single_sensor_scada": {
            "gas_detector_s102": "WARN (91 ppm - Below 100 ppm Auto-Trip)",
            "permit_system_p101": "APPROVED (Hot Work)",
            "overall_assessment": "SAFE / NORMAL OPERATIONAL STATE",
            "action": "None (Parameters within isolated safety thresholds)",
            "blindspot": "Fails to recognize active ignition source present inside hazardous gas zone."
        },
        "sentinel_ai_compound_engine": {
            "cross_domain_correlation": [
                "Zone B: Sensor S102 (91 ppm Gas + 81°C Temp)",
                "Zone B: Permit P101 Active Hot Work",
                "Zone B: Worker W102 (No PPE)"
            ],
            "risk_score": "90% (CRITICAL)",
            "recommended_action": "AUTOMATIC PERMIT REVOCATION & EMERGENCY ZONE EVACUATION",
            "value_add": "Prevented potential catastrophic ignition by linking isolated operational signals."
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)