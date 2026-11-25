"""
Registered Bidders & Contractor Profiles API Routes
Handles contractor profiles, statutory classifications, audited financials, and awarded contracts.
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional
from app.services.bidders_service import (
    list_registered_bidders,
    get_bidder_by_slug,
    get_contractor_pools_from_db,
    get_bidder_filters
)

router = APIRouter(tags=["Registered Bidders"])


@router.get("/contractors/pools")
@router.get("/bidders/pools")
async def get_contractor_pools(
    category: Optional[str] = Query(None, description="Optional category filter (e.g., 'Civil & Infrastructure')")
):
    """
    Returns verified category-indexed contractor pools sourced directly from the database.
    Used for pre-bid simulation, competitive evaluations, and peer contractor benchmarking.
    """
    pools = get_contractor_pools_from_db(category=category)
    return JSONResponse(
        content=pools,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )


@router.get("/bidders")
async def get_bidders(
    search: Optional[str] = Query(None, description="Search by contractor name, CIN, GSTIN, PAN, address"),
    category: Optional[str] = Query(None, description="Core category specialization filter"),
    state: Optional[str] = Query(None, description="Home state filter"),
    sort_by: Optional[str] = Query("NAME_ASC", description="Sort order: NAME_ASC (default alphabetical), CONTRACTS_DESC, VALUE_DESC, TURNOVER_DESC"),
    limit: Optional[int] = Query(None, ge=1, le=5000, description="Max records to return for pagination"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
):
    """
    Returns verified registered Indian contractors, their statutory classifications,
    audited financial capacities, and portfolio of public contracts won till date.
    Supports server-side pagination with limit and offset.
    Defaults to sorting ALPHABETICALLY (A–Z).
    """
    bidders, total_count = list_registered_bidders(
        search=search,
        category=category,
        state=state,
        sort_by=sort_by,
        limit=limit,
        offset=offset
    )
    return JSONResponse(
        content=bidders,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "X-Total-Count": str(total_count),
            "Access-Control-Expose-Headers": "X-Total-Count, Content-Length"
        }
    )


@router.get("/bidders/filters")
async def get_bidders_filter_metadata():
    """
    Returns aggregated metadata for bidder categories and states with accurate counts across all registered contractors.
    """
    filters_meta = get_bidder_filters()
    return JSONResponse(
        content=filters_meta,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )


@router.get("/bidders/{bidder_slug}")
async def get_single_bidder(bidder_slug: str):
    """
    Returns complete profile dossier of a specific registered contractor.
    """
    bidder = get_bidder_by_slug(bidder_slug)
    if not bidder:
        raise HTTPException(status_code=404, detail="Registered contractor profile not found")
    return JSONResponse(
        content=bidder,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )


@router.post("/bidders/seed-mca")
async def trigger_mca_seed():
    """
    Ingests authentic, verified Indian contractor enterprises from Ministry of Corporate Affairs (MCA21)
    registers into the PostgreSQL database.
    """
    from app.services.mca_ingestion_service import seed_mca_contractors
    from app.services.bidders_service import refresh_bidders_catalog

    synced = seed_mca_contractors(upsert=True)
    refresh_bidders_catalog()

    return JSONResponse(
        content={
            "status": "success",
            "message": f"Successfully ingested {synced} authentic MCA21 contractor enterprises.",
            "synced_count": synced
        }
    )


@router.post("/bidders/sync-awards")
async def trigger_awards_harvest():
    """
    Dynamically harvests winning contractors, LOAs, contract values, and award dates directly
    from public procurement notices and continuously grows the PostgreSQL contractors database.
    """
    from app.services.aoc_ingestion_service import dynamic_harvest_all_catalog_awards

    result = dynamic_harvest_all_catalog_awards()
    return JSONResponse(content=result)

