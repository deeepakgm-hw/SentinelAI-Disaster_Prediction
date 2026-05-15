from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool
import logging

from services.alert_service import (
    get_all_alerts,
)
from services.sms_service import send_sms_alert

logger = logging.getLogger(__name__)

router = APIRouter()

class AlertRequest(BaseModel):
    phone: str
    message: str

@router.get("/api/alerts")
async def fetch_alerts():
    return await get_all_alerts()

@router.post("/api/send-alert")
async def send_alert(request: AlertRequest):
    try:
        # send_sms_alert makes blocking network calls to Twilio, wrap it
        result = await run_in_threadpool(send_sms_alert, request.phone, request.message)
        
        if result.get("success"):
            return {
                "success": True,
                "sid": result.get("sid")
            }
        else:
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to send SMS"))
    except Exception as e:
        logger.error(f"Failed to send alert: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
