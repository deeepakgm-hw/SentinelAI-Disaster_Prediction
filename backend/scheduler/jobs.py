from apscheduler.schedulers.asyncio import (
    AsyncIOScheduler,
)

from services.usgs_service import (
    fetch_earthquakes,
)

from services.event_service import (
    create_event,
)

from services.websocket_service import (
    broadcast_event,
    broadcast_activity,
)

from datetime import datetime

scheduler = AsyncIOScheduler()


async def earthquake_job():
    earthquakes = (
        await fetch_earthquakes()
    )

    for quake in earthquakes:
        # -----------------------------------
        # STORE EVENT (WITH VALIDATION +
        # DUPLICATE PREVENTION)
        # -----------------------------------

        stored_event = await create_event(
            quake
        )

        # SKIP INVALID / DUPLICATE EVENTS
        if not stored_event:
            continue

        # -----------------------------------
        # LIVE EVENT PUSH
        # -----------------------------------

        await broadcast_event(
            stored_event
        )

        # -----------------------------------
        # ACTIVITY GENERATION
        # -----------------------------------

        activity = {
            "id": stored_event["id"],

            "time":
                datetime.now().strftime(
                    "%H:%M"
            ),

            "message":
                f"Earthquake detected — {stored_event['location']}",

            "level":
                stored_event["level"],
        }

        # -----------------------------------
        # LIVE ACTIVITY PUSH
        # -----------------------------------

        await broadcast_activity(
            activity
        )


def start_scheduler():
    scheduler.add_job(
        earthquake_job,
        "interval",
        minutes=2,
    )

    scheduler.start()
