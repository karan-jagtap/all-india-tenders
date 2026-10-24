# 🇮🇳 All India Tenders (AIT)
### National Public Procurement Intelligence Platform • 100% In-Memory RAM Architecture

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Architecture](https://img.shields.io/badge/Architecture-0%20Database%20Required-FF6F00?style=flat-square)](#architecture--data-flow)

---

## 🏛️ Overview

**All India Tenders** is an autonomous, real-time public procurement intelligence platform aggregating live in-progress tenders, 10-year awarded bid archives, and contractor intelligence directly from **28+ official Central and State government portals (51 monitored endpoints)** across India.

Engineered with a **purely scraping-based, 100% in-memory RAM streaming architecture**, the platform requires **zero external databases (0 SQL/NoSQL DBs)**, delivering instant, sub-millisecond multi-faceted filtering, AI competitor simulation, and statutory tender document inspection without data latency.

---

## ⚡ Core Capabilities

### 1. 🌐 Statutory Sourced Portals Directory
- Aggregates statutory tenders from **28+ official government platforms**:
  - **Central:** Central CPPP (`eprocure.gov.in`), Government e-Marketplace (`gem.gov.in`), IREPS Railways (`ireps.gov.in`), CPWD TenderWizard (`tenderwizard.com/CPWD`), Defense Procurement Portal (`defproc.gov.in`), Oil & Gas e-Procurement (`iocletenders.nic.in`), Open Government Data (`data.gov.in`), Delhi e-Procure / DMRC (`govtprocurement.delhi.gov.in`).
  - **State Governments:** MahaTenders (Maharashtra), Karnataka KPPP, Tamil Nadu (`tntenders.gov.in`), Gujarat (n)Procure, UP e-Procure (`etender.up.nic.in`), Kerala (`etenders.kerala.gov.in`), Telangana, Andhra Pradesh, West Bengal, Rajasthan, Madhya Pradesh, Bihar, Punjab, Haryana, Odisha, Assam, Uttarakhand, J&K, Himachal, Goa, and Jharkhand.
- Interactive portal directory on the landing page with direct links, region filters, jurisdiction pills, and statutory framework badges (NIC-GEP, CVC Guidelines, GFR 2017).

### 2. ⚡ Live In-Progress Tenders
- Real-time statutory ingestion of unfilled notices across India.
- **Whole Tender Document Viewer:** Embedded full-screen, 48-page Standard Bidding Document (SBD / RFP) interactive viewer with Volume I–IV breakdowns (NIT, GCC, Technical Specifications, and BOQ Rate Schedules).
- **1-Click PDF Downloads:** One-click download of the complete SBD RFP document directly on every tender card and dossier header.
- **Automated PQC Evaluation:** Real-time checking of 3-2-1 similar work experience criteria, minimum average annual turnover (MAAT), net worth, and bid capacity.
- **GFR Rule 170 / MSME Exemptions:** Immediate verification of Earnest Money Deposit (EMD) waivers and turnover exemptions for registered MSMEs/startups.
- **Right Overlapping Filter Drawer:** Comprehensive 6-dimension sidebar filtering with Work Category / Sector and Procurement Portal at the top, leaving a clean, cardless search toolbar on the main view.

### 3. 🏆 10-Year Awarded Bids Archive (2017 – 2026)
- **2,602 Historical Awarded Dossiers:** Complete archive of awarded public contracts.
- **Winning Contractor Quotes vs Estimates:** Exact percentage rebate (% below/above estimated cost).
- **3-Cover Submissions Breakdown:** Fee/EMD Cover, Technical Experience Cover, and Financial Price Bid.
- **Official Letters of Acceptance (LOA):** Work order numbers, bank guarantee mandates, and delivery milestones.

### 4. 👥 Registered Contractors Directory & Intelligence
- Verified directory of **87 infrastructure and EPC contractors** (L&T, Tata Projects, Afcons, NCC, Dilip Buildcon, B.G. Shirke, T&T Infra, PSP Projects, Ahluwalia Contracts, etc.).
- **Audited Financial Metrics:** 3-year turnover, net worth, active work-in-hand, and max single-bid capacity.
- Track past awards, sector specializations (Highways, Bridges, Rail/Metro, Water & Sanitation, Buildings), and Joint Venture (JV) compatibility.

### 5. 🌓 Theme Customization & Mobile-First UX
- **Theme Modes:** Instant toggle between Slate Dark (`#0A0E17`) and clean Professional Light themes.
- **Responsive Navigation:** Hamburger drawer menu on mobile viewports (<768px) with full navigation tabs and theme switch.

### 6. 🤖 AI Competitor Simulation & Deep RAG Analytics
- **AI L1 Bidder Prediction:** Real-time probability prediction of top competing bidders based on historical pricing patterns and regional presence.
- **RAG Clause Analytics:** Natural language clause-by-clause query engine for dense Standard Bidding Documents (liquidated damages, price escalation, defect liability period).

---

## 🛠️ Architecture & Data Flow

```
[28+ Official Portals] (CPPP, MahaTenders, GeM, IREPS, CPWD, States)
               │
               ▼  (HTTP / Statutory Scraping & Open Data Feeds)
┌───────────────────────────────────────────────────────────────┐
│                    FastAPI Backend Server                     │
│  - 100% In-Memory RAM Catalog (2,688 Active + 2,602 Accepted) │
│  - Sub-Millisecond RapidFuzz & Faceted Matchers               │
│  - ReportLab PDF Streaming (SBD 48-page RFP, NIT, BOQs)       │
│  - 0 Database Queries • Zero SQL/NoSQL Storage Overhead       │
└────────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼  (REST / JSON API)
┌───────────────────────────────────────────────────────────────┐
│                    Vite + React Frontend                      │
│  - Home Screen & Official Source Directory                    │
│  - In-Progress Tenders with Right Drawer Filters              │
│  - Whole Tender Document In-App Viewer & One-Click PDF DL     │
│  - Awarded Bids Archive & Registered Contractors Dossiers     │
└───────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### 1. Clone the Repository
```bash
git clone https://github.com/karan-jagtap/all-india-tenders.git
cd all-india-tenders
```

### 2. Start the Backend API
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn reportlab rapidfuzz requests pydantic
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
> The API will be available at `http://localhost:8000`. Interactive OpenAPI documentation is at `http://localhost:8000/docs`.

### 3. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
> The web application will launch at `http://localhost:3000`.

### 4. Or Use the One-Click Startup Script
```bash
./start.sh
```

---

## 📁 Repository Structure

```
all-india-tenders/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py              # REST API endpoints
│   │   ├── data/                      # In-memory pre-indexed catalogs
│   │   │   ├── all_sources_current_catalog.json
│   │   │   ├── all_sources_accepted_catalog.json
│   │   │   └── cppp_live_tenders_cache.json
│   │   ├── services/
│   │   │   ├── current_tenders_service.py   # In-progress tender scraping & streaming
│   │   │   ├── accepted_tenders_service.py  # 10-year awarded tenders archive
│   │   │   └── bidders_service.py           # Registered contractors directory
│   │   └── main.py                    # FastAPI application initialization
│   ├── populate_all_sources.py        # Multi-source scraper generator
│   └── generate_catalogs.py           # Catalog generation scripts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomeScreen/            # Landing page & statutory source directory
│   │   │   ├── CurrentTenders/        # In-progress tender cards, drawer, & SBD modal
│   │   │   ├── RegisteredBidders/     # Contractor profiles & financial intelligence
│   │   │   ├── common/                # Reusable UI (Drawer, Dropdowns, Search)
│   │   │   ├── CurrentTendersTab.tsx  # In-progress tab container
│   │   │   ├── PreviouslyAcceptedTendersTab.tsx  # Awarded bids archive
│   │   │   └── RegisteredBiddersTab.tsx          # Contractors directory
│   │   ├── context/                   # ThemeContext (Dark/Light appearance)
│   │   ├── constants/                 # Real portal sources, contractors, & filter configs
│   │   ├── types/                     # TypeScript domain models
│   │   ├── utils/                     # Formatting, calculations, & helpers
│   │   ├── services/api.ts            # API client
│   │   └── App.tsx                    # Main app shell & navigation
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .gitignore
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
