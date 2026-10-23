from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
from app.services.accepted_tenders_service import (
    list_accepted_tenders,
    get_accepted_tender_by_id,
    generate_accepted_bid_pdf,
    ACCEPTED_TENDERS_CATALOG
)
from app.services.current_tenders_service import (
    list_current_tenders,
    get_current_tender_by_id,
    generate_current_tender_nit_pdf,
    generate_detailed_tender_document_pdf,
    generate_boq_schedule_pdf,
    run_pure_scraping_sync,
    ALL_CURRENT_TENDERS,
    STATE_CITY_MAP
)
from app.services.bidders_service import (
    list_registered_bidders,
    get_bidder_by_slug,
    ALL_BIDDERS_CATALOG
)

router = APIRouter()

@router.get("/health")
async def health_check():
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

# =============================================================================
# PREVIOUSLY ACCEPTED TENDERS ENDPOINTS
# =============================================================================

@router.get("/accepted-tenders")
async def get_accepted_tenders(
    category: Optional[str] = Query(None, description="Tender category filter"),
    year: Optional[int] = Query(None, description="Tender year filter")
):
    """
    Returns all previously awarded tenders and winning bid dossiers.
    """
    tenders = list_accepted_tenders(category=category, year=year)
    return JSONResponse(
        content=tenders,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )

@router.get("/accepted-tenders/{tender_id}")
async def get_single_accepted_tender(tender_id: str):
    """
    Returns full details for a specific awarded tender dossier.
    """
    tender = get_accepted_tender_by_id(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Accepted tender not found")
    return tender

@router.get("/accepted-tenders/{tender_id}/pdf")
async def get_accepted_tender_pdf(tender_id: str):
    """
    Generates and streams an official multi-page PDF dossier of the
    awarded tender and winning bid submission via ReportLab (0 disk footprint).
    """
    tender = get_accepted_tender_by_id(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Accepted tender not found")

    pdf_bytes = generate_accepted_bid_pdf(tender)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={tender_id}_awarded_dossier.pdf",
            "Cache-Control": "max-age=3600"
        }
    )

# =============================================================================
# CURRENT TENDERS ENDPOINTS
# =============================================================================

@router.get("/current-tenders")
async def get_current_tenders(
    source_portal: Optional[str] = Query(None, description="Filter by portal name or ALL"),
    organization: Optional[str] = Query(None, description="Filter by procuring authority"),
    state: Optional[str] = Query(None, description="Filter by Indian State/Territory"),
    city: Optional[str] = Query(None, description="Filter by City"),
    category: Optional[str] = Query(None, description="Filter by Category"),
    search: Optional[str] = Query(None, description="Keyword search in title, authority, ref no, location"),
    min_cost: Optional[float] = Query(None, description="Minimum estimated cost in INR"),
    max_cost: Optional[float] = Query(None, description="Maximum estimated cost in INR")
):
    """
    Returns live, active tenders currently open for bid submission across Indian portals.
    """
    tenders = list_current_tenders(
        source_portal=source_portal,
        organization=organization,
        state=state,
        city=city,
        category=category,
        search=search,
        min_cost=min_cost,
        max_cost=max_cost
    )
    return JSONResponse(
        content=tenders,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        }
    )

@router.get("/current-tenders/{tender_id}")
async def get_single_current_tender(tender_id: str):
    """
    Returns single live active tender notice details.
    """
    tender = get_current_tender_by_id(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Current tender not found")
    return tender

@router.get("/current-tenders/{tender_id}/pdf")
async def get_current_tender_nit_pdf(tender_id: str):
    """
    Generates and streams an official Notice Inviting Tender (NIT) summary sheet PDF
    via ReportLab in memory with 0 disk footprint.
    """
    tender = get_current_tender_by_id(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Current tender not found")

    pdf_bytes = generate_current_tender_nit_pdf(tender)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={tender_id}_NIT_notice.pdf",
            "Cache-Control": "max-age=3600"
        }
    )

@router.get("/current-tenders/{tender_id}/tender-document")
@router.get("/current-tenders/{tender_id}/whole-document")
@router.head("/current-tenders/{tender_id}/tender-document")
@router.head("/current-tenders/{tender_id}/whole-document")
async def get_current_tender_detailed_sbd_pdf(tender_id: str):
    """
    Generates and streams the official Detailed Tender Document (Standard Bidding Document / SBD / RFP)
    via ReportLab in memory with 0 disk footprint.
    """
    tender = get_current_tender_by_id(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Current tender not found")

    pdf_bytes = generate_detailed_tender_document_pdf(tender)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={tender_id}_Detailed_Tender_Document_SBD.pdf",
            "Cache-Control": "max-age=3600"
        }
    )

@router.get("/current-tenders/{tender_id}/boq-pdf")
async def get_current_tender_boq_pdf(tender_id: str):
    """
    Generates and streams the official Bill of Quantities (BOQ / Schedule of Rates) PDF
    via ReportLab in memory with 0 disk footprint.
    """
    tender = get_current_tender_by_id(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Current tender not found")

    pdf_bytes = generate_boq_schedule_pdf(tender)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={tender_id}_BOQ_Schedule.pdf",
            "Cache-Control": "max-age=3600"
        }
    )

# =============================================================================
# REGISTERED BIDDERS & CONTRACTOR PROFILES ENDPOINTS
# =============================================================================

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
