import os
import subprocess

def create_architecture_svg(filepath):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="primaryGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#7e22ce"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1600" height="1000" fill="url(#bg)"/>

  <!-- Decorative Grid Overlay -->
  <g opacity="0.04" stroke="#ffffff" stroke-width="1">
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40"/>
    </pattern>
    <rect width="1600" height="1000" fill="url(#grid)"/>
  </g>

  <!-- Header Section -->
  <g transform="translate(60, 45)">
    <rect x="0" y="0" width="1480" height="85" rx="16" fill="url(#cardBg)" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
    <circle cx="45" cy="42" r="22" fill="#0284c7" opacity="0.2"/>
    <circle cx="45" cy="42" r="14" fill="#38bdf8"/>
    <text x="85" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#f8fafc">All India Tenders — Enterprise Hybrid Database Architecture</text>
    <text x="85" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">Dual Persistent Relational Database (PostgreSQL 16 + SQLite) &amp; Sub-15ms In-Memory RAM Streaming Layer</text>
    
    <!-- Badge -->
    <rect x="1260" y="28" width="190" height="30" rx="8" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1"/>
    <circle cx="1278" cy="43" r="4" fill="#34d399"/>
    <text x="1292" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#34d399">HYBRID PERSISTENT ARCH</text>
  </g>

  <!-- Column 1: External Government Portals -->
  <g transform="translate(60, 160)">
    <rect width="260" height="780" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
    <rect width="260" height="48" rx="16" fill="url(#primaryGlow)" opacity="0.15"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38bdf8">1. REAL GOVT PORTALS</text>
    <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">28+ Statutory Platforms (51 Endpoints)</text>

    <!-- Portal Item 1 -->
    <g transform="translate(15, 65)">
      <rect width="230" height="90" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f1f5f9">Central CPPP</text>
      <text x="14" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">eprocure.gov.in</text>
      <rect x="14" y="58" width="80" height="18" rx="4" fill="#0369a1" opacity="0.3"/>
      <text x="20" y="71" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#38bdf8">Central Feed</text>
    </g>

    <!-- Portal Item 2 -->
    <g transform="translate(15, 170)">
      <rect width="230" height="90" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f1f5f9">Government e-Marketplace</text>
      <text x="14" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">gem.gov.in (BidPlus)</text>
      <rect x="14" y="58" width="85" height="18" rx="4" fill="#059669" opacity="0.3"/>
      <text x="20" y="71" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#34d399">GeM API / Live</text>
    </g>

    <!-- Portal Item 3 -->
    <g transform="translate(15, 275)">
      <rect width="230" height="90" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f1f5f9">Indian Railways IREPS</text>
      <text x="14" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">ireps.gov.in</text>
      <rect x="14" y="58" width="90" height="18" rx="4" fill="#d97706" opacity="0.3"/>
      <text x="20" y="71" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#fbbf24">Railways Sector</text>
    </g>

    <!-- Portal Item 4 -->
    <g transform="translate(15, 380)">
      <rect width="230" height="110" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f1f5f9">State Statutory Portals</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">• MahaTenders (Maharashtra)</text>
      <text x="14" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">• UP e-Procure (Uttar Pradesh)</text>
      <text x="14" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">• Delhi e-Procure (Govt Delhi)</text>
      <text x="14" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">• Karnataka KPPP, TN, WB, etc.</text>
    </g>

    <!-- Portal Item 5 -->
    <g transform="translate(15, 505)">
      <rect width="230" height="100" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f1f5f9">Defense &amp; PSU Portals</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">• defproc.gov.in (Defense)</text>
      <text x="14" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">• CPWD TenderWizard</text>
      <text x="14" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">• NTPC, Coal India, BHEL, etc.</text>
    </g>

    <g transform="translate(15, 620)">
      <rect width="230" height="140" rx="10" fill="#0284c7" opacity="0.08" stroke="#0284c7" stroke-dasharray="4"/>
      <text x="14" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#38bdf8">Direct Scraped Feeds</text>
      <text x="14" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Active tender notices,</text>
      <text x="14" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">BOQ PDFs, SBD documents,</text>
      <text x="14" y="75" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">PQC criteria, and live</text>
      <text x="14" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">bidding closing dates.</text>
    </g>
  </g>

  <!-- Column 2: Ingestion, Cron & Concurrency Engine -->
  <g transform="translate(365, 160)">
    <rect width="270" height="780" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
    <rect width="270" height="48" rx="16" fill="url(#amberGlow)" opacity="0.15"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#fbbf24">2. INGESTION &amp; CRON</text>
    <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">Rate Limiting &amp; Mutex Protection</text>

    <!-- Trigger 1: 4 AM Cron -->
    <g transform="translate(15, 65)">
      <rect width="240" height="120" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">Daily Automated Cron</text>
      <text x="14" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#fbbf24">⏰ Runs @ 4:00 AM IST</text>
      <text x="14" y="64" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Cron Expression: 0 4 * * *</text>
      <text x="14" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">AsyncIOScheduler (Asia/Kolkata)</text>
      <rect x="14" y="92" width="105" height="18" rx="4" fill="#d97706" opacity="0.25"/>
      <text x="20" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#fbbf24">Zero Human Action</text>
    </g>

    <!-- Trigger 2: Manual Sync Button -->
    <g transform="translate(15, 200)">
      <rect width="240" height="135" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">Manual "Sync Live" Button</text>
      <text x="14" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Triggered on-demand by visitors</text>
      <rect x="14" y="58" width="212" height="65" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1"/>
      <text x="22" y="75" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f59e0b">🛡️ 5-Minute Safety Cooldown</text>
      <text x="22" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#cbd5e1">Debounce window prevents</text>
      <text x="22" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#cbd5e1">spamming govt portal IP limits</text>
    </g>

    <!-- Concurrency Lock -->
    <g transform="translate(15, 350)">
      <rect width="240" height="140" rx="10" fill="#1e293b" stroke="#0284c7" stroke-width="1.5"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">Global Mutex Lock</text>
      <text x="14" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#cbd5e1">SYNC_LOCK = asyncio.Lock()</text>
      <text x="14" y="64" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Guarantees only ONE scrape</text>
      <text x="14" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">can execute at any instant.</text>
      <rect x="14" y="92" width="212" height="36" rx="6" fill="#0369a1" opacity="0.2"/>
      <text x="22" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#38bdf8">Eliminates SQLite DB locks</text>
      <text x="22" y="119" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#38bdf8">and race conditions completely.</text>
    </g>

    <!-- Ingestion Engine -->
    <g transform="translate(15, 505)">
      <rect width="240" height="255" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">Pipeline Orchestrator</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#10b981">db_sync_service.py</text>
      <text x="14" y="64" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">1. Async fetch from all portals</text>
      <text x="14" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">2. Parse titles, NIT, PQC, BOQ</text>
      <text x="14" y="100" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">3. Calculate days left &amp; status</text>
      <text x="14" y="118" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">4. Batch Upsert into Database</text>
      <text x="14" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">5. Refresh In-Memory RAM Stream</text>
      <text x="14" y="154" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">6. Commit cron_sync_logs audit</text>
      
      <rect x="14" y="175" width="212" height="65" rx="6" fill="#10b981" opacity="0.12" stroke="#10b981" stroke-width="1"/>
      <text x="22" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#34d399">⚡ Average Execution:</text>
      <text x="22" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#e2e8f0">~2,080ms across all</text>
      <text x="22" y="225" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#e2e8f0">41 portals &amp; 3,293 tenders</text>
    </g>
  </g>

  <!-- Column 3: Dual Persistent Database Storage -->
  <g transform="translate(675, 160)">
    <rect width="280" height="780" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
    <rect width="280" height="48" rx="16" fill="url(#emeraldGlow)" opacity="0.15"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#34d399">3. DUAL PERSISTENT DB</text>
    <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">SQLAlchemy 2.0 Async Session Layer</text>

    <!-- PostgreSQL -->
    <g transform="translate(15, 65)">
      <rect width="250" height="150" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">PostgreSQL 16 (Primary / Cloud)</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Driver: asyncpg (Async Connection Pool)</text>
      <text x="14" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Pool Size: 20 connections</text>
      <text x="14" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Max Overflow: 10 connections</text>
      <text x="14" y="94" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• pgvector Extension: Enabled</text>
      <rect x="14" y="112" width="222" height="24" rx="4" fill="#059669" opacity="0.2"/>
      <text x="22" y="128" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="600" fill="#34d399">Enterprise Production Database</text>
    </g>

    <!-- SQLite Fallback -->
    <g transform="translate(15, 230)">
      <rect width="250" height="150" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">SQLite 3 (Local / Standalone)</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Driver: aiosqlite (Async Engine)</text>
      <text x="14" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• all_india_tenders.db file</text>
      <text x="14" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Zero external dependencies</text>
      <text x="14" y="94" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Instant local boot &amp; offline mode</text>
      <rect x="14" y="112" width="222" height="24" rx="4" fill="#0284c7" opacity="0.2"/>
      <text x="22" y="128" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="600" fill="#38bdf8">Seamless Fallback on any machine</text>
    </g>

    <!-- Relational Tables Box -->
    <g transform="translate(15, 395)">
      <rect width="250" height="365" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">11 Persistent Relational Tables</text>
      
      <text x="14" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#38bdf8">1. tenders</text>
      <text x="24" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Active in-progress tenders (3,293 records)</text>

      <text x="14" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#38bdf8">2. awarded_tenders</text>
      <text x="24" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Accepted contracts archive (5,224 records)</text>

      <text x="14" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#38bdf8">3. contractors &amp; contracts</text>
      <text x="24" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Bidders profiles, turnover &amp; won projects</text>

      <text x="14" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#38bdf8">4. states &amp; cities</text>
      <text x="24" y="164" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Geographic taxonomy across 28 states</text>

      <text x="14" y="184" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#38bdf8">5. sources &amp; portal_sources</text>
      <text x="24" y="198" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Official portal registry &amp; domain endpoints</text>

      <text x="14" y="218" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#38bdf8">6. organisations &amp; categories</text>
      <text x="24" y="232" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Ministries, PSUs &amp; procurement sectors</text>

      <text x="14" y="252" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#fbbf24">7. cron_sync_logs</text>
      <text x="24" y="266" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Execution audit: duration, records, status</text>

      <text x="14" y="286" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#34d399">8. feedback_submissions</text>
      <text x="24" y="300" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Contact inquiries &amp; feedback submissions</text>

      <text x="14" y="320" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#a855f7">9. app_constants &amp; pools</text>
      <text x="24" y="334" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Taxonomy filters &amp; simulation pools</text>
    </g>
  </g>

  <!-- Column 4: In-Memory RAM Streaming Cache -->
  <g transform="translate(995, 160)">
    <rect width="260" height="780" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
    <rect width="260" height="48" rx="16" fill="url(#purpleGlow)" opacity="0.15"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#c084fc">4. RAM STREAMING CACHE</text>
    <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">Sub-15ms Ultra-Low Latency</text>

    <!-- RAM Item 1 -->
    <g transform="translate(15, 65)">
      <rect width="230" height="150" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">ALL_CURRENT_TENDERS</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">In-Memory RAM Streaming List</text>
      <text x="14" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#38bdf8">3,293 Notices</text>
      <text x="14" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Instant multi-faceted filtering</text>
      <text x="14" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Live days-left calculations</text>
      <text x="14" y="120" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Zero disk I/O bottleneck</text>
    </g>

    <!-- RAM Item 2 -->
    <g transform="translate(15, 230)">
      <rect width="230" height="140" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">ACCEPTED_TENDERS_CATALOG</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Historical Awarded Archive</text>
      <text x="14" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#34d399">5,224 Contracts</text>
      <text x="14" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Filter by Fiscal Year (2020-2025)</text>
      <text x="14" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• L1 discount benchmarks &amp; LOAs</text>
    </g>

    <!-- RAM Item 3 -->
    <g transform="translate(15, 385)">
      <rect width="230" height="140" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">ALL_BIDDERS_CATALOG</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Registered Contractors Pool</text>
      <text x="14" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#f59e0b">103 Contractors</text>
      <text x="14" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Audited turnover &amp; solvency</text>
      <text x="14" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">• Class 1A, MSME, CA UDINs</text>
    </g>

    <!-- Performance Badge -->
    <g transform="translate(15, 540)">
      <rect width="230" height="220" rx="10" fill="#a855f7" opacity="0.08" stroke="#a855f7" stroke-width="1.5"/>
      <text x="14" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#c084fc">Why RAM Streaming?</text>
      <text x="14" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">1. Query speed: &lt; 15ms</text>
      <text x="14" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">2. Prevents DB connection drain</text>
      <text x="14" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">3. Instant client search responses</text>
      <text x="14" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">4. Dual write: DB on sync &amp;</text>
      <text x="14" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#cbd5e1">   instant in-memory reflection.</text>
      
      <rect x="14" y="145" width="202" height="55" rx="6" fill="#a855f7" opacity="0.2"/>
      <text x="22" y="165" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#e9d5ff">⚡ ZERO Database Latency</text>
      <text x="22" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#f3e8ff">All page loads render instantly</text>
      <text x="22" y="193" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#f3e8ff">without awaiting disk reads.</text>
    </g>
  </g>

  <!-- Column 5: Presentation & Frontend Layer -->
  <g transform="translate(1295, 160)">
    <rect width="245" height="780" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
    <rect width="245" height="48" rx="16" fill="url(#orangeGlow)" opacity="0.15"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#fb923c">5. FASTAPI &amp; REACT</text>
    <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">UI Presentation &amp; Endpoints</text>

    <!-- FastAPI Box -->
    <g transform="translate(15, 65)">
      <rect width="215" height="180" rx="10" fill="#1e293b" stroke="#334155"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">FastAPI REST Server</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Uvicorn Async Worker (:8000)</text>
      <text x="14" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#38bdf8">• GET /api/current-tenders</text>
      <text x="14" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#38bdf8">• GET /api/accepted-tenders</text>
      <text x="14" y="98" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#38bdf8">• GET /api/contractors</text>
      <text x="14" y="114" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#38bdf8">• GET /api/stats (metrics)</text>
      <text x="14" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#fbbf24">• POST /api/scraper/scrape-live</text>
      <text x="14" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#34d399">• POST /api/feedback/submit</text>
    </g>

    <!-- React Frontend -->
    <g transform="translate(15, 260)">
      <rect width="215" height="495" rx="10" fill="#1e293b" stroke="#ea580c" stroke-width="1.5"/>
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#fb923c">React 18 SPA Frontend</text>
      <text x="14" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#94a3b8">Vite + Tailwind CSS (:3000)</text>

      <rect x="14" y="58" width="187" height="60" rx="6" fill="#0f172a" stroke="#334155"/>
      <text x="22" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc">1. Home / Overview</text>
      <text x="22" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Portal directory &amp; telemetry</text>
      <text x="22" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Feedback form &amp; stats bar</text>

      <rect x="14" y="128" width="187" height="60" rx="6" fill="#0f172a" stroke="#334155"/>
      <text x="22" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc">2. In-Progress Tenders</text>
      <text x="22" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Live countdowns, PQC, SBD</text>
      <text x="22" y="176" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Pre-Bid simulation &amp; RAG</text>

      <rect x="14" y="198" width="187" height="60" rx="6" fill="#0f172a" stroke="#334155"/>
      <text x="22" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc">3. Awarded Tenders</text>
      <text x="22" y="232" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Winning L1 bidders &amp; values</text>
      <text x="22" y="246" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Historical LOA numbers</text>

      <rect x="14" y="268" width="187" height="60" rx="6" fill="#0f172a" stroke="#334155"/>
      <text x="22" y="286" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc">4. Registered Bidders</text>
      <text x="22" y="302" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Contractor profiles &amp; CINs</text>
      <text x="22" y="316" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#94a3b8">Audited turnover &amp; solvency</text>

      <rect x="14" y="340" width="187" height="135" rx="6" fill="#ea580c" opacity="0.1" stroke="#ea580c"/>
      <text x="22" y="360" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#fb923c">Sync Live Button Widget</text>
      <text x="22" y="378" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#fed7aa">• Live 5-minute countdown</text>
      <text x="22" y="394" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#fed7aa">• Hover popup tooltip</text>
      <text x="22" y="410" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#fed7aa">• Explains WHY &amp; TILL WHEN</text>
      <text x="22" y="426" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#fed7aa">• Disabled during cooldown</text>
      <text x="22" y="442" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#fed7aa">• Synced across desktop/mobile</text>
      <text x="22" y="458" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#fed7aa">• Shared across all visitors</text>
    </g>
  </g>

  <!-- Connective Arrows -->
  <path d="M 320 280 L 365 280" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>
  <path d="M 320 440 L 365 440" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>
  <path d="M 320 560 L 365 560" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>

  <path d="M 635 630 L 675 630" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-emerald)"/>
  <path d="M 955 630 L 995 630" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-emerald)"/>
  <path d="M 1255 420 L 1295 420" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>
</svg>"""
    with open(filepath, "w") as f:
        f.write(svg_content)
    print(f"Created {filepath}")

def create_erd_svg(filepath):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="1600" height="1100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0e1422"/>
      <stop offset="100%" stop-color="#050810"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <marker id="erd-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
      <circle cx="5" cy="5" r="3.5" fill="#38bdf8"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1600" height="1100" fill="url(#bg)"/>

  <!-- Title Header -->
  <g transform="translate(60, 35)">
    <rect width="1480" height="70" rx="14" fill="#131b2e" stroke="#25324d" stroke-width="1.5" filter="url(#cardShadow)"/>
    <text x="30" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#f8fafc">All India Tenders — Database Entity Relationship Diagram (ERD)</text>
    <text x="30" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">SQLAlchemy 2.0 ORM Schema • Primary Keys, Foreign Keys, Geographic &amp; Statutory Bidder Relationships</text>
    <rect x="1310" y="20" width="140" height="30" rx="6" fill="#0284c7" opacity="0.2" stroke="#0284c7"/>
    <text x="1328" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#38bdf8">11 SQL TABLES</text>
  </g>

  <!-- Row 1: Taxonomy & Sources -->

  <!-- Table: states -->
  <g transform="translate(60, 130)" filter="url(#cardShadow)">
    <rect width="260" height="210" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="260" height="34" rx="10" fill="#0284c7"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">states</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(50)</text>
    <text x="14" y="78" font-family="monospace" font-size="11" fill="#cbd5e1">    name : VARCHAR(100) UNIQUE</text>
    <text x="14" y="100" font-family="monospace" font-size="11" fill="#cbd5e1">    code : VARCHAR(10)</text>
    <text x="14" y="122" font-family="monospace" font-size="11" fill="#cbd5e1">    capital : VARCHAR(100)</text>
    <text x="14" y="144" font-family="monospace" font-size="11" fill="#cbd5e1">    region : VARCHAR(50)</text>
    <text x="14" y="166" font-family="monospace" font-size="11" fill="#64748b">    created_at : DATETIME</text>
    <text x="14" y="188" font-family="monospace" font-size="11" fill="#64748b">    updated_at : DATETIME</text>
  </g>

  <!-- Table: cities -->
  <g transform="translate(360, 130)" filter="url(#cardShadow)">
    <rect width="260" height="210" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="260" height="34" rx="10" fill="#0284c7"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">cities</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(80)</text>
    <text x="14" y="78" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  state_id : VARCHAR(50)</text>
    <text x="14" y="100" font-family="monospace" font-size="11" fill="#cbd5e1">    name : VARCHAR(100)</text>
    <text x="14" y="122" font-family="monospace" font-size="11" fill="#cbd5e1">    is_capital : BOOLEAN</text>
    <text x="14" y="144" font-family="monospace" font-size="11" fill="#cbd5e1">    aliases : JSON</text>
    <text x="14" y="166" font-family="monospace" font-size="11" fill="#64748b">    created_at : DATETIME</text>
    <text x="14" y="188" font-family="monospace" font-size="11" fill="#64748b">    updated_at : DATETIME</text>
  </g>

  <!-- Table: sources -->
  <g transform="translate(660, 130)" filter="url(#cardShadow)">
    <rect width="290" height="230" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="290" height="34" rx="10" fill="#059669"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">sources (Real Portals Directory)</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(80)</text>
    <text x="14" y="78" font-family="monospace" font-size="11" fill="#cbd5e1">    name : VARCHAR(150) UNIQUE</text>
    <text x="14" y="100" font-family="monospace" font-size="11" fill="#cbd5e1">    domain : VARCHAR(100)</text>
    <text x="14" y="122" font-family="monospace" font-size="11" fill="#cbd5e1">    portal_type : VARCHAR(50)</text>
    <text x="14" y="144" font-family="monospace" font-size="11" fill="#cbd5e1">    statutory_framework : VARCHAR(100)</text>
    <text x="14" y="166" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  bound_state_id : VARCHAR(50)</text>
    <text x="14" y="188" font-family="monospace" font-size="11" fill="#cbd5e1">    is_active : BOOLEAN</text>
    <text x="14" y="210" font-family="monospace" font-size="11" fill="#64748b">    total_notices_count : INT</text>
  </g>

  <!-- Table: categories -->
  <g transform="translate(990, 130)" filter="url(#cardShadow)">
    <rect width="260" height="210" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="260" height="34" rx="10" fill="#d97706"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">categories</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(80)</text>
    <text x="14" y="78" font-family="monospace" font-size="11" fill="#cbd5e1">    name : VARCHAR(120) UNIQUE</text>
    <text x="14" y="100" font-family="monospace" font-size="11" fill="#cbd5e1">    description : TEXT</text>
    <text x="14" y="122" font-family="monospace" font-size="11" fill="#cbd5e1">    keywords : JSON</text>
    <text x="14" y="144" font-family="monospace" font-size="11" fill="#cbd5e1">    color_badge : VARCHAR(50)</text>
    <text x="14" y="166" font-family="monospace" font-size="11" fill="#64748b">    created_at : DATETIME</text>
    <text x="14" y="188" font-family="monospace" font-size="11" fill="#64748b">    updated_at : DATETIME</text>
  </g>

  <!-- Table: organisations -->
  <g transform="translate(1280, 130)" filter="url(#cardShadow)">
    <rect width="260" height="210" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="260" height="34" rx="10" fill="#7c3aed"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">organisations</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(100)</text>
    <text x="14" y="78" font-family="monospace" font-size="11" fill="#cbd5e1">    name : VARCHAR(200) UNIQUE</text>
    <text x="14" y="100" font-family="monospace" font-size="11" fill="#cbd5e1">    org_type : VARCHAR(50)</text>
    <text x="14" y="122" font-family="monospace" font-size="11" fill="#cbd5e1">    parent_ministry : VARCHAR(200)</text>
    <text x="14" y="144" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  state_id : VARCHAR(50)</text>
    <text x="14" y="166" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  default_category_id : VARCHAR(80)</text>
    <text x="14" y="188" font-family="monospace" font-size="11" fill="#64748b">    tender_count : INT</text>
  </g>

  <!-- Row 2: Central Tenders (Live In-Progress & Historical Awarded) -->

  <!-- Table: tenders (Central in-progress entity) -->
  <g transform="translate(60, 390)" filter="url(#cardShadow)">
    <rect width="450" height="380" rx="10" fill="#131b2e" stroke="#38bdf8" stroke-width="2"/>
    <rect width="450" height="36" rx="10" fill="#0284c7"/>
    <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">tenders (Live In-Progress Notices)</text>
    <text x="14" y="60" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(100) (e.g. GEM-2026-B-89104)</text>
    <text x="14" y="82" font-family="monospace" font-size="11" fill="#cbd5e1">    nit_number : VARCHAR(100)</text>
    <text x="14" y="104" font-family="monospace" font-size="11" fill="#cbd5e1">    title : TEXT (Full NIT Work Title)</text>
    <text x="14" y="126" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  source_portal_id : VARCHAR(80) -&gt; sources.id</text>
    <text x="14" y="148" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  category_id : VARCHAR(80) -&gt; categories.id</text>
    <text x="14" y="170" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  organisation_id : VARCHAR(100) -&gt; organisations.id</text>
    <text x="14" y="192" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  state_id : VARCHAR(50) -&gt; states.id</text>
    <text x="14" y="214" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  city_id : VARCHAR(80) -&gt; cities.id</text>
    <text x="14" y="236" font-family="monospace" font-size="11" fill="#cbd5e1">    estimated_cost_inr : FLOAT</text>
    <text x="14" y="258" font-family="monospace" font-size="11" fill="#cbd5e1">    emd_amount_inr : FLOAT</text>
    <text x="14" y="280" font-family="monospace" font-size="11" fill="#cbd5e1">    close_date : VARCHAR(50)</text>
    <text x="14" y="302" font-family="monospace" font-size="11" fill="#34d399">    days_left : INT (Live Ticking Countdown)</text>
    <text x="14" y="324" font-family="monospace" font-size="11" fill="#cbd5e1">    status : VARCHAR(50) [In-Progress]</text>
    <text x="14" y="346" font-family="monospace" font-size="11" fill="#cbd5e1">    pqc_criteria : JSON (Turnover, Solvency, Similar Works)</text>
    <text x="14" y="368" font-family="monospace" font-size="11" fill="#cbd5e1">    raw_data : JSON (Full Scraped Payload)</text>
  </g>

  <!-- Table: awarded_tenders -->
  <g transform="translate(550, 390)" filter="url(#cardShadow)">
    <rect width="450" height="380" rx="10" fill="#131b2e" stroke="#10b981" stroke-width="2"/>
    <rect width="450" height="36" rx="10" fill="#059669"/>
    <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">awarded_tenders (Historical Accepted Archive)</text>
    <text x="14" y="60" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(100) (e.g. ACC-2025-MH-8921)</text>
    <text x="14" y="82" font-family="monospace" font-size="11" fill="#cbd5e1">    title : TEXT (Awarded Work Contract Title)</text>
    <text x="14" y="104" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  source_portal_id : VARCHAR(80) -&gt; sources.id</text>
    <text x="14" y="126" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  category_id : VARCHAR(80) -&gt; categories.id</text>
    <text x="14" y="148" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  organisation_id : VARCHAR(100) -&gt; organisations.id</text>
    <text x="14" y="170" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">FK  state_id : VARCHAR(50) -&gt; states.id</text>
    <text x="14" y="192" font-family="monospace" font-size="11" font-weight="bold" fill="#34d399">FK  winning_contractor_id : VARCHAR(100) -&gt; contractors.id</text>
    <text x="14" y="214" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">    year : INT (Fiscal Period: 2020-2025)</text>
    <text x="14" y="236" font-family="monospace" font-size="11" fill="#cbd5e1">    award_date : VARCHAR(50)</text>
    <text x="14" y="258" font-family="monospace" font-size="11" fill="#cbd5e1">    estimated_cost_inr : FLOAT</text>
    <text x="14" y="280" font-family="monospace" font-size="11" fill="#34d399">    awarded_contract_value_inr : FLOAT</text>
    <text x="14" y="302" font-family="monospace" font-size="11" fill="#cbd5e1">    quoted_discount_pct : FLOAT</text>
    <text x="14" y="324" font-family="monospace" font-size="11" fill="#cbd5e1">    loa_number : VARCHAR(100)</text>
    <text x="14" y="346" font-family="monospace" font-size="11" fill="#cbd5e1">    raw_data : JSON</text>
    <text x="14" y="368" font-family="monospace" font-size="11" fill="#64748b">    created_at : DATETIME</text>
  </g>

  <!-- Table: contractors & contractor_contracts -->
  <g transform="translate(1040, 390)" filter="url(#cardShadow)">
    <rect width="500" height="380" rx="10" fill="#131b2e" stroke="#f59e0b" stroke-width="2"/>
    <rect width="500" height="36" rx="10" fill="#d97706"/>
    <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">contractors (Registered Bidders Directory)</text>
    <text x="14" y="60" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : VARCHAR(100) (e.g. larsen-toubro-limited)</text>
    <text x="14" y="82" font-family="monospace" font-size="11" fill="#cbd5e1">    name : VARCHAR(200) (Legal Registered Name)</text>
    <text x="14" y="104" font-family="monospace" font-size="11" fill="#cbd5e1">    cin : VARCHAR(50) (Corporate Identity Number)</text>
    <text x="14" y="126" font-family="monospace" font-size="11" fill="#cbd5e1">    gstin : VARCHAR(50)</text>
    <text x="14" y="148" font-family="monospace" font-size="11" fill="#cbd5e1">    pan : VARCHAR(50)</text>
    <text x="14" y="170" font-family="monospace" font-size="11" fill="#cbd5e1">    contractor_class : VARCHAR(100) [Class 1A Super]</text>
    <text x="14" y="192" font-family="monospace" font-size="11" fill="#cbd5e1">    msme_status : VARCHAR(100) [Class-I Local Supplier]</text>
    <text x="14" y="214" font-family="monospace" font-size="11" font-weight="bold" fill="#34d399">    audited_turnover_inr : FLOAT (3-Yr Average)</text>
    <text x="14" y="236" font-family="monospace" font-size="11" font-weight="bold" fill="#34d399">    solvency_certificate_inr : FLOAT</text>
    <text x="14" y="258" font-family="monospace" font-size="11" fill="#cbd5e1">    ca_udin : VARCHAR(50) (Statutory CA Verified)</text>
    <text x="14" y="280" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">    total_contracts_won : INT</text>
    <text x="14" y="302" font-family="monospace" font-size="11" font-weight="bold" fill="#f59e0b">    total_awarded_value_inr : FLOAT (Sum of Won Bids)</text>
    <text x="14" y="324" font-family="monospace" font-size="11" fill="#cbd5e1">    rating_score : FLOAT (4.9 / 5.0)</text>
    <text x="14" y="346" font-family="monospace" font-size="11" fill="#64748b">    1:N -&gt; contractor_contracts (Past Awards)</text>
    <text x="14" y="368" font-family="monospace" font-size="11" fill="#64748b">    N:M -&gt; contractor_state_mappings</text>
  </g>

  <!-- Row 3: Operational, Audit, Feedback Tables -->

  <!-- Table: cron_sync_logs -->
  <g transform="translate(60, 800)" filter="url(#cardShadow)">
    <rect width="450" height="250" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="450" height="34" rx="10" fill="#4338ca"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">cron_sync_logs (Sync Audit Trail)</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : INT AUTOINCREMENT</text>
    <text x="14" y="78" font-family="monospace" font-size="11" font-weight="bold" fill="#fbbf24">    trigger_type : VARCHAR(50) ['SCHEDULED_CRON' | 'MANUAL_BUTTON']</text>
    <text x="14" y="100" font-family="monospace" font-size="11" fill="#34d399">    status : VARCHAR(50) ['SUCCESS' | 'FAILED' | 'RUNNING']</text>
    <text x="14" y="122" font-family="monospace" font-size="11" fill="#cbd5e1">    portals_scraped_count : INT (41 portals)</text>
    <text x="14" y="144" font-family="monospace" font-size="11" fill="#cbd5e1">    total_in_progress_count : INT (3,293 notices)</text>
    <text x="14" y="166" font-family="monospace" font-size="11" fill="#cbd5e1">    db_upserted_count : INT</text>
    <text x="14" y="188" font-family="monospace" font-size="11" fill="#38bdf8">    execution_time_ms : FLOAT (~2,087.0ms)</text>
    <text x="14" y="210" font-family="monospace" font-size="11" fill="#cbd5e1">    details : JSON (Per-portal breakdown)</text>
    <text x="14" y="232" font-family="monospace" font-size="11" fill="#64748b">    created_at : DATETIME</text>
  </g>

  <!-- Table: feedback_submissions -->
  <g transform="translate(550, 800)" filter="url(#cardShadow)">
    <rect width="450" height="250" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="450" height="34" rx="10" fill="#be185d"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">feedback_submissions (User Inquiries)</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">PK  id : INT AUTOINCREMENT</text>
    <text x="14" y="78" font-family="monospace" font-size="11" fill="#cbd5e1">    name : VARCHAR(120)</text>
    <text x="14" y="100" font-family="monospace" font-size="11" fill="#cbd5e1">    email : VARCHAR(150)</text>
    <text x="14" y="122" font-family="monospace" font-size="11" fill="#cbd5e1">    phone : VARCHAR(50)</text>
    <text x="14" y="144" font-family="monospace" font-size="11" fill="#cbd5e1">    subject : VARCHAR(150)</text>
    <text x="14" y="166" font-family="monospace" font-size="11" fill="#cbd5e1">    message : TEXT</text>
    <text x="14" y="188" font-family="monospace" font-size="11" fill="#34d399">    email_recipient : VARCHAR(150) ['kmessilj@gmail.com']</text>
    <text x="14" y="210" font-family="monospace" font-size="11" fill="#38bdf8">    email_status : VARCHAR(50) ['SENT' | 'PENDING' | 'LOGGED']</text>
    <text x="14" y="232" font-family="monospace" font-size="11" fill="#64748b">    created_at : DATETIME</text>
  </g>

  <!-- Table: portal_sources & app_constants -->
  <g transform="translate(1040, 800)" filter="url(#cardShadow)">
    <rect width="500" height="250" rx="10" fill="#131b2e" stroke="#25324d" stroke-width="1.5"/>
    <rect width="500" height="34" rx="10" fill="#475569"/>
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">app_constants &amp; portal_sources</text>
    <text x="14" y="56" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">app_constants:</text>
    <text x="24" y="76" font-family="monospace" font-size="11" fill="#cbd5e1">PK  key : VARCHAR(100) (e.g. 'master_taxonomy_filters')</text>
    <text x="24" y="96" font-family="monospace" font-size="11" fill="#cbd5e1">    data : JSON (Cached taxonomy, filter pills &amp; mappings)</text>
    <text x="14" y="126" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">portal_sources (Directory of 37 Monitored Portals):</text>
    <text x="24" y="146" font-family="monospace" font-size="11" fill="#cbd5e1">PK  id : VARCHAR(80) (e.g. 'gem', 'mahatenders')</text>
    <text x="24" y="166" font-family="monospace" font-size="11" fill="#cbd5e1">    domain, url, category, state, region, status</text>
    <text x="24" y="186" font-family="monospace" font-size="11" fill="#cbd5e1">    key_authorities, statutory_framework, active_count</text>
    <text x="14" y="216" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">contractor_pools (Pre-Bid Simulation Models):</text>
    <text x="24" y="234" font-family="monospace" font-size="11" fill="#cbd5e1">    category, contractor_name, hq, turnover_cr, class</text>
  </g>

  <!-- Connective lines between tables -->
  <!-- states -> cities -->
  <path d="M 320 200 L 360 200" stroke="#0284c7" stroke-width="2" marker-end="url(#erd-dot)"/>
  
  <!-- states -> tenders -->
  <path d="M 190 340 L 190 390" stroke="#0284c7" stroke-width="2" marker-end="url(#erd-dot)"/>

  <!-- sources -> tenders -->
  <path d="M 750 360 L 750 375 L 350 375 L 350 390" stroke="#059669" stroke-width="2" marker-end="url(#erd-dot)"/>

  <!-- contractors -> awarded_tenders -->
  <path d="M 1040 500 L 1000 500" stroke="#f59e0b" stroke-width="2" marker-end="url(#erd-dot)"/>
</svg>"""
    with open(filepath, "w") as f:
        f.write(svg_content)
    print(f"Created {filepath}")

if __name__ == "__main__":
    docs_dir = "/Users/karan/workspace/all-india-tenders/docs"
    arch_svg = os.path.join(docs_dir, "database_architecture.svg")
    erd_svg = os.path.join(docs_dir, "database_erd.svg")
    
    create_architecture_svg(arch_svg)
    create_erd_svg(erd_svg)
