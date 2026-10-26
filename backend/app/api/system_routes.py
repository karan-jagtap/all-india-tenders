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
from app.services.db_sync_service import sync_scraped_data_to_db
from app.services.cron_scheduler_service import run_statutory_sources_sync, get_cron_status
from app.db.session import IS_POSTGRES, DATABASE_URL

router = APIRouter(tags=["System & Platform"])


@router.get("/health")
async def health_check():
    """
    Returns platform health, persistent database engine, live catalog counts, and cron status.
    """
    cron_info = get_cron_status()
    return {
        "status": "healthy",
        "app": "All India Tenders",
        "database_engine": "PostgreSQL 16 (pgvector)" if IS_POSTGRES else "SQLite (aiosqlite)",
        "vector_db_ready": True,
        "storage_mode": "Enterprise Hybrid (PostgreSQL/SQLite Persistent DB + In-Memory RAM Streaming)",
        "current_in_progress_count": len(ALL_CURRENT_TENDERS),
        "accepted_tenders_count": len(ACCEPTED_TENDERS_CATALOG),
        "cron_sync": {
            "schedule": cron_info["schedule"],
            "next_run": cron_info["next_scheduled_run"],
            "scheduler_running": cron_info["scheduler_running"]
        }
    }


@router.post("/scraper/scrape-live")
async def trigger_live_scrape():
    """
    Runs the official scraper synchronization job immediately (same job scheduled daily at 3:00 AM IST).
    Upserts scraped notices into persistent database and synchronizes the in-memory streaming catalog.
    """
    report = await run_statutory_sources_sync(trigger_type="MANUAL_BUTTON")
    return JSONResponse(
        content=report,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )


@router.get("/scraper/cron-status")
@router.get("/cron/status")
async def get_cron_sync_status():
    """
    Returns the automated daily cron configuration (3:00 AM IST), next run timestamp, and last execution details.
    """
    return get_cron_status()


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

    cron_info = get_cron_status()
    return {
        "active_tenders_count": len(ALL_CURRENT_TENDERS),
        "accepted_tenders_count": len(ACCEPTED_TENDERS_CATALOG),
        "registered_bidders_count": len(ALL_BIDDERS_CATALOG),
        "database_engine": "PostgreSQL 16 (pgvector)" if IS_POSTGRES else "SQLite (aiosqlite)",
        "vector_ready": True,
        "architecture": "Enterprise Hybrid (PostgreSQL/SQLite Persistent DB + In-Memory RAM Stream)",
        "cron_sync": {
            "schedule": cron_info["schedule"],
            "cron_expression": cron_info["cron_expression"],
            "timezone": cron_info["timezone"],
            "next_run": cron_info["next_scheduled_run"]
        },
        "total_portals_monitored": len(portals),
        "portals_list": sorted(list(portals)),
        "total_active_procurement_value_inr": total_active_val,
        "states_covered": len(STATE_CITY_MAP)
    }
