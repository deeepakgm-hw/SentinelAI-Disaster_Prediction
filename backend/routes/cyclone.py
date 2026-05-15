from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool
import os
import logging

from services.cyclone_service import fetch_live_cyclones, predict_cyclone_risk
from services.sms_service import send_sms_alert

logger = logging.getLogger(__name__)

router = APIRouter()

class CyclonePredictionInput(BaseModel):
    lat: float
    lon: float
    wind_speed: float
    pressure: float

@router.get("/api/cyclones/live")
async def get_live_cyclones():
    try:
        events = await fetch_live_cyclones()
        return {"success": True, "events": events}
    except Exception as e:
        logger.error(f"Failed to fetch live cyclones: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error fetching cyclones")

@router.post("/api/cyclones/predict")
async def predict_cyclone(data: CyclonePredictionInput):
    try:
        result = await predict_cyclone_risk(data.lat, data.lon, data.wind_speed, data.pressure)
        
        # Trigger alert generation when storm severity becomes dangerous
        if result.get("alert_triggered"):
            admin_phone = os.getenv("ADMIN_PHONE", "+919380362266") # Fallback
            msg = f"EMERGENCY ALERT: Cyclone with CRITICAL/HIGH risk detected at Lat: {data.lat}, Lon: {data.lon}. Wind Speed: {data.wind_speed} km/h. Evacuate immediately."
            await run_in_threadpool(send_sms_alert, admin_phone, msg)
            
        return {"success": True, "prediction": result}
    except Exception as e:
        logger.error(f"Failed to predict cyclone risk: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error predicting cyclone risk")
