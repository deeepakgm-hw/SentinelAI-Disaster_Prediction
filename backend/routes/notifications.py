from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from db.sqlite_database import get_db
from db.models import User, Notification
from services.auth_service import get_current_user
from utils.connection_manager import manager

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    severity: str
    disaster_type: str
    timestamp: str
    is_read: bool

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.timestamp.desc()).all()
    return [
        NotificationResponse(
            id=n.id, title=n.title, message=n.message, severity=n.severity,
            disaster_type=n.disaster_type, timestamp=n.timestamp.isoformat(), is_read=n.is_read
        ) for n in notifications
    ]

@router.get("/unread", response_model=List[NotificationResponse])
async def get_unread_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).order_by(Notification.timestamp.desc()).all()
    return [
        NotificationResponse(
            id=n.id, title=n.title, message=n.message, severity=n.severity,
            disaster_type=n.disaster_type, timestamp=n.timestamp.isoformat(), is_read=n.is_read
        ) for n in notifications
    ]

@router.put("/read/{notification_id}")
async def mark_as_read(notification_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if notification:
        notification.is_read = True
        db.commit()
    return {"success": True}

@router.put("/read-all")
async def mark_all_as_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"success": True}

@router.delete("/clear")
async def clear_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == current_user.id).delete()
    db.commit()
    return {"success": True}

@router.post("/simulate_emergency")
async def simulate_emergency(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Create a CRITICAL notification
    new_notif = Notification(
        user_id=current_user.id,
        title="CRITICAL SEISMIC EVENT DETECTED",
        message="Magnitude 8.2 Earthquake detected. Tsunamigenic potential high. Immediate evacuation of coastal zones required.",
        severity="CRITICAL",
        disaster_type="Earthquake"
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    
    # 2. Broadcast via WebSocket
    payload = {
        "type": "NEW_NOTIFICATION",
        "data": {
            "id": new_notif.id,
            "title": new_notif.title,
            "message": new_notif.message,
            "severity": new_notif.severity,
            "disaster_type": new_notif.disaster_type,
            "timestamp": new_notif.timestamp.isoformat(),
            "is_read": False
        }
    }
    
    # We broadcast to ALL connected websockets for simplicity, 
    # normally we'd filter by user_id if we had authenticated websockets
    await manager.broadcast(payload)
    
    # Send an emergency broadcast event as well
    await manager.broadcast({"type": "EMERGENCY_BROADCAST", "data": payload["data"]})
    
    return {"success": True, "message": "Simulated emergency broadcast dispatched."}
