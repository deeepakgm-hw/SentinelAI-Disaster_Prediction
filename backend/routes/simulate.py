from fastapi import APIRouter

from random import (
    choice,
    uniform,
)

from datetime import datetime

from services.event_service import (
    create_event,
)

from services.websocket_service import (
    broadcast_event,
    broadcast_activity,
)

router = APIRouter()

DISASTER_TYPES = [
    "Earthquake",
    "Flood",
    "Cyclone",
    "Wildfire",
]

LOCATIONS = [
    "Gujarat",
    "Assam",
    "Chennai",
    "Andaman",
    "Mumbai",
    "Delhi",
]

LEVELS = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
]

COORDINATES = [
    [23.0225, 72.5714],
    [26.2006, 92.9376],
    [13.0827, 80.2707],
    [11.7401, 92.6586],
    [19.0760, 72.8777],
    [28.7041, 77.1025],
]


@router.post("/api/simulate")
async def simulate_event():
    disaster = choice(DISASTER_TYPES)

    location = choice(LOCATIONS)

    level = choice(LEVELS)

    coords = choice(COORDINATES)

    event = {
        "id": int(uniform(1000, 9999)),

        "title": f"{disaster} Alert",

        "type": disaster,

        "location": location,

        "level": level,

        "coordinates": coords,
    }

    # SAVE EVENT
    await create_event(event)

    # LIVE EVENT PUSH
    await broadcast_event(event)

    # CREATE ACTIVITY
    activity = {
        "id": int(uniform(10000, 99999)),

        "time": datetime.now().strftime(
            "%H:%M"
        ),

        "message":
            f"{disaster} detected — {location}",

        "level": level,
    }

    # LIVE ACTIVITY PUSH
    await broadcast_activity(
        activity
    )

    return {
        "success": True,
        "event": event,
        "activity": activity,
    }
