"""
Comprehensive Database Seed Pipeline for All India Tenders Platform
Ingests States, Cities, Sources, Categories, Organisations, Contractors,
Live In-Progress Tenders, and Historical Awarded Bids into the Persistent Database.
"""

import os
import re
import json
import sqlite3
import asyncio
import logging
from typing import Dict, Any, List

from sqlalchemy import select, delete, func
from app.db.session import async_session_factory, init_db, engine
from app.db.models import (
    State, City, SourcePortal, PortalStateMapping,
    Category, Organisation, Contractor, ContractorContract,
    ContractorStateMapping, ContractorCategoryMapping,
    Tender, AwardedTender, FeedbackSubmission
)
from app.services.current_tenders_service import (
    STATE_CITY_MAP, STATUTORY_PORTAL_STATE_BINDINGS,
    ALL_CURRENT_TENDERS
)
from app.services.bidders_service import build_bidders_catalog
from app.services.accepted_tenders_service import ACCEPTED_TENDERS_CATALOG
from populate_all_sources import SOURCES

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed")

def slugify(text: str) -> str:
    s = re.sub(r'[^a-zA-Z0-9]+', '-', text.strip().lower()).strip('-')
    return s[:80]

# All Indian States & UTs with standard codes & regions
ALL_INDIA_STATES = [
    {"name": "Maharashtra", "code": "MH", "capital": "Mumbai", "region": "Western"},
    {"name": "Karnataka", "code": "KA", "capital": "Bengaluru", "region": "Southern"},
    {"name": "Delhi", "code": "DL", "capital": "New Delhi", "region": "Northern"},
    {"name": "Uttar Pradesh", "code": "UP", "capital": "Lucknow", "region": "Northern"},
    {"name": "Tamil Nadu", "code": "TN", "capital": "Chennai", "region": "Southern"},
    {"name": "Gujarat", "code": "GJ", "capital": "Gandhinagar", "region": "Western"},
    {"name": "West Bengal", "code": "WB", "capital": "Kolkata", "region": "Eastern"},
    {"name": "Rajasthan", "code": "RJ", "capital": "Jaipur", "region": "Northern"},
    {"name": "Kerala", "code": "KL", "capital": "Thiruvananthapuram", "region": "Southern"},
    {"name": "Telangana", "code": "TS", "capital": "Hyderabad", "region": "Southern"},
    {"name": "Andhra Pradesh", "code": "AP", "capital": "Amaravati", "region": "Southern"},
    {"name": "Madhya Pradesh", "code": "MP", "capital": "Bhopal", "region": "Central"},
    {"name": "Punjab", "code": "PB", "capital": "Chandigarh", "region": "Northern"},
    {"name": "Haryana", "code": "HR", "capital": "Chandigarh", "region": "Northern"},
    {"name": "Odisha", "code": "OD", "capital": "Bhubaneswar", "region": "Eastern"},
    {"name": "Bihar", "code": "BR", "capital": "Patna", "region": "Eastern"},
    {"name": "Assam", "code": "AS", "capital": "Dispur", "region": "North Eastern"},
    {"name": "Jharkhand", "code": "JH", "capital": "Ranchi", "region": "Eastern"},
    {"name": "Uttarakhand", "code": "UK", "capital": "Dehradun", "region": "Northern"},
    {"name": "Himachal Pradesh", "code": "HP", "capital": "Shimla", "region": "Northern"},
    {"name": "Jammu & Kashmir", "code": "JK", "capital": "Srinagar", "region": "Northern"},
    {"name": "Goa", "code": "GA", "capital": "Panaji", "region": "Western"},
    {"name": "Chhattisgarh", "code": "CG", "capital": "Raipur", "region": "Central"},
    {"name": "Tripura", "code": "TR", "capital": "Agartala", "region": "North Eastern"},
    {"name": "Meghalaya", "code": "ML", "capital": "Shillong", "region": "North Eastern"},
    {"name": "Manipur", "code": "MN", "capital": "Imphal", "region": "North Eastern"},
    {"name": "Nagaland", "code": "NL", "capital": "Kohima", "region": "North Eastern"},
    {"name": "Mizoram", "code": "MZ", "capital": "Aizawl", "region": "North Eastern"},
    {"name": "Arunachal Pradesh", "code": "AR", "capital": "Itanagar", "region": "North Eastern"},
    {"name": "Sikkim", "code": "SK", "capital": "Gangtok", "region": "North Eastern"},
    {"name": "Chandigarh", "code": "CH", "capital": "Chandigarh", "region": "Northern"},
    {"name": "Puducherry", "code": "PY", "capital": "Puducherry", "region": "Southern"},
    {"name": "Andaman & Nicobar", "code": "AN", "capital": "Port Blair", "region": "Island"},
    {"name": "Ladakh", "code": "LA", "capital": "Leh", "region": "Northern"},
    {"name": "Dadra & Nagar Haveli and Daman & Diu", "code": "DN", "capital": "Daman", "region": "Western"},
    {"name": "Lakshadweep", "code": "LD", "capital": "Kavaratti", "region": "Island"},
    {"name": "Pan-India / Central", "code": "IN", "capital": "New Delhi", "region": "National"},
]

# Standard procurement categories
STANDARD_CATEGORIES = [
    {
        "name": "Civil & Infrastructure Works",
        "description": "Highway construction, bridges, buildings, earthworks, and structural civil projects.",
        "color_badge": "emerald",
        "keywords": ["civil", "road", "bridge", "building", "construction", "concrete", "paving"]
    },
    {
        "name": "Electrical, Power & Solar Systems",
        "description": "Substations, transmission lines, solar PV, smart metering, and electrical utilities.",
        "color_badge": "amber",
        "keywords": ["electrical", "power", "solar", "substation", "transmission", "transformer"]
    },
    {
        "name": "Water Supply, Sewerage & Irrigation",
        "description": "Water treatment plants, bulk pipelines, sewage networks, dams, and irrigation canals.",
        "color_badge": "cyan",
        "keywords": ["water", "sewerage", "pipeline", "treatment", "dam", "irrigation", "drainage"]
    },
    {
        "name": "Railway & Metro Rail Works",
        "description": "Track doubling, OHE electrification, signaling, metro viaducts, and rolling stock.",
        "color_badge": "purple",
        "keywords": ["railway", "rail", "track", "metro", "ohe", "station", "locomotive"]
    },
    {
        "name": "IT, Telecom, Software & Smart City",
        "description": "Data centers, optical fiber, ERP systems, AI/ML platforms, and smart surveillance.",
        "color_badge": "blue",
        "keywords": ["it", "software", "telecom", "fiber", "data center", "smart city", "surveillance"]
    },
    {
        "name": "Medical, Healthcare & Pharma Supplies",
        "description": "Hospital equipment, diagnostic analyzers, pharmaceutical supplies, and medical gas plants.",
        "color_badge": "rose",
        "keywords": ["medical", "health", "hospital", "pharma", "diagnostic", "medicine"]
    },
    {
        "name": "Defence, Maritime & Aerospace Procurement",
        "description": "Border surveillance, coastal radar, naval works, tactical shelters, and aerospace systems.",
        "color_badge": "indigo",
        "keywords": ["defense", "defence", "maritime", "naval", "border", "tactical", "radar"]
    },
    {
        "name": "Consultancy, PMC & Auditing Services",
        "description": "Project management consultancy (PMC), third-party quality inspection, DPR, and financial audits.",
        "color_badge": "teal",
        "keywords": ["consultancy", "pmc", "audit", "inspection", "dpr", "feasibility"]
    },
    {
        "name": "Facility Management & Operations (O&M)",
        "description": "Housekeeping, security, mechanised cleaning, MEP maintenance, and asset operation.",
        "color_badge": "slate",
        "keywords": ["facility", "housekeeping", "maintenance", "security", "operation", "o&m"]
    }
]

async def seed_states_and_cities(session) -> Dict[str, str]:
    logger.info("Seeding Indian States and Cities...")
    state_id_map = {}

    for st_data in ALL_INDIA_STATES:
        s_id = slugify(st_data["name"])
        state_id_map[st_data["name"]] = s_id
        
        state_obj = await session.get(State, s_id)
        if not state_obj:
            state_obj = State(
                id=s_id,
                name=st_data["name"],
                code=st_data.get("code"),
                capital=st_data.get("capital"),
                region=st_data.get("region"),
            )
            session.add(state_obj)

    await session.flush()

    # Seed cities from STATE_CITY_MAP
    for st_name, cities_list in STATE_CITY_MAP.items():
        s_id = state_id_map.get(st_name)
        if not s_id:
            continue
        for c_name in cities_list:
            c_id = slugify(f"{st_name}-{c_name}")
            city_obj = await session.get(City, c_id)
            if not city_obj:
                city_obj = City(
                    id=c_id,
                    state_id=s_id,
                    name=c_name,
                    is_capital=False,
                    aliases=[c_name]
                )
                session.add(city_obj)

    await session.flush()
    logger.info("States and Cities seeded.")
    return state_id_map


async def seed_sources_and_bindings(session, state_id_map: Dict[str, str]):
    logger.info("Seeding Procurement Sources & Statutory Portal Bindings...")

    for src in SOURCES:
        src_name = src.get("source_portal")
        src_id = src.get("key") or slugify(src_name)
        st_name = src.get("state", "Pan-India / Central")
        bound_s_id = state_id_map.get(st_name)

        domain = "eprocure.gov.in"
        if "(" in src_name and ")" in src_name:
            match = re.search(r'\(([^)]+)\)', src_name)
            if match:
                domain = match.group(1).strip()

        source_obj = await session.get(SourcePortal, src_id)
        if not source_obj:
            source_obj = SourcePortal(
                id=src_id,
                name=src_name,
                domain=domain,
                portal_type="state" if bound_s_id and bound_s_id != "pan-india-central" else "central",
                base_url=src.get("portal_url_base", f"https://{domain}"),
                statutory_framework="GFR 2017 / NIC-GEP" if "CPPP" in src_name or "GeM" in src_name else "State Procurement Rules / NIC-GEP",
                is_active=True,
                bound_state_id=bound_s_id,
            )
            session.add(source_obj)

    await session.flush()

    # Seed statutory portal bindings table
    for domain, (st_name, def_city) in STATUTORY_PORTAL_STATE_BINDINGS.items():
        s_id = state_id_map.get(st_name)
        if not s_id:
            continue
        # Find matching source
        stmt = select(SourcePortal).where(SourcePortal.domain.ilike(f"%{domain}%"))
        res = await session.execute(stmt)
        matched_src = res.scalar_one_or_none()
        if matched_src:
            binding_stmt = select(PortalStateMapping).where(
                PortalStateMapping.source_id == matched_src.id,
                PortalStateMapping.state_id == s_id
            )
            binding_res = await session.execute(binding_stmt)
            if not binding_res.scalar_one_or_none():
                c_id = slugify(f"{st_name}-{def_city}")
                session.add(PortalStateMapping(
                    source_id=matched_src.id,
                    state_id=s_id,
                    default_city_id=c_id,
                    is_strict_statutory=True
                ))

    await session.flush()
    logger.info("Procurement Sources and Statutory Bindings seeded.")


async def seed_categories(session) -> Dict[str, str]:
    logger.info("Seeding Procurement Categories...")
    cat_id_map = {}

    for cat in STANDARD_CATEGORIES:
        c_id = slugify(cat["name"])
        cat_id_map[cat["name"]] = c_id
        
        cat_obj = await session.get(Category, c_id)
        if not cat_obj:
            cat_obj = Category(
                id=c_id,
                name=cat["name"],
                description=cat["description"],
                keywords=cat["keywords"],
                color_badge=cat["color_badge"],
            )
            session.add(cat_obj)

    await session.flush()
    logger.info("Categories seeded.")
    return cat_id_map


async def seed_organisations(session, state_id_map: Dict[str, str], cat_id_map: Dict[str, str]):
    logger.info("Seeding Procuring Authorities & Organisations...")
    org_count = 0

    for src in SOURCES:
        st_name = src.get("state", "Pan-India / Central")
        s_id = state_id_map.get(st_name)
        orgs = src.get("orgs", [])

        for org_name in orgs:
            o_id = slugify(org_name)
            org_obj = await session.get(Organisation, o_id)
            if not org_obj:
                code_match = re.search(r'\(([^)]+)\)', org_name)
                code = code_match.group(1) if code_match else org_name[:10].upper()
                
                session.add(Organisation(
                    id=o_id,
                    name=org_name,
                    code=code,
                    org_type="State Department" if s_id and s_id != "pan-india-central" else "Central Ministry / PSU",
                    state_id=s_id,
                    tender_count=1
                ))
                org_count += 1

    await session.flush()
    logger.info(f"Seeded {org_count} Procuring Organisations.")


KNOWN_CORPORATE_TURNOVERS = {
    'larsen & toubro': 18500.0, 'l&t': 18500.0, 'tata projects': 14200.0,
    'megha engineering': 21000.0, 'meil': 21000.0, 'afcons': 11800.0,
    'dilip buildcon': 9500.0, 'ashoka buildcon': 6800.0, 'gr infraprojects': 7900.0,
    'hindustan construction': 9500.0, 'hcc': 9500.0, 'b.g. shirke': 3820.0,
    'shirke': 3820.0, 't&t infra': 1850.0, 't and t infra': 1850.0,
    'j. kumar infraprojects': 4210.0, 'knr constructions': 3900.0, 'montecarlo': 4600.0,
    'pnc infratech': 7200.0, 'irb infrastructure': 6400.0, 'itd cementation': 5400.0,
    'navayuga': 26100.0, 'shapoorji pallonji': 28200.0, 'ncc limited': 14500.0,
    'h.g. infra': 4800.0, 'ceigall': 3100.0, 'gawar construction': 4200.0,
    'patel engineering': 4200.0, 'dineshchandra': 4100.0, 'apco infratech': 4820.0,
    'va tech wabag': 2960.0, 'bhel': 23500.0, 'bharat heavy electricals': 23500.0,
    'bel': 19800.0, 'bharat electronics': 19800.0, 'power grid': 45000.0,
    'hal': 26000.0, 'hindustan aeronautics': 26000.0, 'tcs': 240000.0,
    'tata consultancy': 240000.0, 'infosys': 153000.0, 'wipro': 89000.0,
    'tech mahindra': 53000.0, 'kalpataru': 14200.0, 'kec international': 16500.0,
    'ircon': 10200.0, 'texmaco': 3400.0, 'sterling & wilson': 5200.0,
    'tata power solar': 7800.0, 'siemens': 9800.0, 'abb india': 9800.0,
    'ge precision': 7200.0, 'philips': 5800.0, 'allengers': 1450.0,
    'mindray': 1100.0, 'nbcc': 9400.0, 'ahluwalia contracts': 3410.0,
    'bridge and roof': 3200.0, 'bridge & roof': 3200.0, 'psp projects': 2100.0,
    'sp singla': 2800.0, 'bvg india': 1980.0, "capacit'e": 2011.0,
    'cherian varkey': 1026.0, 'ekk infrastructure': 1450.0, 'bscpl': 1850.0,
    'gayatri projects': 2200.0, 'gammon': 2400.0, 'punj lloyd': 3100.0,
    'sadbhav': 2800.0, 'simplex': 2900.0, 'soma enterprise': 1950.0,
    'rajdeep buildcon': 1250.0, 'rajnish infra': 980.0, 'urc construction': 1650.0,
    'odisha construction': 1100.0, 'omaxe': 1850.0, 'medha servo': 1450.0,
    'kernex': 680.0, 'marymatha': 1150.0, 'dredging corp': 1100.0,
    'adani ports': 22000.0, 'essar ports': 3200.0, 'iti limited': 1750.0,
    'hfcl': 4800.0, 'zen technologies': 890.0, 'beml': 4300.0, 'tasl': 6200.0,
}

def resolve_corporate_turnover(name: str) -> float:
    low = name.lower()
    for k, v in KNOWN_CORPORATE_TURNOVERS.items():
        if k in low:
            return v * 10000000.0
    return 2500.0 * 10000000.0


async def seed_contractors_and_contracts(session):
    logger.info("Seeding Registered Contractors & Won Contract Dossiers across 17-Year Archive...")
    await session.execute(delete(ContractorContract))
    await session.execute(delete(Contractor))
    await session.flush()

    # Load complete 17-year catalog across all sources (4,393 dossiers)
    all_accepted_list = ACCEPTED_TENDERS_CATALOG

    # Rebuild contractors map from complete 17-year archive
    companies_map = {}
    for tender in all_accepted_list:
        wc = tender.get("winning_company", {})
        name = wc.get("name")
        if not name:
            continue
        slug = slugify(name)
        if slug not in companies_map:
            corp_turnover = resolve_corporate_turnover(name)
            corp_solvency = round(corp_turnover * 0.25, 2)
            companies_map[slug] = {
                "id": slug,
                "name": name,
                "cin": wc.get("cin", "Registered Enterprise"),
                "gstin": wc.get("gstin", "27AAACB0000A1Z5"),
                "pan": wc.get("pan", "AAACB0000A"),
                "registered_office": wc.get("registered_office", "India"),
                "business_type": wc.get("business_type", "Public Limited Enterprise"),
                "contractor_class": wc.get("local_content_class", "Class 1A Super Special"),
                "msme_status": wc.get("msme_status", "Non-MSME Enterprise"),
                "local_content_pct": float(wc.get("local_content_pct", 95.0)),
                "audited_turnover_inr": corp_turnover,
                "solvency_certificate_inr": corp_solvency,
                "solvency_bank": wc.get("solvency_bank", "Scheduled Commercial Bank"),
                "ca_udin": wc.get("ca_udin", "24081924UDIN9912"),
                "project_lead": wc.get("project_lead", "Chief Technical Director"),
                "total_contracts_won": 0,
                "total_awarded_value_inr": 0.0,
                "contracts": []
            }

        bid = tender.get("bid_submission", {})
        og = tender.get("og_tender", {})
        loa = tender.get("acceptance_and_loa", {})
        quoted_amt = float(bid.get("quoted_amount_inr") or 0.0)

        companies_map[slug]["total_contracts_won"] += 1
        companies_map[slug]["total_awarded_value_inr"] += quoted_amt
        companies_map[slug]["contracts"].append({
            "tender_id": tender.get("id"),
            "title": tender.get("title"),
            "category_name": tender.get("category", "Civil & Infrastructure"),
            "award_year": int(tender.get("year", 2025)) if tender.get("year") else None,
            "award_date": str(tender.get("award_date", "")),
            "contract_value_inr": quoted_amt,
            "estimated_cost_inr": float(og.get("estimated_cost_inr", quoted_amt)),
            "discount_pct": float(bid.get("quoted_discount_pct", 0.0)),
            "ranking": bid.get("ranking", "L1 (Awarded)"),
            "authority": og.get("authority", "Government Authority"),
            "portal": og.get("portal", "Central CPPP"),
            "loa_number": loa.get("loa_number", "LOA-AWARDED"),
            "nit_number": og.get("nit_number", "N/A"),
            "scope_summary": og.get("scope_summary", tender.get("title"))
        })

    for c in companies_map.values():
        c_id = c["id"]
        contractor_obj = Contractor(
            id=c_id,
            name=c["name"],
            cin=c["cin"],
            gstin=c["gstin"],
            pan=c["pan"],
            registered_office=c["registered_office"],
            business_type=c["business_type"],
            contractor_class=c["contractor_class"],
            msme_status=c["msme_status"],
            local_content_pct=c["local_content_pct"],
            audited_turnover_inr=c["audited_turnover_inr"],
            solvency_certificate_inr=c["solvency_certificate_inr"],
            solvency_bank=c["solvency_bank"],
            ca_udin=c["ca_udin"],
            project_lead=c["project_lead"],
            total_contracts_won=c["total_contracts_won"],
            total_awarded_value_inr=c["total_awarded_value_inr"],
            rating_score=4.9,
            is_active=True
        )
        session.add(contractor_obj)
        await session.flush()

        for contract in c["contracts"]:
            session.add(ContractorContract(
                contractor_id=c_id,
                tender_id=str(contract.get("tender_id", "")),
                title=str(contract.get("title", "")),
                category_name=str(contract.get("category_name", "")),
                award_year=contract.get("award_year"),
                award_date=str(contract.get("award_date", "")),
                contract_value_inr=float(contract.get("contract_value_inr", 0.0)),
                estimated_cost_inr=float(contract.get("estimated_cost_inr", 0.0)),
                discount_pct=float(contract.get("discount_pct", 0.0)),
                ranking=str(contract.get("ranking", "L1 (Awarded)")),
                authority=str(contract.get("authority", "")),
                portal=str(contract.get("portal", "")),
                loa_number=str(contract.get("loa_number", "LOA-AWARDED")),
                nit_number=str(contract.get("nit_number", "N/A")),
                scope_summary=str(contract.get("scope_summary", ""))
            ))

    await session.flush()
    logger.info(f"Seeded {len(companies_map)} Registered Contractors and 17-year awards.")


async def seed_awarded_tenders(session):
    logger.info("Seeding Historical Awarded Tenders across 17-Year Archive (2010 - 2026)...")
    await session.execute(delete(AwardedTender))
    await session.flush()

    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "all_sources_accepted_catalog.json"))
    all_accepted_list = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            all_accepted_list = json.load(f)

    batch = []
    for t in all_accepted_list:
        t_id = t.get("id")
        if not t_id:
            continue
        wc = t.get("winning_company", {})
        bid = t.get("bid_submission", {})
        og = t.get("og_tender", {})
        loa = t.get("acceptance_and_loa", {})

        batch.append(AwardedTender(
            id=t_id,
            title=t.get("title", ""),
            source_portal_id=slugify(og.get("portal", "Central CPPP")),
            category_id=slugify(t.get("category", "Civil & Infrastructure Works")),
            organisation_id=slugify(og.get("authority", "")),
            state_id=slugify(t.get("state", "Pan-India / Central")),
            year=int(t.get("year", 2025)) if t.get("year") else 2025,
            award_date=str(t.get("award_date", "")),
            estimated_cost_inr=float(og.get("estimated_cost_inr", 0.0)),
            awarded_contract_value_inr=float(bid.get("quoted_amount_inr", 0.0)),
            winning_contractor_id=slugify(wc.get("name", "")) if wc.get("name") else None,
            quoted_discount_pct=float(bid.get("quoted_discount_pct", 0.0)),
            loa_number=str(loa.get("loa_number", "LOA-AWARDED")),
            raw_data=t
        ))

        if len(batch) >= 500:
            session.add_all(batch)
            await session.flush()
            batch = []

    if batch:
        session.add_all(batch)
        await session.flush()

    logger.info(f"Seeded {len(all_accepted_list)} Awarded Tenders across 2010 - 2026.")


async def seed_live_tenders(session):
    logger.info("Seeding Live In-Progress Tenders (2,738+ notices)...")
    batch = []

    for t in ALL_CURRENT_TENDERS:
        t_id = t.get("id")
        if not t_id:
            continue
        existing = await session.get(Tender, t_id)
        if not existing:
            batch.append(Tender(
                id=t_id,
                nit_number=t.get("nit_number"),
                title=t.get("title", ""),
                source_portal_id=slugify(t.get("source_portal", "Central CPPP")),
                source_portal=t.get("source_portal"),
                category_id=slugify(t.get("category", "Civil & Infrastructure Works")),
                category=t.get("category"),
                organisation_id=slugify(t.get("organisation", "")),
                organisation=t.get("organisation"),
                state_id=slugify(t.get("state", "Pan-India / Central")),
                state=t.get("state"),
                city_id=slugify(f"{t.get('state', '')}-{t.get('city', '')}"),
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

        if len(batch) >= 500:
            session.add_all(batch)
            await session.flush()
            batch = []

    if batch:
        session.add_all(batch)
        await session.flush()

    logger.info("Live tenders seeded.")


async def migrate_existing_feedback(session):
    """Migrates existing feedback submissions from legacy feedback.db SQLite file into the unified database."""
    legacy_db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "feedback.db"))
    if not os.path.exists(legacy_db_path):
        return

    logger.info("Migrating existing feedback submissions from legacy feedback.db...")
    try:
        conn = sqlite3.connect(legacy_db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        rows = cursor.execute("SELECT * FROM feedback_submissions").fetchall()
        for r in rows:
            sub_id = r["id"]
            existing = await session.get(FeedbackSubmission, sub_id)
            if not existing:
                session.add(FeedbackSubmission(
                    id=sub_id,
                    name=r["name"],
                    email=r["email"],
                    phone=r["phone"],
                    subject=r["subject"],
                    message=r["message"],
                    email_recipient=r["email_recipient"] or "kmessilj@gmail.com",
                    email_status=r["email_status"] or "SENT",
                    email_error=r["email_error"]
                ))
        conn.close()
        await session.flush()
        logger.info(f"Migrated {len(rows)} feedback submissions.")
    except Exception as e:
        logger.warning(f"Notice during feedback migration: {e}")


async def run_seed():
    logger.info("Initializing database...")
    await init_db()

    async with async_session_factory() as session:
        state_id_map = await seed_states_and_cities(session)
        await seed_sources_and_bindings(session, state_id_map)
        cat_id_map = await seed_categories(session)
        await seed_organisations(session, state_id_map, cat_id_map)
        await seed_contractors_and_contracts(session)
        await seed_awarded_tenders(session)
        await seed_live_tenders(session)
        await migrate_existing_feedback(session)
        await session.commit()

    logger.info("Database seeding successfully completed!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_seed())
