from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorCollection


DEFAULT_REGION = {
    "min_lat": 5,
    "max_lat": 37,
    "min_lon": 65,
    "max_lon": 100,
}


duplicates_skipped_today = 0
validation_failures_today = 0


def is_valid_lat(lat: float) -> bool:
    return isinstance(lat, (int, float)) and -90 <= lat <= 90


def is_valid_lon(lon: float) -> bool:
    return isinstance(lon, (int, float)) and -180 <= lon <= 180


def is_valid_magnitude(mag: float) -> bool:
    return isinstance(mag, (int, float)) and 0 <= mag <= 10


def is_valid_title(title: str) -> bool:
    return isinstance(title, str) and title.strip() != ""


def is_within_region(
    lat: float,
    lon: float,
    region: dict = DEFAULT_REGION,
) -> bool:
    return (
        region["min_lat"] <= lat <= region["max_lat"]
        and region["min_lon"] <= lon <= region["max_lon"]
    )


def validate_event(
    event: dict,
    region: dict = DEFAULT_REGION,
) -> tuple[bool, str]:
    """
    Returns:
        (True, "VALID")
        (False, reason)
    """

    coordinates = event.get("coordinates", [])

    if not isinstance(coordinates, list) or len(coordinates) != 2:
        return False, "INVALID_COORDINATE_FORMAT"

    lat, lon = coordinates

    if not is_valid_lat(lat):
        return False, "INVALID_LATITUDE"

    if not is_valid_lon(lon):
        return False, "INVALID_LONGITUDE"

    if not is_valid_magnitude(
        event.get("magnitude", 0)
    ):
        return False, "INVALID_MAGNITUDE"

    if not is_valid_title(
        event.get("title", "")
    ):
        return False, "INVALID_TITLE"

    if not is_within_region(
        lat,
        lon,
        region,
    ):
        return False, "OUTSIDE_REGION"

    return True, "VALID"


async def insert_earthquake_event(
    col: AsyncIOMotorCollection,
    doc: dict,
    region: dict = DEFAULT_REGION,
):
    """
    Inserts earthquake event with:
    - deduplication
    - validation
    - geo filtering
    - metrics tracking
    """

    global duplicates_skipped_today
    global validation_failures_today

    usgs_id = doc.get("id")

    existing = await col.find_one({
        "id": usgs_id
    })

    if existing:
        duplicates_skipped_today += 1

        print(
            f"⚠️ Duplicate skipped: {usgs_id}"
        )

        return {
            "success": False,
            "reason": "DUPLICATE",
        }

    is_valid, reason = validate_event(
        doc,
        region,
    )

    if not is_valid:
        validation_failures_today += 1

        print(
            f"❌ Validation failed ({reason}): {usgs_id}"
        )

        return {
            "success": False,
            "reason": reason,
        }

    # -----------------------------------
    # ADD METADATA
    # -----------------------------------

    doc["created_at"] = datetime.now(
        timezone.utc
    )

    # -----------------------------------
    # INSERT EVENT
    # -----------------------------------

    result = await col.insert_one(doc)

    print(
        f"✅ Event inserted: {doc['title']}"
    )

    return {
        "success": True,
        "inserted_id": str(
            result.inserted_id
        ),
    }

# -----------------------------------
# STATS HELPERS
# -----------------------------------


async def get_event_stats(
    col: AsyncIOMotorCollection,
):
    total_events = await col.count_documents(
        {}
    )

    return {
        "total_events": total_events,
        "duplicates_skipped_today":
            duplicates_skipped_today,
        "validation_failures_today":
            validation_failures_today,
    }
