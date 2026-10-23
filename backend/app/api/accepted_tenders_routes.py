"""
Previously Accepted Tenders API Routes
Handles awarded tender contracts, winning contractor dossiers, and LOA bid PDFs.
"""

from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import JSONResponse
from typing import Optional
from app.services.accepted_tenders_service import (
    list_accepted_tenders,
    get_accepted_tender_by_id,
    generate_accepted_bid_pdf
)

router = APIRouter(tags=["Accepted Tenders"])


@router.get("/accepted-tenders")
async def get_accepted_tenders(
    category: Optional[str] = Query(None, description="Tender category filter"),
    year: Optional[int] = Query(None, description="Tender year filter"),
    source_portal: Optional[str] = Query(None, description="Procurement portal filter"),
    organization: Optional[str] = Query(None, description="Procuring authority filter"),
    state: Optional[str] = Query(None, description="State / geography filter"),
    city: Optional[str] = Query(None, description="City / municipal district filter"),
    search: Optional[str] = Query(None, description="Full-text keyword search")
):
    """
    Returns all previously awarded tenders and winning bid dossiers with optional multi-dimensional filtering.
    """
    tenders = list_accepted_tenders(
        category=category,
        year=year,
        source_portal=source_portal,
        organization=organization,
        state=state,
        city=city,
        search=search
    )
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
