from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from db.sqlite_database import get_db
from db.models import EmergencyLocation, User
from routes.auth import get_current_user

router = APIRouter(
    prefix="/api/emergency",
    tags=["Emergency"]
)

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

class SafeZone(BaseModel):
    id: str
    name: str
    type: str
    latitude: float
    longitude: float
    distance_km: float

@router.post("/location")
def update_emergency_location(
    location: LocationUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    try:
        new_location = EmergencyLocation(
            user_id=current_user.id,
            latitude=location.latitude,
            longitude=location.longitude,
            status="ACTIVE"
        )
        db.add(new_location)
        db.commit()
        return {"success": True, "message": "Live location broadcasted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

import httpx
import math

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.get("/safezones/nearby", response_model=List[SafeZone])
async def get_nearby_safezones(
    latitude: float,
    longitude: float,
    current_user: User = Depends(get_current_user)
):
    safe_zones = []
    overpass_url = "https://overpass-api.de/api/interpreter"
    
    # 5000 meters = 5km radius
    overpass_query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:5000, {latitude}, {longitude});
      node["amenity"="police"](around:5000, {latitude}, {longitude});
      node["amenity"="fire_station"](around:5000, {latitude}, {longitude});
    );
    out center 10;
    """
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(overpass_url, data={'data': overpass_query})
            if response.status_code == 200:
                data = response.json()
                for element in data.get('elements', []):
                    tags = element.get('tags', {})
                    name = tags.get('name')
                    
                    if not name:
                        name = "Local " + tags.get('amenity', 'Facility').title()
                        
                    amenity = tags.get('amenity', 'Facility').title()
                    lat = element.get('lat')
                    lon = element.get('lon')
                    
                    if lat and lon:
                        dist = calculate_distance(latitude, longitude, lat, lon)
                        safe_zones.append(
                            SafeZone(
                                id=str(element.get('id')),
                                name=name,
                                type=amenity.replace('_', ' '),
                                latitude=lat,
                                longitude=lon,
                                distance_km=round(dist, 2)
                            )
                        )
    except Exception as e:
        print(f"Overpass API error: {e}")
        
    if not safe_zones:
        # Fallback to mock data relative to the user if API fails or no zones found
        safe_zones = [
            SafeZone(id="sz_1", name="Central Relief Camp", type="Camp", latitude=latitude + 0.015, longitude=longitude + 0.012, distance_km=2.1),
            SafeZone(id="sz_2", name="City General Hospital", type="Hospital", latitude=latitude - 0.02, longitude=longitude + 0.005, distance_km=3.4)
        ]
        
    safe_zones.sort(key=lambda x: x.distance_km)
    return safe_zones[:5]
