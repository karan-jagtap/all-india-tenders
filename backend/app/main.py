import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.system_routes import router as system_router
from app.api.current_tenders_routes import router as current_tenders_router
from app.api.accepted_tenders_routes import router as accepted_tenders_router
from app.api.bidders_routes import router as bidders_router

app = FastAPI(
    title="All India Tenders API",
    description="Live & Historical Indian Public Procurement Intelligence Platform covering CPPP, MahaTenders, GeM, IREPS, CPWD, Delhi, and UP.",
    version="1.0.0"
)

# Enable CORS for React Frontend (running on port 3001 or 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount individual sectional API routers under /api
app.include_router(system_router, prefix="/api")
app.include_router(current_tenders_router, prefix="/api")
app.include_router(accepted_tenders_router, prefix="/api")
app.include_router(bidders_router, prefix="/api")

# Also mount under root for backwards compatibility
app.include_router(system_router)
app.include_router(current_tenders_router)
app.include_router(accepted_tenders_router)
app.include_router(bidders_router)

@app.get("/")
async def root():
    return {
        "platform": "All India Tenders API",
        "status": "online",
        "documentation": "/docs",
        "endpoints": {
            "current_tenders": "/api/current-tenders",
            "accepted_tenders": "/api/accepted-tenders",
            "platform_stats": "/api/stats",
            "health": "/api/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
