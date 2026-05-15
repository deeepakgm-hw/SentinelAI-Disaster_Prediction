from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# =====================================
# ROUTES
# =====================================

from routes.events import (
    router as events_router,
)

from routes.alerts import (
    router as alerts_router,
)

from routes.ws import (
    router as ws_router,
)

from routes.simulate import (
    router as simulate_router,
)

from routes.event_stats import (
    router as stats_router,
)

from routes.prediction import (
    router as prediction_router,
)

from routes.cyclone import (
    router as cyclone_router,
)

from routes.flood import (
    router as flood_router,
)

from routes.health import (
    router as health_router,
)

from routes.auth import (
    router as auth_router,
)

from routes.chat import (
    router as chat_router,
)

from routes.notifications import (
    router as notifications_router,
)

from routes.emergency import (
    router as emergency_router,
)

from routes.location import (
    router as location_router,
)

from db.sqlite_database import engine, Base

# =====================================
# SCHEDULER
# =====================================

from scheduler.jobs import (
    start_scheduler,
)

app = FastAPI(
    title="SentinelAI API"
)

# =====================================
# STARTUP EVENT
# =====================================


@app.on_event("startup")
async def startup_event():
    # Create SQLite tables
    Base.metadata.create_all(bind=engine)
    start_scheduler()

# =====================================
# EXCEPTION HANDLERS
# =====================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"success": False, "error": "Validation Error", "details": exc.errors()},
    )

# =====================================
# CORS CONFIG
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# REGISTER ROUTES
# =====================================

app.include_router(
    events_router
)

app.include_router(
    alerts_router
)

app.include_router(
    ws_router
)

app.include_router(
    simulate_router
)

app.include_router(
    stats_router
)

app.include_router(
    prediction_router
)

app.include_router(
    cyclone_router
)

app.include_router(
    flood_router
)

app.include_router(
    health_router
)

app.include_router(
    auth_router
)

app.include_router(
    chat_router
)

app.include_router(
    notifications_router
)

app.include_router(
    emergency_router
)

app.include_router(
    location_router
)

# =====================================
# ROOT
# =====================================


@app.get("/")
async def root():
    return {
        "message":
            "SentinelAI API Running"
    }
