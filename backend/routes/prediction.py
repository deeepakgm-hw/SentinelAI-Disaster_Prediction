from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool
import logging

from services.ml_service import (
    predict_risk,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# =====================================
# INPUT MODEL
# =====================================


class PredictionInput(
    BaseModel
):
    lat: float
    lon: float
    magnitude: float
    normalized_magnitude: float
    disaster_frequency: float
    severity_score: float
    recurrence_score: float

# =====================================
# PREDICTION ENDPOINT
# =====================================


@router.post(
    "/api/predict/risk"
)
async def predict(
    data: PredictionInput
):
    try:
        features = [
            data.lat,
            data.lon,
            data.magnitude,
            data.normalized_magnitude,
            data.disaster_frequency,
            data.severity_score,
            data.recurrence_score,
        ]

        result = await predict_risk(
            features
        )

        # Optional: automatic SMS trigger when AI risk becomes HIGH
        if result.get("risk_level", "").upper() == "HIGH":
            import os
            from services.sms_service import send_sms_alert
            admin_phone = os.getenv("ADMIN_PHONE", "+919380362266")  # Fallback to the Twilio number for testing
            msg = f"EMERGENCY ALERT: AI Risk Model predicts HIGH risk of disaster at Lat: {data.lat}, Lon: {data.lon}. Confidence: {result.get('confidence')}."
            
            # Use run_in_threadpool for synchronous blocking calls
            await run_in_threadpool(send_sms_alert, admin_phone, msg)

        return {
            "success": True,
            "prediction": result,
        }
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")
