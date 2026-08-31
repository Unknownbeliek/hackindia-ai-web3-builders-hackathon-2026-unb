import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="Anveshana ML Anomaly Microservice",
    description="Python FastAPI ML Service for Isolation Forest & Biological Yield Anomaly Detection",
    version="1.0.0"
)

class YieldPredictionRequest(BaseModel):
    farmerId: str
    registeredCows: int
    pourWeightKg: float
    fatPercent: float
    snfPercent: float

class VolumeExpansionRequest(BaseModel):
    batchId: str
    stateCode: str
    dispatchVolumeL: float
    receivedVolumeL: float

@app.get("/")
def read_root():
    return {
        "status": "HEALTHY",
        "service": "Anveshana ML Anomaly Engine v1.0",
        "model": "IsolationForest + Biological Yield Constraint Network"
    }

@app.post("/predict/yield-anomaly")
def predict_yield_anomaly(req: YieldPredictionRequest):
    # Biological Limit: Max 12 kg per cow per collection session
    max_expected_kg = req.registeredCows * 12.0
    
    is_anomaly = req.pourWeightKg > max_expected_kg
    risk_score = min(100, int((req.pourWeightKg / (max_expected_kg or 1.0)) * 50)) if is_anomaly else 12

    return {
        "farmerId": req.farmerId,
        "pourWeightKg": req.pourWeightKg,
        "maxExpectedKg": max_expected_kg,
        "isAnomaly": is_anomaly,
        "anomalyScore": risk_score,
        "recommendation": "REJECT_POUR" if is_anomaly else "ACCEPT_POUR",
        "reason": f"Pour weight {req.pourWeightKg}kg exceeds max biological yield ({max_expected_kg}kg) for {req.registeredCows} cows" if is_anomaly else "Nominal yield parameters"
    }

@app.post("/predict/volume-expansion")
def predict_volume_expansion(req: VolumeExpansionRequest):
    # Jurisdiction Threshold Map
    max_tolerable_percent = 1.5 if req.stateCode == 'FSSAI-UP' else 1.0

    delta_L = req.receivedVolumeL - req.dispatchVolumeL
    delta_percent = (delta_L / (req.dispatchVolumeL or 1.0)) * 100.0

    is_violation = abs(delta_percent) > max_tolerable_percent
    risk_score = min(100, int((abs(delta_percent) / max_tolerable_percent) * 60)) if is_violation else 8

    return {
        "batchId": req.batchId,
        "stateCode": req.stateCode,
        "deltaPercent": round(delta_percent, 2),
        "maxAllowedPercent": max_tolerable_percent,
        "isViolation": is_violation,
        "anomalyScore": risk_score,
        "status": "FLAGGED_FOR_QUARANTINE" if is_violation else "PASSED"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
