import httpx

USGS_URL = (
    "https://earthquake.usgs.gov/"
    "earthquakes/feed/v1.0/summary/"
    "significant_hour.geojson"
)


async def fetch_earthquakes():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            USGS_URL
        )

        data = response.json()

        earthquakes = []

        for feature in data.get(
            "features",
            []
        ):
            props = feature[
                "properties"
            ]

            coords = feature[
                "geometry"
            ]["coordinates"]

            magnitude = props.get(
                "mag",
                0,
            )

            level = (
                "CRITICAL"
                if magnitude >= 7
                else "HIGH"
                if magnitude >= 5
                else "MEDIUM"
            )

            earthquakes.append({
                "id": feature["id"],

                "title":
                    props.get(
                        "title",
                        "Earthquake",
                ),

                "type":
                    "Earthquake",

                "location":
                    props.get(
                        "place",
                        "Unknown",
                ),

                "level": level,

                "magnitude":
                    magnitude,

                "coordinates": [
                    coords[1],
                    coords[0],
                ],
            })

        return earthquakes
