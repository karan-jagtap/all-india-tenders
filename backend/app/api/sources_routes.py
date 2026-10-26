"""
Procurement Sources, Portals & Taxonomy API Routes
Serves real portal links, states, cities, categories, organisations, and statutory bindings from the persistent database.
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy import select
from app.db.session import async_session_factory
from app.db.models import SourcePortal, State, City, Category, Organisation, PortalStateMapping

router = APIRouter(prefix="/sources", tags=["Sources & Taxonomy"])


@router.get("")
@router.get("/")
async def list_sources():
    """
    Returns verified statutory procurement portals across India with real URLs, domains, and frameworks.
    """
    async with async_session_factory() as session:
        stmt = select(SourcePortal).where(SourcePortal.is_active == True).order_by(SourcePortal.name.asc())
        res = await session.execute(stmt)
        sources = res.scalars().all()

        return JSONResponse(content={
            "total": len(sources),
            "sources": [
                {
                    "id": s.id,
                    "name": s.name,
                    "domain": s.domain,
                    "portal_type": s.portal_type,
                    "base_url": s.base_url,
                    "statutory_framework": s.statutory_framework,
                    "total_notices_count": s.total_notices_count
                }
                for s in sources
            ]
        })


@router.get("/states")
async def list_states():
    """Returns all 36 Indian States and Union Territories with canonical codes and regions."""
    async with async_session_factory() as session:
        stmt = select(State).order_by(State.name.asc())
        res = await session.execute(stmt)
        states = res.scalars().all()

        return JSONResponse(content={
            "total": len(states),
            "states": [
                {
                    "id": s.id,
                    "name": s.name,
                    "code": s.code,
                    "capital": s.capital,
                    "region": s.region
                }
                for s in states
            ]
        })


@router.get("/categories")
async def list_categories():
    """Returns all standardized procurement sectors and categories."""
    async with async_session_factory() as session:
        stmt = select(Category).order_by(Category.name.asc())
        res = await session.execute(stmt)
        cats = res.scalars().all()

        return JSONResponse(content={
            "total": len(cats),
            "categories": [
                {
                    "id": c.id,
                    "name": c.name,
                    "description": c.description,
                    "keywords": c.keywords,
                    "color_badge": c.color_badge
                }
                for c in cats
            ]
        })


@router.get("/organisations")
async def list_organisations(limit: int = Query(200, ge=1, le=500)):
    """Returns procuring departments, authorities, PSUs, and central ministries."""
    async with async_session_factory() as session:
        stmt = select(Organisation).order_by(Organisation.name.asc()).limit(limit)
        res = await session.execute(stmt)
        orgs = res.scalars().all()

        return JSONResponse(content={
            "total": len(orgs),
            "organisations": [
                {
                    "id": o.id,
                    "name": o.name,
                    "code": o.code,
                    "org_type": o.org_type,
                    "tender_count": o.tender_count
                }
                for o in orgs
            ]
        })


@router.get("/bindings")
async def list_statutory_bindings():
    """Returns sovereign statutory portal-to-state bindings (e.g., MahaTenders -> Maharashtra)."""
    async with async_session_factory() as session:
        stmt = select(PortalStateMapping).order_by(PortalStateMapping.id.asc())
        res = await session.execute(stmt)
        bindings = res.scalars().all()

        return JSONResponse(content={
            "total": len(bindings),
            "bindings": [
                {
                    "source_id": b.source_id,
                    "state_id": b.state_id,
                    "default_city_id": b.default_city_id,
                    "is_strict_statutory": b.is_strict_statutory
                }
                for b in bindings
            ]
        })
