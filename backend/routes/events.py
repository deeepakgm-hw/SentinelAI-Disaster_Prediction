import os
import random
from datetime import datetime
import httpx
import logging
from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)

router = APIRouter()

# =====================================
# USGS EARTHQUAKE API
# =====================================

USGS_URL = (
    "https://earthquake.usgs.gov/"
    "earthquakes/feed/v1.0/summary/"
    "all_day.geojson"
)

# =====================================
# NASA EONET API
# =====================================

EONET_URL = (
    "https://eonet.gsfc.nasa.gov/"
    "api/v3/events"
)

# =====================================
# EVENTS API
# =====================================


@router.get("/api/events")
async def get_events():
    all_events = []

    async with httpx.AsyncClient(timeout=10) as client:
        # =====================================
        # LIVE EARTHQUAKES (USGS)
        # =====================================
        try:
            response = await client.get(USGS_URL)
            if response.status_code == 200:
                data = response.json()
                earthquake_count = 0
                for feature in data.get("features", []):
                    properties = feature.get("properties", {})
                    geometry = feature.get("geometry", {})
                    coordinates = geometry.get("coordinates", [])

                    if len(coordinates) >= 2:
                        all_events.append({
                            "title": properties.get("title", "Earthquake"),
                            "type": "Earthquake",
                            "magnitude": properties.get("mag", 0),
                            "location": properties.get("place", "Unknown"),
                            "lat": coordinates[1],
                            "lon": coordinates[0],
                        })
                        earthquake_count += 1
                logger.info(f"Loaded {earthquake_count} earthquake events")
        except Exception as e:
            logger.error(f"USGS ERROR: {e}")

        # =====================================
        # NASA EONET DISASTERS
        # =====================================
        try:
            response = await client.get(EONET_URL)
            if response.status_code == 200:
                data = response.json()
                events = data.get("events", [])
                disaster_count = 0

                for event in events[:50]:
                    categories = event.get("categories", [])
                    geometry = event.get("geometry", [])

                    # SKIP INVALID EVENTS
                    if not categories or not geometry:
                        continue

                    latest_geometry = geometry[-1]
                    coordinates = latest_geometry.get("coordinates", [])
                    if len(coordinates) < 2:
                        continue

                    disaster_type = categories[0].get("title", "Disaster")
                    lon = coordinates[0]
                    lat = coordinates[1]
                    magnitude = 5.5

                    if "wildfire" in disaster_type.lower():
                        magnitude = 8.0
                    elif "storm" in disaster_type.lower():
                        magnitude = 7.0
                    elif "flood" in disaster_type.lower():
                        magnitude = 6.5

                    all_events.append({
                        "title": event.get("title", "Disaster Event"),
                        "type": disaster_type,
                        "magnitude": magnitude,
                        "location": disaster_type,
                        "lat": lat,
                        "lon": lon,
                    })
                    disaster_count += 1
                logger.info(f"Loaded {disaster_count} NASA EONET events")
        except Exception as e:
            logger.error(f"EONET ERROR: {e}")

    logger.info(f"Returning {len(all_events)} total events")
    return all_events
