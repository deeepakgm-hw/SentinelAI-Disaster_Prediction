from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

startup_time = datetime.utcnow()

@router.get("/api/health")
async def health_check():
    uptime = datetime.utcnow() - startup_time

    return {
        "status": "healthy",
        "uptime_seconds": int(uptime.total_seconds()),
        "timestamp": datetime.utcnow().isoformat()
    }
