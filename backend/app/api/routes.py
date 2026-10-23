"""
API Routers Aggregator
Aggregates modular sectional routers:
- System & Platform (health, live scraper, stats)
- Current Tenders (in-progress notices, PDFs, BOQ, SBD)
- Accepted Tenders (awarded contracts, dossiers, PDFs)
- Registered Bidders (contractors, financials, profiles)
"""

from fastapi import APIRouter
from app.api.system_routes import router as system_router
from app.api.current_tenders_routes import router as current_tenders_router
from app.api.accepted_tenders_routes import router as accepted_tenders_router
from app.api.bidders_routes import router as bidders_router

# Unified APIRouter combining all sectional routers
router = APIRouter()
router.include_router(system_router)
router.include_router(current_tenders_router)
router.include_router(accepted_tenders_router)
router.include_router(bidders_router)

__all__ = [
    "router",
    "system_router",
    "current_tenders_router",
    "accepted_tenders_router",
    "bidders_router"
]
