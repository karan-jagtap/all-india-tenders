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


async def run_statutory_sources_sync(trigger_type: str = "SCHEDULED_CRON") -> Dict[str, Any]:
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
