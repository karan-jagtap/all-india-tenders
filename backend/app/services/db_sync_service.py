"""
Database Synchronization & Scraping Pipeline Service
Orchestrates live scraping across CPPP, GeM, MahaTenders, and state portals,
upserting live notices into the persistent database and updating the in-memory RAM stream.
"""

import logging
from typing import Dict, Any, List
from sqlalchemy import select, update
from app.db.session import async_session_factory
from app.db.models import Tender, SourcePortal
from app.services.current_tenders_service import run_pure_scraping_sync, ALL_CURRENT_TENDERS
from app.services.gem_service import fetch_live_gem_bids

logger = logging.getLogger("db_sync")

async def sync_scraped_data_to_db() -> Dict[str, Any]:
    """
    Executes live scraping sync across statutory portals (CPPP, GeM, etc.),
    upserts newly retrieved notices into the database, and refreshes the RAM cache.
    """
    logger.info("[DBSync] Initiating live scraper sync...")
    
    # 1. Run statutory scraping sync (in-memory)
    sync_result = run_pure_scraping_sync()
    logger.info(f"[DBSync] Ingestion complete. In-memory count: {len(ALL_CURRENT_TENDERS)}")

    # 2. Persist to Database
    db_upserted = 0
    async with async_session_factory() as session:
        for t in ALL_CURRENT_TENDERS:
            t_id = t.get("id")
            if not t_id:
                continue

            existing = await session.get(Tender, t_id)
            if existing:
                # Update dynamic fields
                existing.days_left = int(t.get("days_left", 0))
                existing.status = str(t.get("status", "In-Progress"))
                existing.close_date = str(t.get("close_date", ""))
            else:
                session.add(Tender(
                    id=t_id,
                    nit_number=t.get("nit_number"),
                    title=t.get("title", ""),
                    source_portal_id=t.get("source_portal", "Central CPPP").lower().replace(" ", "-")[:80],
                    source_portal=t.get("source_portal"),
                    category_id=t.get("category", "Civil & Infrastructure Works").lower().replace(" ", "-")[:80],
                    category=t.get("category"),
                    organisation_id=t.get("organisation", "").lower().replace(" ", "-")[:100],
                    organisation=t.get("organisation"),
                    state_id=t.get("state", "Pan-India / Central").lower().replace(" ", "-")[:50],
                    state=t.get("state"),
                    city_id=f"{t.get('state', '')}-{t.get('city', '')}".lower().replace(" ", "-")[:80],
                    city=t.get("city"),
                    estimated_cost_inr=float(t.get("estimated_cost_inr", 0.0)),
                    emd_amount_inr=float(t.get("emd_amount_inr", 0.0)),
                    publish_date=str(t.get("publish_date", "")),
                    close_date=str(t.get("close_date", "")),
                    opening_date=str(t.get("opening_date", "")),
                    days_left=int(t.get("days_left", 0)),
                    status=str(t.get("status", "In-Progress")),
                    document_url=str(t.get("document_url", "")),
                    scope_summary=str(t.get("scope_summary", "")),
                    pqc_criteria=t.get("pqc_criteria"),
                    raw_data=t
                ))
                db_upserted += 1

        await session.commit()

    logger.info(f"[DBSync] Database sync complete. Upserted {db_upserted} notices.")
    return {
        "status": "success",
        "total_in_memory": len(ALL_CURRENT_TENDERS),
        "db_upserted": db_upserted,
        "sync_details": sync_result
    }
