import requests

def test():
    EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events"
    response = requests.get(EONET_URL, timeout=10)
    data = response.json()
    events = data.get("events", [])
    
    wildfires = 0
    for event in events:
        categories = event.get("categories", [])
        if not categories:
            continue
        disaster_type = categories[0].get("title", "Disaster")
        if disaster_type.lower().find("wildfire") != -1:
            wildfires += 1
            print("Wildfire:", event["title"])
            print("Geometry:", event.get("geometry", [])[-1])
            
    print("Total Wildfires:", wildfires)

if __name__ == "__main__":
    test()
