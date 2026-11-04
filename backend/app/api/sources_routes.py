"""
Procurement Sources, Portals & Taxonomy API Routes
Serves real portal links, states, cities, categories, organisations, and statutory bindings from the persistent database.
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy import select
from app.db.session import async_session_factory
from app.db.models import (
    SourcePortal, State, City, Category, Organisation, PortalStateMapping,
    PortalSourceRecord, AppConstant
)

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


@router.get("/directory")
async def list_portal_sources_directory():
    """
    Returns full metadata for the 37 official statutory procurement portals
    from the persistent DB (sources directory with descriptions, key authorities, and frameworks).
    """
    async with async_session_factory() as session:
        stmt = select(PortalSourceRecord).order_by(PortalSourceRecord.id.asc())
        res = await session.execute(stmt)
        records = res.scalars().all()

        return JSONResponse(content=[
            {
                "id": p.id,
                "name": p.name,
                "domain": p.domain,
                "url": p.url,
                "category": p.category,
                "state": p.state,
                "region": p.region,
                "description": p.description,
                "keyAuthorities": p.key_authorities or [],
                "procurementTypes": p.procurement_types or [],
                "statutoryFramework": p.statutory_framework,
                "status": p.status,
                "activeCountEstimate": p.active_count_estimate
            }
            for p in records
        ])


@router.get("/statutory-map")
async def get_statutory_portal_mappings():
    """
    Returns statutory portal-to-state bindings and canonical portals list from DB.
    """
    async with async_session_factory() as session:
        stmt_map = select(AppConstant).where(AppConstant.key == "statutory_portal_to_state_map")
        res_map = await session.execute(stmt_map)
        row_map = res_map.scalar_one_or_none()

        stmt_list = select(AppConstant).where(AppConstant.key == "all_statutory_portal_sources")
        res_list = await session.execute(stmt_list)
        row_list = res_list.scalar_one_or_none()

        return JSONResponse(content={
            "portalToStateMap": row_map.data if row_map else {},
            "allPortals": row_list.data if row_list else []
        })


@router.get("/master-filters")
async def get_master_filters():
    """
    Returns canonical categories, states, organisations, and state-city hierarchies from DB.
    """
    async with async_session_factory() as session:
        stmt = select(AppConstant).where(AppConstant.key == "master_filters")
        res = await session.execute(stmt)
        row = res.scalar_one_or_none()
        if not row:
            raise HTTPException(status_code=404, detail="Master filters taxonomy constant not found in DB")
        return JSONResponse(content=row.data)


@router.get("/ui-filters")
async def get_ui_filter_options():
    """
    Returns UI value range options, quick sector chips, and portal pills from DB.
    """
    async with async_session_factory() as session:
        stmt = select(AppConstant).where(AppConstant.key == "ui_filters")
        res = await session.execute(stmt)
        row = res.scalar_one_or_none()
        if not row:
            raise HTTPException(status_code=404, detail="UI filter options constant not found in DB")
        return JSONResponse(content=row.data)


@router.get("/constants/{key}")
async def get_app_constant(key: str):
    """
    Returns arbitrary app constant JSON by key from DB.
    """
    async with async_session_factory() as session:
        stmt = select(AppConstant).where(AppConstant.key == key)
        res = await session.execute(stmt)
        row = res.scalar_one_or_none()
        if not row:
            raise HTTPException(status_code=404, detail=f"Constant '{key}' not found in DB")
        return JSONResponse(content=row.data)
