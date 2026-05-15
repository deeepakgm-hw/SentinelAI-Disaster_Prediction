import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8000"

async def test_endpoints():
    print("Testing Backend Endpoints...\n")
    
    async with httpx.AsyncClient() as client:
        # 1. Health
        try:
            res = await client.get(f"{BASE_URL}/api/health")
            print(f"Health Check: {res.status_code} - {res.json()}")
        except Exception as e:
            print(f"Health Check Failed: {e}")
            
        # 2. Events
        try:
            res = await client.get(f"{BASE_URL}/api/events", timeout=20.0)
            data = res.json()
            print(f"Events: {res.status_code} - Received {len(data)} events")
        except Exception as e:
            print(f"Events Failed: {e}")
            
        # 3. Cyclones
        try:
            res = await client.get(f"{BASE_URL}/api/cyclones/live", timeout=20.0)
            data = res.json()
            print(f"Cyclones Live: {res.status_code} - Success: {data.get('success')}, Events: {len(data.get('events', []))}")
        except Exception as e:
            print(f"Cyclones Live Failed: {e}")
            
        # 4. Floods
        try:
            res = await client.get(f"{BASE_URL}/api/floods/live", timeout=20.0)
            data = res.json()
            print(f"Floods Live: {res.status_code} - Success: {data.get('success')}, Events: {len(data.get('events', []))}")
        except Exception as e:
            print(f"Floods Live Failed: {e}")
            
        # 5. Predict Cyclone (Mock)
        try:
            payload = {
                "lat": 25.76,
                "lon": -80.19,
                "wind_speed": 180.0,
                "pressure": 980.0
            }
            res = await client.post(f"{BASE_URL}/api/cyclones/predict", json=payload, timeout=20.0)
            data = res.json()
            print(f"Predict Cyclone: {res.status_code} - {data}")
        except Exception as e:
            print(f"Predict Cyclone Failed: {e}")
            
        # 6. Predict Flood (Mock)
        try:
            payload = {
                "lat": -6.20,
                "lon": 106.84,
                "rainfall_mm": 120.0
            }
            res = await client.post(f"{BASE_URL}/api/floods/predict", json=payload, timeout=20.0)
            data = res.json()
            print(f"Predict Flood: {res.status_code} - {data}")
        except Exception as e:
            print(f"Predict Flood Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
