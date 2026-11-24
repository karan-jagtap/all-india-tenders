"""
Database Synchronization & Scraping Pipeline Service
Orchestrates live scraping across CPPP, GeM, MahaTenders, and state portals,
upserting live notices into the persistent database and updating the in-memory RAM stream.
"""

import asyncio
import logging
from typing import Dict, Any, List
import app.services.current_tenders_service as cts
from app.services.current_tenders_service import run_pure_scraping_sync

logger = logging.getLogger("db_sync")

async def sync_scraped_data_to_db() -> Dict[str, Any]:
    """
    Executes live scraping sync across statutory portals (CPPP, GeM, etc.) in a background thread,
    upserts newly retrieved notices directly into the persistent database, and refreshes the RAM cache.
    Non-blocking to ensure API routes (like user quota checks) respond immediately.
    """
    logger.info("[DBSync] Initiating live scraper sync...")
    
    # 1. Run statutory scraping sync non-blocking in worker thread
    sync_result = await asyncio.to_thread(run_pure_scraping_sync)
    all_tenders = cts.ALL_CURRENT_TENDERS
    new_count = sync_result.get("new_tenders_found", 0) if isinstance(sync_result, dict) else 0
    logger.info(f"[DBSync] Ingestion complete. In-memory count: {len(all_tenders)}, new upserted: {new_count}")

    return {
        "status": "success",
        "total_in_memory": len(all_tenders),
        "db_upserted": new_count,
        "sync_details": sync_result
    }
