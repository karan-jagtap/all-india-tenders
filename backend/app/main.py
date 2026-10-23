import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

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

# Include API Router under /api
app.include_router(router, prefix="/api")
# Also mount router at root for backward compatibility
app.include_router(router)

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
