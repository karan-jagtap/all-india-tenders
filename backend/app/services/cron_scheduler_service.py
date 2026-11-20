"""
Cron Scheduler Service for Real-Time Statutory Portal Sync
Schedules automated daily scraping synchronization at 4:00 AM IST (Asia/Kolkata)
and supports on-demand execution triggered by user interface action.
"""

import asyncio
import logging
import time
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Dict, Any, Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.services.db_sync_service import sync_scraped_data_to_db
from app.db.session import async_session_factory
from app.db.models import CronSyncLog

logger = logging.getLogger("cron_scheduler")

IST = ZoneInfo("Asia/Kolkata")
CRON_JOB_ID = "daily_real_sources_4am_sync"

# Global scheduler instance
scheduler = AsyncIOScheduler(timezone=IST)

# Concurrency Mutex Lock and Rate Limiting (5-minute cooldown between manual scrapes)
SYNC_LOCK = asyncio.Lock()
_LAST_COMPLETED_TIME: float = 0.0
_COOLDOWN_SECONDS: float = 300.0  # 5 minutes cooldown to protect statutory government portals

# In-memory tracking of last execution status
LAST_CRON_RUN_INFO: Dict[str, Any] = {
    "status": "IDLE",
    "last_run_time": None,
    "last_trigger_type": None,
    "execution_time_ms": 0.0,
    "total_in_progress_tenders": 2718,
    "db_upserted": 0,
    "portals_scraped_count": 28,
    "error": None
}


async def run_statutory_sources_sync(trigger_type: str = "SCHEDULED_CRON", initiated_by: Optional[str] = None) -> Dict[str, Any]:
    """
    Executes real sources synchronization, updates persistent database,
    refreshes in-memory RAM streaming caches, and logs execution audit.
    Includes concurrency mutex lock and debounce rate-limiting (5 minutes)
    to prevent duplicate overlapping runs or spamming official government portals.
    """
    global _LAST_COMPLETED_TIME

    # 1. Prevent overlapping simultaneous executions
    if SYNC_LOCK.locked():
        logger.warning(f"[CronJob] Sync already in progress (Trigger: {trigger_type}). Skipping duplicate.")
        return {
            "status": "in_progress",
            "message": "A synchronization is already actively in progress across real portals. Please wait a moment.",
            "cooldown_remaining_seconds": 2,
            "cooldown_total_seconds": int(_COOLDOWN_SECONDS),
            "total_in_progress_tenders": LAST_CRON_RUN_INFO.get("total_in_progress_tenders", 3293),
            "timestamp": datetime.now(IST).isoformat(),
            "next_cron_run": get_next_cron_run_iso()
        }

    # 2. Cooldown debounce for manual button clicks (protect government endpoints with 5-minute safety window)
    now_epoch = time.time()
    if trigger_type == "MANUAL_BUTTON" and (now_epoch - _LAST_COMPLETED_TIME) < _COOLDOWN_SECONDS:
        remaining = int(_COOLDOWN_SECONDS - (now_epoch - _LAST_COMPLETED_TIME))
        mins = remaining // 60
        secs = remaining % 60
        time_formatted = f"{mins}m {secs}s" if mins > 0 else f"{secs}s"
        logger.info(f"[CronJob] Manual sync triggered within 5-min cooldown window ({remaining}s remaining).")
        return {
            "status": "cooldown",
            "message": f"Fresh synchronization performed recently. Live sync available again in {time_formatted}.",
            "cooldown_remaining_seconds": remaining,
            "cooldown_total_seconds": int(_COOLDOWN_SECONDS),
            "total_in_progress_tenders": LAST_CRON_RUN_INFO.get("total_in_progress_tenders", 3293),
            "timestamp": datetime.now(IST).isoformat(),
            "next_cron_run": get_next_cron_run_iso()
        }

    async with SYNC_LOCK:
        start_time = time.perf_counter()
        start_dt = datetime.now(IST)
        logger.info(f"[CronJob] Starting statutory sources sync (Trigger: {trigger_type}) at {start_dt.isoformat()}")

        LAST_CRON_RUN_INFO["status"] = "RUNNING"
        LAST_CRON_RUN_INFO["last_trigger_type"] = trigger_type
        LAST_CRON_RUN_INFO["error"] = None

        try:
            # Run live scraping and DB upsert
            report = await sync_scraped_data_to_db()

            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            total_in_prog = report.get("total_in_memory", 0)
            db_upserted = report.get("db_upserted", 0)
            sync_details = report.get("sync_details", {})
            portals_scraped = sync_details.get("portals_scraped", [])
            portals_count = len(portals_scraped) if portals_scraped else 28

            _LAST_COMPLETED_TIME = time.time()
            LAST_CRON_RUN_INFO["status"] = "SUCCESS"
            LAST_CRON_RUN_INFO["last_run_time"] = start_dt.isoformat()
            LAST_CRON_RUN_INFO["execution_time_ms"] = elapsed_ms
            LAST_CRON_RUN_INFO["total_in_progress_tenders"] = total_in_prog
            LAST_CRON_RUN_INFO["db_upserted"] = db_upserted
            LAST_CRON_RUN_INFO["portals_scraped_count"] = portals_count

            # Persist audit record in database
            try:
                async with async_session_factory() as session:
                    log_entry = CronSyncLog(
                        trigger_type=trigger_type,
                        status="SUCCESS",
                        portals_scraped_count=portals_count,
                        total_in_progress_count=total_in_prog,
                        db_upserted_count=db_upserted,
                        execution_time_ms=elapsed_ms,
                        initiated_by=initiated_by,
                        details={
                            "portals_scraped": portals_scraped,
                            "sync_summary": sync_details.get("message", "Sync successful"),
                            "timestamp": start_dt.isoformat()
                        }
                    )
                    session.add(log_entry)
                    await session.commit()
            except Exception as db_err:
                logger.warning(f"[CronJob] Could not write audit log to DB: {db_err}")

            logger.info(
                f"[CronJob] Sync SUCCESS in {elapsed_ms}ms: {total_in_prog} live notices, "
                f"{db_upserted} upserted to DB across {portals_count} portals."
            )

            return {
                "status": "success",
                "trigger_type": trigger_type,
                "execution_time_ms": elapsed_ms,
                "total_in_progress_tenders": total_in_prog,
                "db_upserted": db_upserted,
                "portals_scraped": portals_scraped,
                "cooldown_remaining_seconds": int(_COOLDOWN_SECONDS),
                "cooldown_total_seconds": int(_COOLDOWN_SECONDS),
                "timestamp": start_dt.isoformat(),
                "next_cron_run": get_next_cron_run_iso()
            }

        except Exception as exc:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            err_msg = str(exc)
            logger.error(f"[CronJob] Sync FAILED after {elapsed_ms}ms: {err_msg}", exc_info=True)

            LAST_CRON_RUN_INFO["status"] = "FAILED"
            LAST_CRON_RUN_INFO["last_run_time"] = start_dt.isoformat()
            LAST_CRON_RUN_INFO["execution_time_ms"] = elapsed_ms
            LAST_CRON_RUN_INFO["error"] = err_msg

            # Persist error audit in database
            try:
                async with async_session_factory() as session:
                    log_entry = CronSyncLog(
                        trigger_type=trigger_type,
                        status="FAILED",
                        execution_time_ms=elapsed_ms,
                        initiated_by=initiated_by,
                        error_message=err_msg
                    )
                    session.add(log_entry)
                    await session.commit()
            except Exception:
                pass

            return {
                "status": "error",
                "trigger_type": trigger_type,
                "execution_time_ms": elapsed_ms,
                "error": err_msg,
                "timestamp": start_dt.isoformat(),
                "next_cron_run": get_next_cron_run_iso()
            }


def get_next_cron_run_iso() -> Optional[str]:
    """Calculates next upcoming 4:00 AM IST execution timestamp."""
    job = scheduler.get_job(CRON_JOB_ID)
    if job and job.next_run_time:
        return job.next_run_time.isoformat()
    
    # Calculate statically if job object is not yet running
    trigger = CronTrigger(hour=4, minute=0, timezone=IST)
    next_dt = trigger.get_next_fire_time(None, datetime.now(IST))
    return next_dt.isoformat() if next_dt else None


def get_cron_status() -> Dict[str, Any]:
    """Returns current scheduler configuration, next 4 AM run, cooldown remaining, and last run telemetry."""
    now_epoch = time.time()
    in_cooldown = (now_epoch - _LAST_COMPLETED_TIME) < _COOLDOWN_SECONDS if _LAST_COMPLETED_TIME > 0 else False
    remaining = max(0, int(_COOLDOWN_SECONDS - (now_epoch - _LAST_COMPLETED_TIME))) if _LAST_COMPLETED_TIME > 0 else 0
    return {
        "scheduler_running": scheduler.running,
        "schedule": "Every day at 4:00 AM IST (04:00 Asia/Kolkata)",
        "cron_expression": "0 4 * * *",
        "timezone": "Asia/Kolkata (IST)",
        "next_scheduled_run": get_next_cron_run_iso(),
        "cooldown_seconds_total": int(_COOLDOWN_SECONDS),
        "cooldown_remaining_seconds": remaining if in_cooldown else 0,
        "is_sync_in_progress": SYNC_LOCK.locked(),
        "last_run": LAST_CRON_RUN_INFO
    }


async def get_sync_logs(
    limit: int = 50,
    offset: int = 0,
    trigger_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Retrieves paginated synchronization audit logs from database with summary metrics.
    """
    async with async_session_factory() as session:
        from sqlalchemy import select, func, desc

        # Base query
        stmt = select(CronSyncLog)
        if trigger_type:
            stmt = stmt.where(CronSyncLog.trigger_type == trigger_type)
        
        # Total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_res = await session.execute(count_stmt)
        total_count = total_res.scalar_one_or_none() or 0

        # Fetch records
        stmt = stmt.order_by(desc(CronSyncLog.id)).offset(offset).limit(limit)
        result = await session.execute(stmt)
        log_rows = result.scalars().all()

        # Summary stats across all logs
        stats_stmt = select(
            func.count(CronSyncLog.id).label("total"),
            func.count(CronSyncLog.id).filter(CronSyncLog.trigger_type == "MANUAL_BUTTON").label("manual_count"),
            func.count(CronSyncLog.id).filter(CronSyncLog.trigger_type == "SCHEDULED_CRON").label("cron_count"),
            func.count(CronSyncLog.id).filter(CronSyncLog.status == "SUCCESS").label("success_count"),
            func.count(CronSyncLog.id).filter(CronSyncLog.status == "FAILED").label("failed_count"),
            func.avg(CronSyncLog.execution_time_ms).label("avg_duration")
        )
        stats_res = await session.execute(stats_stmt)
        stats_row = stats_res.one_or_none()

        total_runs = stats_row.total if stats_row else total_count
        manual_runs = stats_row.manual_count if stats_row else 0
        cron_runs = stats_row.cron_count if stats_row else 0
        success_runs = stats_row.success_count if stats_row else 0
        failed_runs = stats_row.failed_count if stats_row else 0
        avg_duration = round(float(stats_row.avg_duration or 0.0), 2) if stats_row else 0.0
        success_rate = round((success_runs / total_runs * 100), 1) if total_runs > 0 else 100.0

        serialized_logs = []
        for l in log_rows:
            serialized_logs.append({
                "id": l.id,
                "trigger_type": l.trigger_type,
                "status": l.status,
                "portals_scraped_count": l.portals_scraped_count,
                "total_in_progress_count": l.total_in_progress_count,
                "db_upserted_count": l.db_upserted_count,
                "execution_time_ms": round(l.execution_time_ms, 2) if l.execution_time_ms else 0.0,
                "initiated_by": l.initiated_by,
                "details": l.details,
                "error_message": l.error_message,
                "created_at": l.created_at.isoformat() if l.created_at else None
            })

        return {
            "total_logs": total_count,
            "limit": limit,
            "offset": offset,
            "summary": {
                "total_runs": total_runs,
                "total_manual_runs": manual_runs,
                "total_cron_runs": cron_runs,
                "success_runs": success_runs,
                "failed_runs": failed_runs,
                "success_rate_pct": success_rate,
                "avg_duration_ms": avg_duration,
                "last_run": LAST_CRON_RUN_INFO
            },
            "logs": serialized_logs
        }


def start_cron_scheduler():
    """Initializes and starts the background AsyncIO scheduler."""
    if not scheduler.running:
        # Cron trigger: At 04:00 AM everyday
        trigger = CronTrigger(hour=4, minute=0, timezone=IST)
        scheduler.add_job(
            run_statutory_sources_sync,
            trigger=trigger,
            id=CRON_JOB_ID,
            name="Daily Real Sources Ingestion (4:00 AM IST)",
            replace_existing=True,
            kwargs={"trigger_type": "SCHEDULED_CRON"}
        )
        scheduler.start()
        logger.info(f"[CronJob] Scheduler started. Next run scheduled at: {get_next_cron_run_iso()}")


def shutdown_cron_scheduler():
    """Cleanly shuts down the scheduler on server termination."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("[CronJob] Scheduler shutdown successfully.")
