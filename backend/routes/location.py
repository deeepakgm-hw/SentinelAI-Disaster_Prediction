from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging

from db.sqlite_database import get_db
from db.models import UserLocationLog, ProximityAlertLog, User
from routes.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/location",
    tags=["Location"]
)

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

class ProximityAlert(BaseModel):
    event_id: str
    event_type: str
    distance_km: float

@router.post("/update")
def update_live_location(
    location: LocationUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    try:
        new_log = UserLocationLog(
            user_id=current_user.id,
            latitude=location.latitude,
            longitude=location.longitude
        )
        db.add(new_log)
        db.commit()
        return {"success": True, "message": "Location logged"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error logging location: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/proximity_alert")
def log_proximity_alert(
    alert: ProximityAlert, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    try:
        new_alert = ProximityAlertLog(
            user_id=current_user.id,
            event_id=alert.event_id,
            event_type=alert.event_type,
            distance_km=alert.distance_km
        )
        db.add(new_alert)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        logger.error(f"Error logging proximity alert: {e}")
        raise HTTPException(status_code=500, detail=str(e))
