from db.database import alerts_collection


async def get_all_alerts():
    alerts = []

    async for alert in alerts_collection.find():
        alert["_id"] = str(alert["_id"])

        alerts.append(alert)

    return alerts


async def create_alert(alert_data):
    result = await alerts_collection.insert_one(
        alert_data
    )

    alert_data["_id"] = str(
        result.inserted_id
    )

    return alert_data
