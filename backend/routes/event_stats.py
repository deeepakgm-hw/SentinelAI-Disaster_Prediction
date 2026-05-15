from fastapi import APIRouter

from db.database import (
    events_collection,
)

from services.earthquake_service import (
    get_event_stats,
)

router = APIRouter()

# -----------------------------------
# SYSTEM EVENT STATS
# -----------------------------------


@router.get("/api/system/event-stats")
async def event_stats():
    stats = await get_event_stats(
        events_collection
    )

    return {
        "success": True,
        "stats": stats,
    }
