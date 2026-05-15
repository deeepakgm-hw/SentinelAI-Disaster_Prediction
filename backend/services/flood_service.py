import httpx
import uuid
from typing import List, Dict, Any
from datetime import datetime, timedelta

# Flood monitoring locations for live tracking
FLOOD_ZONES = [
    {"name": "London, UK", "lat": 51.5074, "lon": -0.1278},
    {"name": "São Paulo, Brazil", "lat": -23.5505, "lon": -46.6333},
    {"name": "Paris, France", "lat": 48.8566, "lon": 2.3522},
    {"name": "Mumbai, India", "lat": 19.0760, "lon": 72.8777},
    {"name": "Jakarta, Indonesia", "lat": -6.2088, "lon": 106.8456},
]

def calculate_flood_risk(rainfall_mm: float) -> str:
    """
    Categorizes flood risk based on daily rainfall intensity (mm).
    """
    if rainfall_mm >= 150:
        return "CRITICAL"
    elif rainfall_mm >= 100:
        return "HIGH"
    elif rainfall_mm >= 50:
        return "MEDIUM"
    else:
        return "LOW"

def get_mock_floods() -> List[Dict[str, Any]]:
    return [
        {
            "id": str(uuid.uuid4()),
            "type": "Flood",
            "title": "Severe Flash Flooding",
            "location": "Jakarta, Indonesia",
            "lat": -6.2088,
            "lon": 106.8456,
            "rainfall": 125.5,
            "humidity": 92,
            "level": "HIGH",
            "timestamp": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "type": "Flood",
            "title": "Thames Water Level Warning",
            "location": "London, UK",
            "lat": 51.5074,
            "lon": -0.1278,
            "rainfall": 55.2,
            "humidity": 88,
            "level": "MEDIUM",
            "timestamp": datetime.utcnow().isoformat()
        }
    ]

async def fetch_live_floods() -> List[Dict[str, Any]]:
    """
    Fetches precipitation data from NASA POWER API.
    """
    events = []
    
    # NASA POWER uses dates in YYYYMMDD format. We query the last available day.
    # The API might be delayed by a few days, so we fetch a small window and take the max.
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=5)
    start_str = start_date.strftime("%Y%m%d")
    end_str = end_date.strftime("%Y%m%d")
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        for zone in FLOOD_ZONES:
            try:
                url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,RH2M&community=RE&longitude={zone['lon']}&latitude={zone['lat']}&start={start_str}&end={end_str}&format=JSON"
                response = await client.get(url)
                
                if response.status_code == 200:
                    data = response.json()
                    properties = data.get("properties", {}).get("parameter", {})
                    
                    # PRECTOTCORR is Precipitation Corrected (mm/day)
                    precip_data = properties.get("PRECTOTCORR", {})
                    humidity_data = properties.get("RH2M", {})
                    
                    # Filter out missing values (-999.0) and find the maximum recent rainfall
                    valid_precips = [v for v in precip_data.values() if v != -999.0]
                    valid_humidities = [v for v in humidity_data.values() if v != -999.0]
                    
                    max_rainfall = max(valid_precips) if valid_precips else 0
                    avg_humidity = sum(valid_humidities) / len(valid_humidities) if valid_humidities else 50
                    
                    # Only register if there's significant rainfall (e.g., > 30mm)
                    if max_rainfall > 30:
                        risk = calculate_flood_risk(max_rainfall)
                        events.append({
                            "id": str(uuid.uuid4()),
                            "type": "Flood",
                            "title": f"Flood Risk - {zone['name']}",
                            "location": zone["name"],
                            "lat": zone["lat"],
                            "lon": zone["lon"],
                            "rainfall": round(max_rainfall, 2),
                            "humidity": round(avg_humidity, 2),
                            "level": risk,
                            "timestamp": datetime.utcnow().isoformat()
                        })
            except Exception as e:
                print(f"Error fetching NASA POWER data for {zone['name']}: {e}")
                
    if not events:
        return get_mock_floods()

    return events

async def predict_flood_risk(lat: float, lon: float, rainfall_mm: float) -> Dict[str, Any]:
    """
    Predicts flood risk based on rainfall thresholds.
    """
    risk_level = calculate_flood_risk(rainfall_mm)
    
    # Simple probability mapping based on rainfall (capped at 99%)
    confidence = min(0.99, (rainfall_mm / 200.0)) if rainfall_mm > 0 else 0.1
    
    return {
        "risk_level": risk_level,
        "confidence": round(confidence, 2),
        "disaster_type": "Flood",
        "coordinates": [lat, lon],
        "severity": rainfall_mm,
        "alert_triggered": risk_level in ["HIGH", "CRITICAL"]
    }
