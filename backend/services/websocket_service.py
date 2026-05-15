from utils.connection_manager import (
    manager,
)


async def broadcast_event(
    event_data
):
    await manager.broadcast({
        "type": "NEW_EVENT",
        "data": event_data,
    })


async def broadcast_alert(
    alert_data
):
    await manager.broadcast({
        "type": "NEW_ALERT",
        "data": alert_data,
    })


async def broadcast_activity(
    activity_data
):
    await manager.broadcast({
        "type": "NEW_ACTIVITY",
        "data": activity_data,
    })
