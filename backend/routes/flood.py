from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool
import os
import logging

from services.flood_service import fetch_live_floods, predict_flood_risk
from services.sms_service import send_sms_alert

logger = logging.getLogger(__name__)

router = APIRouter()

class FloodPredictionInput(BaseModel):
    lat: float
    lon: float
    rainfall_mm: float

@router.get("/api/floods/live")
async def get_live_floods():
    try:
        events = await fetch_live_floods()
        return {"success": True, "events": events}
    except Exception as e:
        logger.error(f"Failed to fetch live floods: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error fetching floods")

@router.post("/api/floods/predict")
async def predict_flood(data: FloodPredictionInput):
    try:
        result = await predict_flood_risk(data.lat, data.lon, data.rainfall_mm)
        
        # Trigger alert generation when rainfall exceeds threshold
        if result.get("alert_triggered"):
            admin_phone = os.getenv("ADMIN_PHONE", "+919380362266") # Fallback
            msg = f"EMERGENCY ALERT: Severe Flood Risk detected at Lat: {data.lat}, Lon: {data.lon}. Rainfall: {data.rainfall_mm}mm. Evacuate low-lying areas."
            await run_in_threadpool(send_sms_alert, admin_phone, msg)
            
        return {"success": True, "prediction": result}
    except Exception as e:
        logger.error(f"Failed to predict flood risk: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error predicting flood risk")
