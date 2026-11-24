"""
System & Platform Management API Routes
Handles health checks, real-time scraping synchronization, and platform aggregate metrics.
"""

from typing import Optional
from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from app.services.current_tenders_service import (
    ALL_CURRENT_TENDERS,
    STATE_CITY_MAP,
    run_pure_scraping_sync
)
from app.services.accepted_tenders_service import ACCEPTED_TENDERS_CATALOG, get_accepted_tenders_count
from app.services.bidders_service import ALL_BIDDERS_CATALOG
from app.services.db_sync_service import sync_scraped_data_to_db
from app.services.cron_scheduler_service import (
    run_statutory_sources_sync,
    get_cron_status,
    get_sync_logs,
    get_user_sync_quota
)
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
        "database_engine": "PostgreSQL 16 (pgvector)",
        "vector_db_ready": True,
        "storage_mode": "Enterprise PostgreSQL 16 (pgvector) + In-Memory RAM Streaming",
        "current_in_progress_count": len(ALL_CURRENT_TENDERS),
        "accepted_tenders_count": get_accepted_tenders_count(),
        "cron_sync": {
            "schedule": cron_info["schedule"],
            "next_run": cron_info["next_scheduled_run"],
            "scheduler_running": cron_info["scheduler_running"]
        }
    }


@router.get("/scraper/user-quota")
@router.get("/system/user-sync-quota")
async def get_user_quota_endpoint(
    user_id: str = Query(..., description="Clerk User ID of signed-in user")
):
    """
    Returns user sync quota status (limit: 2 syncs per 24 hours),
    remaining syncs, lock status, and time until next sync is available.
    """
    quota_info = await get_user_sync_quota(user_id=user_id)
    return JSONResponse(
        content=quota_info,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )


@router.post("/scraper/scrape-live")
@router.post("/cron/trigger")
@router.post("/cron/sync")
async def trigger_live_scrape(request: Request = None):
    """
    Runs the official scraper synchronization job immediately (same job scheduled daily at 4:00 AM IST).
    Upserts scraped notices into persistent database and synchronizes the in-memory streaming catalog.
    Enforces 2 syncs per 24 hours limit per signed-in user.
    """
    client_ip = request.client.host if (request and request.client) else "web"
    user_id = None
    user_email = None
    user_name = None

    if request:
        try:
            body = await request.json()
            if isinstance(body, dict):
                user_id = body.get("user_id")
                user_email = body.get("user_email")
                user_name = body.get("user_name")
        except Exception:
            pass

        if not user_id:
            user_id = request.query_params.get("user_id")
            user_email = request.query_params.get("user_email") or user_email
            user_name = request.query_params.get("user_name") or user_name

    initiated_by = (
        f"{user_name} ({user_email})" if (user_name and user_email)
        else (f"{user_email}" if user_email else (f"User {user_id}" if user_id else f"Manual UI ({client_ip})"))
    )

    report = await run_statutory_sources_sync(
        trigger_type="MANUAL_BUTTON",
        initiated_by=initiated_by,
        user_id=user_id,
        user_email=user_email,
        user_name=user_name
    )

    status_code = 200
    if report.get("status") == "quota_exceeded":
        status_code = 429

    return JSONResponse(
        status_code=status_code,
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
    Returns the automated daily cron configuration (4:00 AM IST), next run timestamp, and last execution details.
    """
    return get_cron_status()


@router.get("/system/sync-logs")
@router.get("/cron/logs")
@router.get("/scraper/logs")
async def get_sync_audit_logs(
    limit: int = Query(50, ge=1, le=200, description="Max logs to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    trigger_type: Optional[str] = Query(None, description="Filter by MANUAL_BUTTON or SCHEDULED_CRON")
):
    """
    Returns historical synchronization audit logs from the persistent database,
    logging every manual sync and automated 4:00 AM IST scheduled cron run.
    """
    logs_data = await get_sync_logs(limit=limit, offset=offset, trigger_type=trigger_type)
    return JSONResponse(
        content=logs_data,
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
    active_count = len(ALL_CURRENT_TENDERS)
    try:
        from app.db.postgres_pool import get_pg_cursor
        with get_pg_cursor() as cur:
            cur.execute("SELECT COUNT(*) AS total FROM tenders")
            row = cur.fetchone()
            if row and row["total"] > 0:
                active_count = row["total"]
    except Exception:
        pass

    portals = set()
    total_active_val = 0.0
    for t in ALL_CURRENT_TENDERS:
        portals.add(t.get("source_portal", "Central CPPP"))
        total_active_val += float(t.get("estimated_cost_inr") or 0.0)

    for a in ACCEPTED_TENDERS_CATALOG:
        portals.add(a.get("og_tender", {}).get("portal", "Central CPPP"))

    cron_info = get_cron_status()
    return {
        "active_tenders_count": active_count,
        "accepted_tenders_count": get_accepted_tenders_count(),
        "registered_bidders_count": len(ALL_BIDDERS_CATALOG),
        "database_engine": "PostgreSQL 16 (pgvector)",
        "vector_ready": True,
        "architecture": "Enterprise PostgreSQL 16 (pgvector) + In-Memory RAM Stream",
        "cooldown_remaining_seconds": cron_info.get("cooldown_remaining_seconds", 0),
        "cooldown_seconds_total": cron_info.get("cooldown_seconds_total", 300),
        "is_sync_in_progress": cron_info.get("is_sync_in_progress", False),
        "cron_sync": {
            "schedule": cron_info["schedule"],
            "cron_expression": cron_info["cron_expression"],
            "timezone": cron_info["timezone"],
            "next_run": cron_info["next_scheduled_run"],
            "cooldown_remaining_seconds": cron_info.get("cooldown_remaining_seconds", 0),
            "cooldown_seconds_total": cron_info.get("cooldown_seconds_total", 300)
        },
        "total_portals_monitored": len(portals),
        "portals_list": sorted(list(portals)),
        "total_active_procurement_value_inr": total_active_val,
        "states_covered": len(STATE_CITY_MAP)
    }
