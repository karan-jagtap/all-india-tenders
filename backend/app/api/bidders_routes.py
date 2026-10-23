"""
Registered Bidders & Contractor Profiles API Routes
Handles contractor profiles, statutory classifications, audited financials, and awarded contracts.
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional
from app.services.bidders_service import (
    list_registered_bidders,
    get_bidder_by_slug
)

router = APIRouter(tags=["Registered Bidders"])


@router.get("/bidders")
async def get_bidders(
    search: Optional[str] = Query(None, description="Search by contractor name, CIN, GSTIN, PAN, address"),
    category: Optional[str] = Query(None, description="Core category specialization filter"),
    state: Optional[str] = Query(None, description="Home state filter"),
    sort_by: Optional[str] = Query("NAME_ASC", description="Sort order: NAME_ASC (default alphabetical), CONTRACTS_DESC, VALUE_DESC, TURNOVER_DESC")
):
    """
    Returns verified registered Indian contractors, their statutory classifications,
    audited financial capacities, and portfolio of public contracts won till date.
    Defaults to sorting ALPHABETICALLY (A–Z).
    """
    bidders = list_registered_bidders(search=search, category=category, state=state, sort_by=sort_by)
    return JSONResponse(
        content=bidders,
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
