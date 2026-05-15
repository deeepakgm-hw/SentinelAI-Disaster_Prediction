from db.database import (
    events_collection,
)

# -----------------------------------
# VALIDATE EVENT
# -----------------------------------


def is_valid_event(event):
    if not event:
        return False

    if "coordinates" not in event:
        return False

    coords = event["coordinates"]

    if (
        not isinstance(coords, list)
        or len(coords) != 2
    ):
        return False

    lat, lng = coords

    if (
        not isinstance(lat, (int, float))
        or not isinstance(
            lng,
            (int, float),
        )
    ):
        return False

    return True

# -----------------------------------
# GET ALL EVENTS
# -----------------------------------


async def get_all_events():
    events = []

    async for event in events_collection.find():
        event["_id"] = str(
            event["_id"]
        )

        events.append(event)

    return events

# -----------------------------------
# CHECK DUPLICATES
# -----------------------------------


async def event_exists(event_id):
    existing = (
        await events_collection.find_one(
            {"id": event_id}
        )
    )

    return existing is not None

# -----------------------------------
# CREATE EVENT
# -----------------------------------


async def create_event(
    event_data
):
    # VALIDATION
    if not is_valid_event(
        event_data
    ):
        print(
            "❌ Invalid event skipped"
        )

        return None

    # DUPLICATE CHECK
    if await event_exists(
        event_data["id"]
    ):
        print(
            "⚠️ Duplicate event skipped"
        )

        return None

    result = (
        await events_collection.insert_one(
            event_data
        )
    )

    event_data["_id"] = str(
        result.inserted_id
    )

    print(
        f"✅ Event stored: {event_data['title']}"
    )

    return event_data
