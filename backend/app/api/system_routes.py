"""
System & Platform Management API Routes
Handles health checks, real-time scraping synchronization, and platform aggregate metrics.
"""

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.services.current_tenders_service import (
    ALL_CURRENT_TENDERS,
    STATE_CITY_MAP,
    run_pure_scraping_sync
)
from app.services.accepted_tenders_service import ACCEPTED_TENDERS_CATALOG
from app.services.bidders_service import ALL_BIDDERS_CATALOG

router = APIRouter(tags=["System & Platform"])


@router.get("/health")
async def health_check():
    """
    Returns platform health, memory storage mode, and live catalog counts.
    """
    return {
        "status": "healthy",
        "app": "All India Tenders",
        "database_required": False,
        "storage_mode": "Purely Scraping-Based (In-Memory RAM Streaming)",
        "current_in_progress_count": len(ALL_CURRENT_TENDERS),
        "accepted_tenders_count": len(ACCEPTED_TENDERS_CATALOG)
    }


@router.post("/scraper/scrape-live")
async def trigger_live_scrape():
    """
    Triggers live statutory scraping across CPPP, MahaTenders, GeM, IREPS, CPWD, Delhi, and UP portals.
    Refreshes in-progress unfilled tenders directly in RAM with 0 database writes.
    """
    report = run_pure_scraping_sync()
    return JSONResponse(
        content=report,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )


@router.get("/stats")
async def get_overview_stats():
    """
    Returns platform statistics across live and awarded procurement records.
    """
    portals = set()
    total_active_val = 0.0
    for t in ALL_CURRENT_TENDERS:
        portals.add(t.get("source_portal", "Central CPPP"))
        total_active_val += float(t.get("estimated_cost_inr") or 0.0)

    for a in ACCEPTED_TENDERS_CATALOG:
        portals.add(a.get("og_tender", {}).get("portal", "Central CPPP"))

    return {
        "active_tenders_count": len(ALL_CURRENT_TENDERS),
        "accepted_tenders_count": len(ACCEPTED_TENDERS_CATALOG),
        "registered_bidders_count": len(ALL_BIDDERS_CATALOG),
        "database_required": False,
        "architecture": "Purely Scraping-Based (In-Memory RAM Streaming, 0 DB Required)",
        "total_portals_monitored": len(portals),
        "portals_list": sorted(list(portals)),
        "total_active_procurement_value_inr": total_active_val,
        "states_covered": len(STATE_CITY_MAP)
    }
