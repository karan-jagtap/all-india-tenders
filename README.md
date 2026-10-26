# 🇮🇳 All India Tenders (AIT)
### National Public Procurement Intelligence Platform • Enterprise Hybrid Architecture (PostgreSQL + pgvector + RAM Stream)

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pgvector](https://img.shields.io/badge/Vector_DB-pgvector_Ready-blueviolet?style=flat-square)](https://github.com/pgvector/pgvector)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy_2.0-D71F00?style=flat-square)](https://www.sqlalchemy.org/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Architecture](https://img.shields.io/badge/Architecture-Enterprise_Hybrid_Persistent_DB-FF6F00?style=flat-square)](#architecture--data-flow)

---

## 🏛️ Overview

**All India Tenders** is an autonomous, real-time public procurement intelligence platform aggregating live in-progress tenders, 10-year awarded bid archives, and contractor intelligence directly from **28+ official Central and State government portals (51 monitored endpoints)** across India.

Engineered with an **Enterprise Hybrid Database Architecture**, the platform combines a persistent **PostgreSQL 16 relational database with `pgvector`** (with seamless zero-config local SQLite fallback) and a sub-millisecond in-memory RAM streaming cache. All statutory procurement sources, sovereign states, canonical cities, categories, procuring authorities, and verified contractor intelligence are stored persistently and indexed for instant multi-faceted filtering and vector-powered RAG document search.

---

## ⚡ Core Capabilities

### 1. 🌐 Persistent Statutory Sourced Portals Directory
- Aggregates statutory notices from **28+ official government platforms**:
  - **Central Portals:** Central CPPP (`eprocure.gov.in`), Government e-Marketplace (`gem.gov.in`), IREPS Railways (`ireps.gov.in`), CPWD TenderWizard (`tenderwizard.com/CPWD`), Defense Procurement Portal (`defproc.gov.in`), Oil & Gas e-Procurement (`iocletenders.nic.in`), Open Government Data (`data.gov.in`), Delhi e-Procure / DMRC (`govtprocurement.delhi.gov.in`).
  - **State Sovereign Portals:** MahaTenders (Maharashtra), Karnataka KPPP, Tamil Nadu (`tntenders.gov.in`), Gujarat (n)Procure, UP e-Procure (`etender.up.nic.in`), Kerala (`etenders.kerala.gov.in`), Telangana, Andhra Pradesh, West Bengal, Rajasthan, Madhya Pradesh, Bihar, Punjab, Haryana, Odisha, Assam, Uttarakhand, J&K, Himachal, Goa, and Jharkhand.
- **Strict Sovereign State Bindings (`portal_state_mappings`):** Enforces statutory isolation via database constraints so state-specific portals (e.g. MahaTenders $\rightarrow$ Maharashtra only, UP e-Procure $\rightarrow$ Uttar Pradesh only) never emit cross-state or Pan-India notices.
- **Unified Sourced Directory:** Identical canonical sources directory shared across In-Progress and Previously Accepted tabs.

### 2. ⚡ Live In-Progress Tenders
- Real-time statutory ingestion of unfilled notices across India.
- **Whole Tender Document Viewer:** Embedded full-screen, 48-page Standard Bidding Document (SBD / RFP) interactive viewer with Volume I–IV breakdowns (NIT, GCC, Technical Specifications, and BOQ Rate Schedules).
- **1-Click PDF Downloads:** One-click download of the complete SBD RFP document directly on every tender card and dossier header.
- **Direct GeM Integration:** Real-time GeM BidPlus ingestion with `⚡ GeM Portal` badges and direct official SBD document downloads.
- **Automated PQC Evaluation:** Real-time checking of 3-2-1 similar work experience criteria, minimum average annual turnover (MAAT), net worth, and bid capacity.
- **GFR Rule 170 / MSME Exemptions:** Immediate verification of Earnest Money Deposit (EMD) waivers and turnover exemptions for registered MSMEs/startups.
- **Right Overlapping Filter Drawer:** Comprehensive 6-dimension sidebar filtering with Work Category / Sector and Procurement Portal at the top.

### 3. 🏆 10-Year Awarded Bids Archive (2017 – 2026)
- **2,602 Historical Awarded Dossiers:** Complete archive of awarded public contracts persisted in `awarded_tenders`.
- **Winning Contractor Quotes vs Estimates:** Exact percentage rebate (% below/above estimated cost).
- **3-Cover Submissions Breakdown:** Fee/EMD Cover, Technical Experience Cover, and Financial Price Bid.
- **Official Letters of Acceptance (LOA):** Work order numbers, bank guarantee mandates, and delivery milestones.

### 4. 👥 Registered Contractors Directory & Intelligence
- Verified directory of **87 infrastructure and EPC contractors** (L&T, Tata Projects, Afcons, NCC, Dilip Buildcon, B.G. Shirke, T&T Infra, PSP Projects, Ahluwalia Contracts, etc.).
- **Audited Financial Metrics:** 3-year turnover, net worth, active work-in-hand, and max single-bid capacity stored in `contractors`.
- Track past awards, sector specializations (Highways, Bridges, Rail/Metro, Water & Sanitation, Buildings), and Joint Venture (JV) compatibility.

### 5. 📬 Persistent Feedback & Contact Us System
- Responsive contact & feedback desk on the landing page (`#feedback-contact-section`).
- Submissions persisted in `feedback_submissions` and dispatched via authenticated SMTP TLS directly to `kmessilj@gmail.com`.

### 6. 🤖 Vector Database & Deep RAG Readiness (`pgvector`)
- Integrated with PostgreSQL `pgvector` (`Vector(384)` / `Vector(768)`).
- Pre-configured for semantic clause-by-clause query engines across dense Standard Bidding Documents (liquidated damages, price escalation, defect liability period).

---

## 🛠️ Architecture & Data Flow

```
[28+ Official Portals] (CPPP, MahaTenders, GeM, IREPS, CPWD, States)
               │
               ▼  (HTTP / Statutory Scraping & Open Data Feeds)
┌───────────────────────────────────────────────────────────────┐
│               Scraping & Database Ingestion Engine             │
│  - db_sync_service.py • gem_service.py • seed.py             │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│     Persistent Database Layer (PostgreSQL 16 + pgvector)      │
│  - sources, states, cities, categories, organisations        │
│  - contractors (87 bidders), contractor_contracts (2,602)     │
│  - tenders (2,738 live), awarded_tenders (2,602 historical)   │
│  - portal_state_mappings (Statutory Sovereign Isolation)      │
│  - feedback_submissions (Persisted Inquiries & Audit Log)    │
│  - Vector Embeddings Store (pgvector HNSW / IVFFlat Indexes)  │
│  * Dual-mode engine: Automatic SQLite fallback for local dev  │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼  (Hydrates Cache on Boot & Sync)
┌───────────────────────────────────────────────────────────────┐
│                    FastAPI Backend Server                     │
│  - Sub-Millisecond In-Memory RAM Streaming Cache              │
│  - RapidFuzz & Multi-Faceted Matchers (<15ms response)        │
│  - ReportLab PDF Streaming (SBD 48-page RFP, NIT, BOQs)       │
│  - Automated SMTP Email Dispatch (kmessilj@gmail.com)         │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼  (REST / JSON API)
┌───────────────────────────────────────────────────────────────┐
│                    Vite + React Frontend                      │
│  - Home Screen & Statutory Portals Directory                  │
│  - In-Progress Tenders with Right Drawer Filters              │
│  - Whole Tender Document In-App Viewer & One-Click PDF DL     │
│  - Awarded Bids Archive & Registered Contractors Dossiers     │
│  - Feedback / Contact Us Form                                 │
└───────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schemas & Entities

| Entity / Table | Purpose | Primary Keys & Foreign Keys |
| :--- | :--- | :--- |
| **`sources`** | Real government portals, domains, links, and statutory frameworks | `id` (slug), `bound_state_id` $\rightarrow$ `states.id` |
| **`states`** | 36 Indian States and Union Territories with codes and regions | `id` (slug, e.g. `maharashtra`, `karnataka`) |
| **`cities`** | 170+ canonical procurement cities and alias matching arrays | `id`, `state_id` $\rightarrow$ `states.id` |
| **`portal_state_mappings`** | Enforces sovereign statutory portal boundaries | `source_id` $\rightarrow$ `sources.id`, `state_id` $\rightarrow$ `states.id` |
| **`categories`** | Standard procurement sectors, descriptions, and color badges | `id` (slug, e.g. `civil-infrastructure`) |
| **`organisations`** | Procuring departments, central ministries, and PSUs | `id`, `state_id` $\rightarrow$ `states.id`, `category_id` $\rightarrow$ `categories.id` |
| **`contractors`** | 87 registered contractors with audited financials, solvency, & PAN | `id` (slug, e.g. `larsen-toubro-limited`) |
| **`contractor_contracts`** | Complete award history and won contract portfolios | `contractor_id` $\rightarrow$ `contractors.id` |
| **`tenders`** | Live active in-progress notices with PQC criteria and closing dates | `id`, `source_portal_id` $\rightarrow$ `sources.id`, `state_id` $\rightarrow$ `states.id` |
| **`awarded_tenders`** | 2,602 multi-year historical awarded bid dossiers | `id`, `winning_contractor_id` $\rightarrow$ `contractors.id` |
| **`feedback_submissions`** | User feedback, inquiries, and email dispatch audit status | `id` (autoincrement) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**
- *(Optional)* **Docker & Docker Compose** for running PostgreSQL + pgvector

---

### Option A: Run with PostgreSQL + pgvector (Recommended for Production)

1. **Launch PostgreSQL with pgvector**:
   ```bash
   docker compose up -d
   ```
2. **Configure `.env`**:
   ```bash
   # In backend/.env:
   DATABASE_URL=postgresql+asyncpg://postgres:postgrespassword@localhost:5432/all_india_tenders
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   ```
3. **Seed Database**:
   ```bash
   cd backend
   python -m app.db.seed
   ```

---

### Option B: Zero-Config Local Setup (Uses Automatic SQLite Fallback)

1. **Start the Backend API**:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python -m app.db.seed
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   > The API will be available at `http://localhost:8000`. Interactive OpenAPI documentation is at `http://localhost:8000/docs`.

2. **Start the Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   > The web application will launch at `http://localhost:3000`.

---

### 3. Trigger Live Scraper Sync
To scrape the latest notices from CPPP, GeM, and State Portals and persist them into the database:
```bash
curl -X POST http://localhost:8000/api/scraper/scrape-live
```

---

## 📁 Repository Structure

```
all-india-tenders/
├── docker-compose.yml                 # PostgreSQL 16 + pgvector container definition
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── current_tenders_routes.py   # Live tenders & SBD PDF endpoints
│   │   │   ├── accepted_tenders_routes.py  # 10-year awarded bids archive
│   │   │   ├── bidders_routes.py           # Contractor intelligence dossiers
│   │   │   ├── feedback_routes.py          # Feedback submissions & notifications
│   │   │   ├── sources_routes.py           # Portals, states, & taxonomy endpoints
│   │   │   └── system_routes.py            # Health, stats, & live scraper sync
│   │   ├── db/
│   │   │   ├── base.py                     # SQLAlchemy 2.0 DeclarativeBase
│   │   │   ├── session.py                  # Async engine (PostgreSQL/SQLite)
│   │   │   ├── models.py                   # Relational ORM models
│   │   │   └── seed.py                     # Comprehensive database seeder
│   │   ├── services/
│   │   │   ├── current_tenders_service.py  # Live scraping & in-memory stream
│   │   │   ├── accepted_tenders_service.py # Awarded tenders repository
│   │   │   ├── bidders_service.py          # Contractor intelligence directory
│   │   │   ├── db_sync_service.py          # Scraper-to-database sync engine
│   │   │   ├── gem_service.py              # GeM portal direct API ingester
│   │   │   └── feedback_service.py         # Contact form persistence & SMTP dispatch
│   │   └── main.py                         # FastAPI application entrypoint
│   ├── .env.example                        # Environment variables template
│   └── populate_all_sources.py             # Multi-source procurement catalog
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomeScreen/                 # Landing page & feedback contact section
│   │   │   ├── CurrentTenders/             # In-progress tender cards & drawer filters
│   │   │   ├── RegisteredBidders/          # Contractor profiles & financial intelligence
│   │   │   ├── common/                     # Reusable UI (Drawer, Dropdowns, Search)
│   │   │   ├── CurrentTendersTab.tsx       # In-progress tab container
│   │   │   ├── PreviouslyAcceptedTendersTab.tsx  # Awarded bids archive
│   │   │   └── RegisteredBiddersTab.tsx    # Contractors directory
│   │   ├── services/api.ts                 # Frontend API client
│   │   └── App.tsx                         # Main app shell & navigation
├── README.md
└── start.sh
```

---

## 📜 Statutory Compliance & Security
- Compliant with **GFR 2017 (General Financial Rules)** and **Central Vigilance Commission (CVC)** guidelines.
- Standard Bidding Documents strictly follow Ministry of Finance and CPWD Works Manual formats.
- Data ingestion complies with the **National Data Sharing and Accessibility Policy (NDSAP)** and Open Government Data (OGD) standards.

---

## 📄 License
This project is open-source under the MIT License.
