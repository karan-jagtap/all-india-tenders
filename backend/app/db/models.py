"""
SQLAlchemy 2.0 ORM Models for All India Tenders Platform
Covers Sources, States, Cities, Categories, Organisations, Contractors,
Live In-Progress Tenders, Awarded Bids, and Feedback Submissions.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    String, Integer, Float, Boolean, Text, JSON, DateTime, ForeignKey, 
    Index, func
)
from app.db.base import Base, TimestampMixin

# ==============================================================================
# 1. Geographic Taxonomy: States & Cities
# ==============================================================================

class State(Base, TimestampMixin):
    __tablename__ = "states"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)  # e.g., 'maharashtra', 'delhi'
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # e.g., 'MH', 'DL'
    capital: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    region: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # 'Western', 'Northern', etc.

    cities: Mapped[List["City"]] = relationship("City", back_populates="state", cascade="all, delete-orphan")
    organisations: Mapped[List["Organisation"]] = relationship("Organisation", back_populates="state")
    tenders: Mapped[List["Tender"]] = relationship("Tender", back_populates="state_rel")


class City(Base, TimestampMixin):
    __tablename__ = "cities"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)  # slug: 'pune', 'new-delhi'
    state_id: Mapped[str] = mapped_column(String(50), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    is_capital: Mapped[bool] = mapped_column(Boolean, default=False)
    aliases: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list)

    state: Mapped["State"] = relationship("State", back_populates="cities")
    tenders: Mapped[List["Tender"]] = relationship("Tender", back_populates="city_rel")


# ==============================================================================
# 2. Procurement Portals & Real Sources Directory
# ==============================================================================

class SourcePortal(Base, TimestampMixin):
    __tablename__ = "sources"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)  # slug: 'mahatenders', 'gem', 'cppp'
    name: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    domain: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    portal_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'central', 'state', 'railways', 'defense', 'psu'
    base_url: Mapped[str] = mapped_column(String(300), nullable=False)
    scrape_endpoint: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    statutory_framework: Mapped[str] = mapped_column(String(100), default="NIC-GEP")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    total_notices_count: Mapped[int] = mapped_column(Integer, default=0)

    # Optional statutory binding for state-specific portals
    bound_state_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("states.id", ondelete="SET NULL"), nullable=True)
    default_city_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("cities.id", ondelete="SET NULL"), nullable=True)

    bound_state: Mapped[Optional["State"]] = relationship("State")
    default_city: Mapped[Optional["City"]] = relationship("City")
    tenders: Mapped[List["Tender"]] = relationship("Tender", back_populates="source_rel")


class PortalStateMapping(Base, TimestampMixin):
    """Strict statutory portal bindings (e.g. MahaTenders strictly bound to Maharashtra)."""
    __tablename__ = "portal_state_mappings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_id: Mapped[str] = mapped_column(String(80), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False, index=True)
    state_id: Mapped[str] = mapped_column(String(50), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    default_city_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("cities.id", ondelete="SET NULL"), nullable=True)
    is_strict_statutory: Mapped[bool] = mapped_column(Boolean, default=True)

    source: Mapped["SourcePortal"] = relationship("SourcePortal")
    state: Mapped["State"] = relationship("State")


# ==============================================================================
# 3. Categories & Procurement Sectors
# ==============================================================================

class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)  # slug: 'civil-infrastructure'
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    keywords: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list)
    color_badge: Mapped[str] = mapped_column(String(50), default="orange")

    organisations: Mapped[List["Organisation"]] = relationship("Organisation", back_populates="default_category")
    tenders: Mapped[List["Tender"]] = relationship("Tender", back_populates="category_rel")


# ==============================================================================
# 4. Procuring Authorities & Organisations
# ==============================================================================

class Organisation(Base, TimestampMixin):
    __tablename__ = "organisations"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)  # slug: 'nhai', 'cpwd', 'mmrda'
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True, index=True)
    code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    org_type: Mapped[str] = mapped_column(String(50), default="Central Ministry")
    parent_ministry: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    state_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("states.id", ondelete="SET NULL"), nullable=True)
    default_category_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    tender_count: Mapped[int] = mapped_column(Integer, default=0)

    state: Mapped[Optional["State"]] = relationship("State", back_populates="organisations")
    default_category: Mapped[Optional["Category"]] = relationship("Category", back_populates="organisations")
    tenders: Mapped[List["Tender"]] = relationship("Tender", back_populates="organisation_rel")


# ==============================================================================
# 5. Registered Contractors & Bidders Directory
# ==============================================================================

class Contractor(Base, TimestampMixin):
    __tablename__ = "contractors"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)  # slug: 'larsen-toubro-limited'
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    cin: Mapped[str] = mapped_column(String(50), default="Registered Enterprise")
    gstin: Mapped[str] = mapped_column(String(50), default="27AAACB0000A1Z5")
    pan: Mapped[str] = mapped_column(String(50), default="AAACB0000A")
    registered_office: Mapped[str] = mapped_column(Text, default="India")
    business_type: Mapped[str] = mapped_column(String(100), default="Public Limited Enterprise")
    contractor_class: Mapped[str] = mapped_column(String(100), default="Class 1A Super Special")
    msme_status: Mapped[str] = mapped_column(String(100), default="Non-MSME Enterprise")
    local_content_pct: Mapped[float] = mapped_column(Float, default=95.0)
    local_content_class: Mapped[str] = mapped_column(String(100), default="Class-I Local Supplier (Make in India)")
    audited_turnover_inr: Mapped[float] = mapped_column(Float, default=1500000000.0)
    solvency_certificate_inr: Mapped[float] = mapped_column(Float, default=50000000.0)
    solvency_bank: Mapped[str] = mapped_column(String(120), default="Scheduled Commercial Bank")
    ca_udin: Mapped[str] = mapped_column(String(50), default="24081924UDIN9912")
    project_lead: Mapped[str] = mapped_column(String(120), default="Chief Technical Director")
    total_contracts_won: Mapped[int] = mapped_column(Integer, default=0)
    total_awarded_value_inr: Mapped[float] = mapped_column(Float, default=0.0)
    rating_score: Mapped[float] = mapped_column(Float, default=4.9)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    contracts: Mapped[List["ContractorContract"]] = relationship("ContractorContract", back_populates="contractor", cascade="all, delete-orphan")
    states: Mapped[List["ContractorStateMapping"]] = relationship("ContractorStateMapping", back_populates="contractor", cascade="all, delete-orphan")
    categories: Mapped[List["ContractorCategoryMapping"]] = relationship("ContractorCategoryMapping", back_populates="contractor", cascade="all, delete-orphan")


class ContractorContract(Base, TimestampMixin):
    __tablename__ = "contractor_contracts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    contractor_id: Mapped[str] = mapped_column(String(100), ForeignKey("contractors.id", ondelete="CASCADE"), nullable=False, index=True)
    tender_id: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    category_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    award_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    award_date: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    contract_value_inr: Mapped[float] = mapped_column(Float, default=0.0)
    estimated_cost_inr: Mapped[float] = mapped_column(Float, default=0.0)
    discount_pct: Mapped[float] = mapped_column(Float, default=0.0)
    ranking: Mapped[str] = mapped_column(String(50), default="L1 (Awarded)")
    authority: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    portal: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    loa_number: Mapped[str] = mapped_column(String(100), default="LOA-AWARDED")
    nit_number: Mapped[str] = mapped_column(String(100), default="N/A")
    scope_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    contractor: Mapped["Contractor"] = relationship("Contractor", back_populates="contracts")


class ContractorStateMapping(Base):
    __tablename__ = "contractor_state_mappings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    contractor_id: Mapped[str] = mapped_column(String(100), ForeignKey("contractors.id", ondelete="CASCADE"), nullable=False, index=True)
    state_id: Mapped[str] = mapped_column(String(50), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)

    contractor: Mapped["Contractor"] = relationship("Contractor", back_populates="states")
    state: Mapped["State"] = relationship("State")


class ContractorCategoryMapping(Base):
    __tablename__ = "contractor_category_mappings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    contractor_id: Mapped[str] = mapped_column(String(100), ForeignKey("contractors.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id: Mapped[str] = mapped_column(String(80), ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)

    contractor: Mapped["Contractor"] = relationship("Contractor", back_populates="categories")
    category: Mapped["Category"] = relationship("Category")


# ==============================================================================
# 6. Live In-Progress Tenders
# ==============================================================================

class Tender(Base, TimestampMixin):
    __tablename__ = "tenders"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)  # e.g., 'GEM-2026-B-89104'
    nit_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    title: Mapped[str] = mapped_column(Text, nullable=False, index=True)
    source_portal_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("sources.id", ondelete="SET NULL"), nullable=True, index=True)
    source_portal: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    category_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    category: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    organisation_id: Mapped[Optional[str]] = mapped_column(String(100), ForeignKey("organisations.id", ondelete="SET NULL"), nullable=True, index=True)
    organisation: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    state_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("states.id", ondelete="SET NULL"), nullable=True, index=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    city_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("cities.id", ondelete="SET NULL"), nullable=True, index=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    estimated_cost_inr: Mapped[float] = mapped_column(Float, default=0.0)
    emd_amount_inr: Mapped[float] = mapped_column(Float, default=0.0)
    publish_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    close_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    opening_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    days_left: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(50), default="In-Progress", index=True)
    document_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    scope_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    pqc_criteria: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    raw_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    source_rel: Mapped[Optional["SourcePortal"]] = relationship("SourcePortal", back_populates="tenders")
    category_rel: Mapped[Optional["Category"]] = relationship("Category", back_populates="tenders")
    organisation_rel: Mapped[Optional["Organisation"]] = relationship("Organisation", back_populates="tenders")
    state_rel: Mapped[Optional["State"]] = relationship("State", back_populates="tenders")
    city_rel: Mapped[Optional["City"]] = relationship("City", back_populates="tenders")


# ==============================================================================
# 7. Historical Awarded Bids Archive
# ==============================================================================

class AwardedTender(Base, TimestampMixin):
    __tablename__ = "awarded_tenders"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)  # e.g., 'ACC-2025-MH-8921'
    title: Mapped[str] = mapped_column(Text, nullable=False, index=True)
    source_portal_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("sources.id", ondelete="SET NULL"), nullable=True, index=True)
    category_id: Mapped[Optional[str]] = mapped_column(String(80), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    organisation_id: Mapped[Optional[str]] = mapped_column(String(100), ForeignKey("organisations.id", ondelete="SET NULL"), nullable=True, index=True)
    state_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("states.id", ondelete="SET NULL"), nullable=True, index=True)
    year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    award_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    estimated_cost_inr: Mapped[float] = mapped_column(Float, default=0.0)
    awarded_contract_value_inr: Mapped[float] = mapped_column(Float, default=0.0)
    winning_contractor_id: Mapped[Optional[str]] = mapped_column(String(100), ForeignKey("contractors.id", ondelete="SET NULL"), nullable=True, index=True)
    quoted_discount_pct: Mapped[float] = mapped_column(Float, default=0.0)
    loa_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    raw_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)


# ==============================================================================
# 8. Feedback & Contact Inquiries
# ==============================================================================

class FeedbackSubmission(Base, TimestampMixin):
    __tablename__ = "feedback_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    subject: Mapped[str] = mapped_column(String(150), default="Feedback")
    message: Mapped[Text] = mapped_column(Text, nullable=False)
    email_recipient: Mapped[str] = mapped_column(String(150), default="kmessilj@gmail.com")
    email_status: Mapped[str] = mapped_column(String(50), default="PENDING")
    email_error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


# ==============================================================================
# 9. Cron Synchronization Audit Log
# ==============================================================================

class CronSyncLog(Base, TimestampMixin):
    __tablename__ = "cron_sync_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trigger_type: Mapped[str] = mapped_column(String(50), default="SCHEDULED_CRON")  # 'SCHEDULED_CRON' or 'MANUAL_BUTTON'
    status: Mapped[str] = mapped_column(String(50), default="SUCCESS")  # 'SUCCESS', 'FAILED', 'RUNNING'
    portals_scraped_count: Mapped[int] = mapped_column(Integer, default=0)
    total_in_progress_count: Mapped[int] = mapped_column(Integer, default=0)
    db_upserted_count: Mapped[int] = mapped_column(Integer, default=0)
    execution_time_ms: Mapped[float] = mapped_column(Float, default=0.0)
    details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

