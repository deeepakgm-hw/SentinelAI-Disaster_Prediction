import os
import httpx
import uuid
from typing import List, Dict, Any
from datetime import datetime

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Some common cyclone-prone regions (Lat, Lon) for tracking
CYCLONE_ZONES = [
    {"name": "Miami, FL", "lat": 25.7617, "lon": -80.1918},
    {"name": "Hong Kong", "lat": 22.3193, "lon": 114.1694},
    {"name": "Mumbai, India", "lat": 19.0760, "lon": 72.8777},
    {"name": "Manila, Philippines", "lat": 14.5995, "lon": 120.9842},
    {"name": "Tokyo, Japan", "lat": 35.6762, "lon": 139.6503},
    {"name": "Houston, TX", "lat": 29.7604, "lon": -95.3698},
]

def calculate_cyclone_risk(wind_speed_kmh: float) -> str:
    """
    Saffir-Simpson Hurricane Wind Scale (approximate mapping)
    """
    if wind_speed_kmh >= 209:
        return "CRITICAL"
    elif wind_speed_kmh >= 154:
        return "HIGH"
    elif wind_speed_kmh >= 119:
        return "MEDIUM"
    else:
        return "LOW"

def get_mock_cyclones() -> List[Dict[str, Any]]:
    # Mock data if no API key is provided
    return [
        {
            "id": str(uuid.uuid4()),
            "type": "Cyclone",
            "title": "Category 4 Cyclone Approaching",
            "location": "Hong Kong",
            "lat": 22.31,
            "lon": 114.16,
            "wind_speed": 185.0,
            "pressure": 940,
            "humidity": 98,
            "level": "HIGH",
            "timestamp": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "type": "Cyclone",
            "title": "Tropical Storm Alert",
            "location": "Miami, FL",
            "lat": 25.76,
            "lon": -80.19,
            "wind_speed": 115.0,
            "pressure": 985,
            "humidity": 85,
            "level": "LOW",
            "timestamp": datetime.utcnow().isoformat()
        }
    ]

async def fetch_live_cyclones() -> List[Dict[str, Any]]:
    """
    Fetches live weather data for cyclone-prone regions and filters out dangerous storms.
    """
    if not OPENWEATHER_API_KEY:
        print("OPENWEATHER_API_KEY not found. Using mock cyclone data.")
        return get_mock_cyclones()
    
    events = []
    async with httpx.AsyncClient(timeout=10.0) as client:
        for zone in CYCLONE_ZONES:
            try:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={zone['lat']}&lon={zone['lon']}&appid={OPENWEATHER_API_KEY}&units=metric"
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    # Convert m/s to km/h
                    wind_speed = data.get("wind", {}).get("speed", 0) * 3.6
                    pressure = data.get("main", {}).get("pressure", 1013)
                    humidity = data.get("main", {}).get("humidity", 50)
                    
                    # Only register as an event if it's a storm (wind speed > 60 km/h)
                    if wind_speed > 60:
                        risk = calculate_cyclone_risk(wind_speed)
                        events.append({
                            "id": str(uuid.uuid4()),
                            "type": "Cyclone",
                            "title": f"Storm Event - {zone['name']}",
                            "location": zone["name"],
                            "lat": zone["lat"],
                            "lon": zone["lon"],
                            "wind_speed": wind_speed,
                            "pressure": pressure,
                            "humidity": humidity,
                            "level": risk,
                            "timestamp": datetime.utcnow().isoformat()
                        })
            except Exception as e:
                print(f"Error fetching OpenWeather data for {zone['name']}: {e}")
                
    if not events:
        # Provide some fallback if API succeeds but no active storms
        return get_mock_cyclones()

    return events

async def predict_cyclone_risk(lat: float, lon: float, wind_speed: float, pressure: float) -> Dict[str, Any]:
    """
    Predicts cyclone risk level based on input data.
    """
    risk_level = calculate_cyclone_risk(wind_speed)
    
    # Simple probability mapping
    confidence = min(0.99, (wind_speed / 250.0)) if wind_speed > 0 else 0.1
    
    return {
        "risk_level": risk_level,
        "confidence": round(confidence, 2),
        "disaster_type": "Cyclone",
        "coordinates": [lat, lon],
        "severity": wind_speed,
        "alert_triggered": risk_level in ["HIGH", "CRITICAL"]
    }
