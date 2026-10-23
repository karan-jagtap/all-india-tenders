"""
Current / In-Progress Tenders API Routes
Handles live active notices, dynamic PDF notices, SBD tender dossiers, and BOQ schedules.
"""

from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import JSONResponse
from typing import Optional
from app.services.current_tenders_service import (
    list_current_tenders,
    get_current_tender_by_id,
    generate_current_tender_nit_pdf,
    generate_detailed_tender_document_pdf,
    generate_boq_schedule_pdf
)

router = APIRouter(tags=["Current Tenders"])


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
