"""
Cron Scheduler Service for Real-Time Statutory Portal Sync
Schedules automated daily scraping synchronization at 4:00 AM IST (Asia/Kolkata)
and supports on-demand execution triggered by user interface action.
"""

import asyncio
import logging
import time
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from typing import Dict, Any, Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select

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

# User Sync Quota Constraints (2 syncs per 24 hours per signed-in user)
USER_DAILY_SYNC_LIMIT: int = 2


def to_utc_iso(dt: Optional[datetime]) -> Optional[str]:
    """Serializes a datetime into an explicit ISO 8601 UTC string ending in 'Z'."""
    if not dt:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    iso = dt.isoformat()
    if iso.endswith("+00:00"):
        return iso[:-6] + "Z"
    if not iso.endswith("Z"):
        return iso + "Z"
    return iso

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


async def get_user_sync_quota(user_id: Optional[str]) -> Dict[str, Any]:
    """
    Calculates 24-hour sync quota usage for a given authenticated user.
    Rule: Signed-in users can press the sync button only twice within 24 hours.
    User can press sync button whenever they want within 24 hours.
    Once 2 syncs have been used within 24 hours, the sync button remains locked
    until 24 hours have elapsed from the user's last sync.
    """
    if not user_id:
        return {
            "user_id": None,
            "sync_limit": USER_DAILY_SYNC_LIMIT,
            "syncs_used_24h": 0,
            "syncs_remaining": USER_DAILY_SYNC_LIMIT,
            "is_locked": False,
            "next_sync_available_seconds": 0,
            "next_sync_available_formatted": "Available now",
            "next_sync_available_at": None,
            "last_sync_at": None,
            "last_user_name": None,
            "last_user_email": None,
            "recent_syncs": []
        }

    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
    cutoff_24h = now_utc - timedelta(hours=24)

    try:
        from sqlalchemy import select
        async with async_session_factory() as session:
            # 1. Clean up any stale RUNNING logs (> 2.5 minutes)
            stale_stmt = (
                select(CronSyncLog)
                .where(
                    CronSyncLog.user_id == user_id,
                    CronSyncLog.status == "RUNNING",
                    CronSyncLog.created_at < (now_utc - timedelta(minutes=2, seconds=30))
                )
            )
            stale_res = await session.execute(stale_stmt)
            stale_logs = stale_res.scalars().all()
            if stale_logs:
                for sl in stale_logs:
                    sl.status = "FAILED"
                    sl.error_message = "Execution timed out"
                    sl.completed_at = now_utc
                await session.commit()

            # 2. Check for actively RUNNING sync for this user in DB
            active_running_stmt = (
                select(CronSyncLog)
                .where(
                    CronSyncLog.user_id == user_id,
                    CronSyncLog.status == "RUNNING",
                    CronSyncLog.created_at >= (now_utc - timedelta(minutes=5))
                )
                .order_by(CronSyncLog.created_at.desc())
                .limit(1)
            )
            active_res = await session.execute(active_running_stmt)
            active_running_log = active_res.scalar_one_or_none()
            is_user_syncing = bool(active_running_log) or SYNC_LOCK.locked()

            # 3. Query all syncs within last 24h (both SUCCESS and actively RUNNING)
            stmt = (
                select(CronSyncLog)
                .where(
                    CronSyncLog.user_id == user_id,
                    CronSyncLog.trigger_type == "MANUAL_BUTTON",
                    CronSyncLog.status.in_(["SUCCESS", "RUNNING"]),
                    CronSyncLog.created_at >= cutoff_24h
                )
                .order_by(CronSyncLog.created_at.desc())
            )
            res = await session.execute(stmt)
            logs = res.scalars().all()

            syncs_used = len(logs)
            last_24h_log = logs[0] if logs else None

            # Get user's absolute latest completed sync ever (or latest overall sync) for display
            latest_stmt = (
                select(CronSyncLog)
                .where(
                    CronSyncLog.user_id == user_id,
                    CronSyncLog.status == "SUCCESS"
                )
                .order_by(CronSyncLog.created_at.desc())
                .limit(1)
            )
            latest_res = await session.execute(latest_stmt)
            latest_user_log = latest_res.scalar_one_or_none()

            if not latest_user_log:
                sys_latest_stmt = (
                    select(CronSyncLog)
                    .where(CronSyncLog.status == "SUCCESS")
                    .order_by(CronSyncLog.created_at.desc())
                    .limit(1)
                )
                sys_res = await session.execute(sys_latest_stmt)
                latest_user_log = sys_res.scalar_one_or_none()

            # Get up to 5 most recent sync logs for this user
            recent_stmt = (
                select(CronSyncLog)
                .where(
                    CronSyncLog.user_id == user_id
                )
                .order_by(CronSyncLog.created_at.desc())
                .limit(5)
            )
            recent_res = await session.execute(recent_stmt)
            recent_logs = list(recent_res.scalars().all())

            display_log = latest_user_log or last_24h_log
            last_sync_time = display_log.created_at if display_log else None

            # 4. Quota lock calculation
            is_locked = False
            remaining_seconds = 0
            unlock_time = None

            if syncs_used >= USER_DAILY_SYNC_LIMIT and last_24h_log:
                unlock_time = (
                    getattr(last_24h_log, "next_sync_available_at", None)
                    or (last_24h_log.created_at + timedelta(hours=24))
                )
                if unlock_time:
                    remaining_seconds = max(0, int((unlock_time - now_utc).total_seconds()))
                    is_locked = remaining_seconds > 0
                if not is_locked:
                    syncs_remaining = USER_DAILY_SYNC_LIMIT
                else:
                    syncs_remaining = 0
            else:
                syncs_remaining = max(0, USER_DAILY_SYNC_LIMIT - syncs_used)

            # 5. Safety cooldown calculation from database
            cooldown_remaining_seconds = 0
            if last_24h_log and getattr(last_24h_log, "cooldown_until", None):
                cd_diff = int((last_24h_log.cooldown_until - now_utc).total_seconds())
                if cd_diff > 0:
                    cooldown_remaining_seconds = cd_diff

            hrs = remaining_seconds // 3600
            mins = (remaining_seconds % 3600) // 60
            secs = remaining_seconds % 60
            if hrs > 0:
                time_formatted = f"{hrs}h {mins}m {secs}s"
            elif mins > 0:
                time_formatted = f"{mins}m {secs}s"
            else:
                time_formatted = f"{secs}s"

            return {
                "user_id": user_id,
                "sync_limit": USER_DAILY_SYNC_LIMIT,
                "syncs_used_24h": syncs_used,
                "syncs_remaining": syncs_remaining,
                "is_locked": is_locked,
                "is_sync_in_progress": is_user_syncing,
                "next_sync_available_seconds": remaining_seconds,
                "next_sync_available_formatted": time_formatted if is_locked else "Available now",
                "next_sync_available_at": to_utc_iso(unlock_time) if (unlock_time and is_locked) else None,
                "cooldown_remaining_seconds": cooldown_remaining_seconds,
                "last_sync_at": to_utc_iso(last_sync_time) if last_sync_time else None,
                "last_user_name": display_log.user_name if display_log else None,
                "last_user_email": display_log.user_email if display_log else None,
                "recent_syncs": [
                    {
                        "id": l.id,
                        "created_at": to_utc_iso(l.created_at) if l.created_at else None,
                        "completed_at": to_utc_iso(l.completed_at) if getattr(l, "completed_at", None) else None,
                        "status": l.status,
                        "sync_number": getattr(l, "sync_number", 1),
                        "execution_time_ms": l.execution_time_ms,
                        "user_name": l.user_name,
                        "user_email": l.user_email
                    }
                    for l in recent_logs[:5]
                ]
            }
    except Exception as e:
        logger.warning(f"[CronJob] Error checking user sync quota for {user_id}: {e}")
        return {
            "user_id": user_id,
            "sync_limit": USER_DAILY_SYNC_LIMIT,
            "syncs_used_24h": 0,
            "syncs_remaining": USER_DAILY_SYNC_LIMIT,
            "is_locked": False,
            "next_sync_available_seconds": 0,
            "next_sync_available_formatted": "Available now",
            "next_sync_available_at": None,
            "last_sync_at": None,
            "recent_syncs": []
        }


async def run_statutory_sources_sync(
    trigger_type: str = "SCHEDULED_CRON",
    initiated_by: Optional[str] = None,
    user_id: Optional[str] = None,
    user_email: Optional[str] = None,
    user_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes real sources synchronization, updates persistent database,
    refreshes in-memory RAM streaming caches, and logs execution audit.
    Stores user details (user_id, user_email, user_name) for manual syncs.
    Enforces user quota: 2 manual syncs within 24 hours per signed-in user.
    """
    global _LAST_COMPLETED_TIME

    # 1. Enforce user quota if initiated by an authenticated user
    user_quota = None
    if trigger_type == "MANUAL_BUTTON" and user_id:
        user_quota = await get_user_sync_quota(user_id)
        if user_quota.get("is_locked"):
            time_formatted = user_quota.get("next_sync_available_formatted", "24 hours")
            logger.info(
                f"[CronJob] User {user_id} ({user_email}) attempted sync but reached 24h quota limit "
                f"({user_quota.get('syncs_used_24h')}/{USER_DAILY_SYNC_LIMIT}). Available again in {time_formatted}."
            )
            return {
                "status": "quota_exceeded",
                "message": (
                    f"Daily sync limit reached (2 of 2 syncs used within 24 hours). "
                    f"Next synchronization available in {time_formatted}."
                ),
                "user_id": user_id,
                "syncs_used_24h": user_quota.get("syncs_used_24h", 2),
                "sync_limit": USER_DAILY_SYNC_LIMIT,
                "syncs_remaining": 0,
                "is_locked": True,
                "is_sync_in_progress": False,
                "next_sync_available_seconds": user_quota.get("next_sync_available_seconds", 86400),
                "next_sync_available_formatted": time_formatted,
                "next_sync_available_at": user_quota.get("next_sync_available_at"),
                "last_sync_at": user_quota.get("last_sync_at"),
                "total_in_progress_tenders": LAST_CRON_RUN_INFO.get("total_in_progress_tenders", 3293),
                "timestamp": datetime.now(IST).isoformat(),
                "next_cron_run": get_next_cron_run_iso()
            }

        if user_quota.get("is_sync_in_progress"):
            logger.info(f"[CronJob] User {user_id} already has a sync actively in progress in DB.")
            return {
                "status": "in_progress",
                "message": "A synchronization is already actively in progress across real portals. Please wait a moment.",
                "is_sync_in_progress": True,
                "user_quota": user_quota,
                "total_in_progress_tenders": LAST_CRON_RUN_INFO.get("total_in_progress_tenders", 3293),
                "timestamp": datetime.now(IST).isoformat(),
                "next_cron_run": get_next_cron_run_iso()
            }

    # 2. Prevent overlapping simultaneous executions
    if SYNC_LOCK.locked():
        logger.warning(f"[CronJob] Sync already in progress (Trigger: {trigger_type}). Skipping duplicate.")
        return {
            "status": "in_progress",
            "message": "A synchronization is already actively in progress across real portals. Please wait a moment.",
            "is_sync_in_progress": True,
            "total_in_progress_tenders": LAST_CRON_RUN_INFO.get("total_in_progress_tenders", 3293),
            "timestamp": datetime.now(IST).isoformat(),
            "next_cron_run": get_next_cron_run_iso()
        }

    # 3. Cooldown debounce for anonymous/unauthenticated manual button clicks (protect government endpoints)
    now_epoch = time.time()
    if not user_id and trigger_type == "MANUAL_BUTTON" and (now_epoch - _LAST_COMPLETED_TIME) < _COOLDOWN_SECONDS:
        remaining = int(_COOLDOWN_SECONDS - (now_epoch - _LAST_COMPLETED_TIME))
        mins = remaining // 60
        secs = remaining % 60
        time_formatted = f"{mins}m {secs}s" if mins > 0 else f"{secs}s"
        logger.info(f"[CronJob] Anonymous manual sync triggered within 5-min cooldown window ({remaining}s remaining).")
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
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        display_initiator = initiated_by or (f"{user_name or 'User'} ({user_email})" if user_email else "Scheduled Cron")
        logger.info(f"[CronJob] Starting statutory sources sync (Trigger: {trigger_type}, By: {display_initiator}) at {start_dt.isoformat()}")

        LAST_CRON_RUN_INFO["status"] = "RUNNING"
        LAST_CRON_RUN_INFO["last_trigger_type"] = trigger_type
        LAST_CRON_RUN_INFO["error"] = None

        # Pre-calculate sync number and quota lock values for this run
        prior_syncs = (user_quota.get("syncs_used_24h", 0) if user_quota else 0) if (trigger_type == "MANUAL_BUTTON" and user_id) else 0
        current_sync_number = min(2, prior_syncs + 1)
        is_lock_now = (current_sync_number >= USER_DAILY_SYNC_LIMIT) if (trigger_type == "MANUAL_BUTTON" and user_id) else False
        next_avail_dt = (now_utc + timedelta(hours=24)) if is_lock_now else None
        cd_until_dt = now_utc + timedelta(seconds=_COOLDOWN_SECONDS)

        # 4. IMMEDIATELY INSERT RUNNING AUDIT LOG IN DB BEFORE SCRAPING STARTS
        running_log_id = None
        try:
            async with async_session_factory() as session:
                init_log = CronSyncLog(
                    trigger_type=trigger_type,
                    status="RUNNING",
                    sync_number=current_sync_number,
                    is_locked=is_lock_now,
                    syncs_remaining=max(0, USER_DAILY_SYNC_LIMIT - current_sync_number) if user_id else 0,
                    next_sync_available_at=next_avail_dt,
                    cooldown_until=cd_until_dt,
                    initiated_by=display_initiator,
                    user_id=user_id,
                    user_email=user_email,
                    user_name=user_name,
                    details={
                        "trigger_type": trigger_type,
                        "status": "INGESTION_RUNNING",
                        "initiated_at": start_dt.isoformat()
                    }
                )
                session.add(init_log)
                await session.commit()
                await session.refresh(init_log)
                running_log_id = init_log.id
                logger.info(f"[CronJob] Inserted initial RUNNING log (ID: {running_log_id}) for user {user_id} into DB.")
        except Exception as init_db_err:
            logger.warning(f"[CronJob] Could not insert initial RUNNING sync log: {init_db_err}")

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
            now_comp_utc = datetime.now(timezone.utc).replace(tzinfo=None)
            cd_completed_dt = now_comp_utc + timedelta(seconds=_COOLDOWN_SECONDS)

            LAST_CRON_RUN_INFO["status"] = "SUCCESS"
            LAST_CRON_RUN_INFO["last_run_time"] = start_dt.isoformat()
            LAST_CRON_RUN_INFO["execution_time_ms"] = elapsed_ms
            LAST_CRON_RUN_INFO["total_in_progress_tenders"] = total_in_prog
            LAST_CRON_RUN_INFO["db_upserted"] = db_upserted
            LAST_CRON_RUN_INFO["portals_scraped_count"] = portals_count

            # Persist / update audit record in database
            try:
                async with async_session_factory() as session:
                    if running_log_id:
                        stmt = select(CronSyncLog).where(CronSyncLog.id == running_log_id)
                        res = await session.execute(stmt)
                        existing_entry = res.scalar_one_or_none()
                        if existing_entry:
                            existing_entry.status = "SUCCESS"
                            existing_entry.portals_scraped_count = portals_count
                            existing_entry.total_in_progress_count = total_in_prog
                            existing_entry.db_upserted_count = db_upserted
                            existing_entry.execution_time_ms = elapsed_ms
                            existing_entry.completed_at = now_comp_utc
                            existing_entry.cooldown_until = cd_completed_dt
                            existing_entry.details = {
                                "portals_scraped": portals_scraped,
                                "sync_summary": sync_details.get("message", "Sync successful"),
                                "timestamp": start_dt.isoformat(),
                                "user_id": user_id,
                                "user_email": user_email,
                                "user_name": user_name
                            }
                            await session.commit()
                    else:
                        log_entry = CronSyncLog(
                            trigger_type=trigger_type,
                            status="SUCCESS",
                            sync_number=current_sync_number,
                            is_locked=is_lock_now,
                            syncs_remaining=max(0, USER_DAILY_SYNC_LIMIT - current_sync_number) if user_id else 0,
                            next_sync_available_at=next_avail_dt,
                            cooldown_until=cd_completed_dt,
                            completed_at=now_comp_utc,
                            portals_scraped_count=portals_count,
                            total_in_progress_count=total_in_prog,
                            db_upserted_count=db_upserted,
                            execution_time_ms=elapsed_ms,
                            initiated_by=display_initiator,
                            user_id=user_id,
                            user_email=user_email,
                            user_name=user_name,
                        )
                        session.add(log_entry)
                        await session.commit()
            except Exception as db_err:
                logger.warning(f"[CronJob] Could not write audit log to DB: {db_err}")

            logger.info(
                f"[CronJob] Sync SUCCESS in {elapsed_ms}ms: {total_in_prog} live notices, "
                f"{db_upserted} upserted to DB across {portals_count} portals."
            )

            # Retrieve updated user quota
            updated_quota = None
            if user_id:
                updated_quota = await get_user_sync_quota(user_id)

            return {
                "status": "success",
                "trigger_type": trigger_type,
                "execution_time_ms": elapsed_ms,
                "total_in_progress_tenders": total_in_prog,
                "db_upserted": db_upserted,
                "portals_scraped": portals_scraped,
                "cooldown_remaining_seconds": int(_COOLDOWN_SECONDS) if not user_id else 0,
                "cooldown_total_seconds": int(_COOLDOWN_SECONDS),
                "timestamp": to_utc_iso(start_dt),
                "next_cron_run": get_next_cron_run_iso(),
                "user_quota": updated_quota
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
            now_fail_utc = datetime.now(timezone.utc).replace(tzinfo=None)
            try:
                async with async_session_factory() as session:
                    if running_log_id:
                        stmt = select(CronSyncLog).where(CronSyncLog.id == running_log_id)
                        res = await session.execute(stmt)
                        existing_entry = res.scalar_one_or_none()
                        if existing_entry:
                            existing_entry.status = "FAILED"
                            existing_entry.execution_time_ms = elapsed_ms
                            existing_entry.error_message = err_msg
                            existing_entry.completed_at = now_fail_utc
                            await session.commit()
                    else:
                        log_entry = CronSyncLog(
                            trigger_type=trigger_type,
                            status="FAILED",
                            execution_time_ms=elapsed_ms,
                            initiated_by=display_initiator,
                            user_id=user_id,
                            user_email=user_email,
                            user_name=user_name,
                            error_message=err_msg,
                            completed_at=now_fail_utc
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
                "user_id": l.user_id,
                "user_email": l.user_email,
                "user_name": l.user_name,
                "details": l.details,
                "error_message": l.error_message,
                "created_at": to_utc_iso(l.created_at) if l.created_at else None
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
