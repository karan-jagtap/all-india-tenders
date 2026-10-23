"""
All India Tenders API Module
Exports modular sectional routers and the unified router.
"""

from app.api.routes import (
    router,
    system_router,
    current_tenders_router,
    accepted_tenders_router,
    bidders_router
)

__all__ = [
    "router",
    "system_router",
    "current_tenders_router",
    "accepted_tenders_router",
    "bidders_router"
]
