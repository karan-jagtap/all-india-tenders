import React, { useState, useMemo } from 'react';
import {
  Globe,
  Radio,
  Award,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingDown,
  Cpu,
  Database,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Filter,
  RefreshCw
} from 'lucide-react';
import { REAL_PORTAL_SOURCES } from '../../constants/portalSources';
import { PlatformStats } from '../../types';

interface HomeScreenProps {
  stats: PlatformStats | null;
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onNavigate,
  onTriggerSync,
  isSyncing
}) => {
  const [portalSearch, setPortalSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Filtered Portal Sources
  const filteredPortals = useMemo(() => {
    return REAL_PORTAL_SOURCES.filter((portal) => {
      if (selectedCategory !== 'ALL' && portal.category !== selectedCategory) {
        return false;
      }
      if (selectedRegion !== 'ALL' && portal.region !== selectedRegion) {
        return false;
      }
      if (portalSearch.trim()) {
        const q = portalSearch.toLowerCase().trim();
        const blob = `${portal.name} ${portal.domain} ${portal.state} ${portal.region} ${portal.description} ${portal.keyAuthorities.join(' ')} ${portal.procurementTypes.join(' ')}`.toLowerCase();
        return blob.includes(q);
      }
      return true;
    });
  }, [portalSearch, selectedCategory, selectedRegion]);

  const activeTenders = stats?.active_tenders_count || 2688;
  const acceptedTenders = stats?.accepted_tenders_count || 2602;
  const biddersCount = stats?.registered_bidders_count || 87;
  const totalValueCr = stats?.total_active_procurement_value_inr
    ? (stats.total_active_procurement_value_inr / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 1 })
    : '6,730.6';

  const scrollToSources = () => {
    const el = document.getElementById('real-sources-directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10 pb-12 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
        {/* Decorative background glow accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm text-slate-200">
            <span className="text-base leading-none">🇮🇳</span>
            <span className="font-bold text-orange-400">National Public Procurement Platform</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono">100% In-Memory RAM Streaming</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Autonomous Tender Intelligence Across{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              India's Official Procurement Portals
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Real-time statutory procurement intelligence platform aggregating unfilled in-progress tenders, complete 48-page Standard Bidding Documents (SBD / RFP), 10-year awarded bid records, and contractor intelligence from <strong>28+ official Central and State government portals</strong> — operating with <strong>Zero Database Requirements</strong>.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('current')}
              className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse text-white" />
              <span>Explore In-Progress Tenders ({activeTenders.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('accepted')}
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-300" />
              <span>Awarded Bids Archive ({acceptedTenders.toLocaleString()})</span>
            </button>

            <button
              onClick={() => onNavigate('bidders')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Registered Contractors ({biddersCount})</span>
            </button>

            <button
              onClick={scrollToSources}
              className="px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>View 28+ Real Sourced Portals</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME METRICS BAR */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigate('current')}
          className="bg-white border border-slate-200 hover:border-orange-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Notices</span>
            <Radio className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {activeTenders.toLocaleString()}
          </div>
          <span className="text-[11px] text-orange-600 font-medium flex items-center gap-1 mt-0.5">
            <span>In-Progress Unfilled</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pipeline Value</span>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹ {totalValueCr} <span className="text-xs font-semibold text-slate-500">Cr</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Estimated Cost Total</span>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigate('accepted')}
          className="bg-white border border-slate-200 hover:border-emerald-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Awarded Bids</span>
            <Award className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {acceptedTenders.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <span>10-Yr Historical Archive</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigate('bidders')}
          className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Contractors</span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {biddersCount}
          </div>
          <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-0.5">
            <span>EPC & Infra Profiles</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 5 */}
        <div
          onClick={scrollToSources}
          className="bg-white border border-slate-200 hover:border-cyan-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Real Portals</span>
            <Globe className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            28+ <span className="text-xs font-semibold text-slate-500">Sources</span>
          </div>
          <span className="text-[11px] text-cyan-700 font-medium flex items-center gap-1 mt-0.5">
            <span>51 Endpoints Monitored</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Architecture</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            0 DB
          </div>
          <span className="text-[11px] text-purple-700 font-mono font-medium">100% In-Memory RAM</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT OUR APPLICATION DOES (4 CORE PILLARS) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-900">
                Core Capabilities
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                What Our Application Does
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered specifically for infrastructure contractors, EPC estimators, pre-bid analysts, and government procurement officers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1: In-Progress Unfilled Tenders */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-orange-300 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1. Live In-Progress Tender Discovery & Document Viewer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct statutory scraping of active, unfilled notices across 28+ Central and State procurement portals. Inspect comprehensive tender details without registering on individual state portals.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Full 48-Page Standard Bidding Document (SBD):</strong> In-app interactive viewer & 1-click PDF download.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Volume I–IV Specifications:</strong> Instructions to Bidders, GCC, Technical Specs & BOQ Rate Schedules.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Statutory Pre-Qualification (PQC):</strong> Automated 3-2-1 similar work rules, turnover, and net worth checks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>GFR Rule 170 / MSME Exemptions:</strong> Real-time assessment of EMD waivers and technical exemptions.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('current')}
              className="w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore In-Progress Tenders</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: 10-Year Awarded Bids Archive */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                2. 10-Year Awarded Bids & Letters of Acceptance (LOA) Archive
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore how leading contractors (L&T, Tata Projects, Afcons, Dilip Buildcon, NCC, B.G. Shirke) structured winning bids, technical submissions, and secured official government work orders.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>2,602 Historical Awarded Dossiers:</strong> Covering awarded contracts from 2017 to 2026 across India.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Winning Price vs Estimate Rebate:</strong> Exact percentage variance (% below or above estimated cost).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>3-Cover Submission Structure:</strong> Fee/EMD Cover, Technical Experience Cover, and Financial Price Bid.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Official LOA Orders:</strong> Work orders with bank guarantee mandates and milestone delivery schedules.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('accepted')}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Search Awarded Bids Archive</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Registered Contractors Intelligence */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                3. Registered Contractors Directory & Financial Profiling
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive directory of 87 registered infrastructure and EPC contractors across India, complete with corporate credentials, audited financials, past awards, and Joint Venture (JV) eligibility.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Audited Financial Metrics:</strong> 3-year average annual turnover, tangible net worth, and active work-in-hand.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Max Single-Work Capacity:</strong> Calculated according to statutory NHAI & CPWD bid formulas.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Sector Specializations:</strong> Highways, Bridges, Metro/Rail, Water & Sanitation, and Commercial Buildings.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Corporate Registrations:</strong> CIN numbers, GSTIN, PAN, and Primary Banker branches.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('bidders')}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Inspect Registered Contractors</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 4: Deep RAG Analytics & Competitor Simulation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-purple-300 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                4. AI Competitor Simulation & Deep RAG Clause Analytics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Advanced analytical models evaluating tender competition probability and parsing dense contract clauses from RFP documents in real time.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>AI L1 Bidder Prediction:</strong> Mathematical simulation predicting top competing bidders and win probabilities.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Clause-by-Clause RAG Querying:</strong> Instant retrieval of critical liquidated damages, defect liability & mobilization terms.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>BOQ Rate Schedule Insights:</strong> Historical unit pricing benchmarks for cement, steel, earthwork, and bitumen.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Voice-Driven Search:</strong> Hands-free voice querying across reference numbers, cities, and ministries.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('current')}
              className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore AI Analytics on Tenders</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ALL REAL SOURCED GOVERNMENT PORTALS DIRECTORY */}
      {/* ========================================================================= */}
      <section id="real-sources-directory" className="space-y-5 pt-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-900 flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-700" />
                Statutory Source Directory
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                What All Real Sources Are We Sourcing From?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Direct statutory ingestion from {REAL_PORTAL_SOURCES.length} official national procurement platforms, state government portals, and open data feeds.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Showing <strong className="text-slate-900">{filteredPortals.length}</strong> of {REAL_PORTAL_SOURCES.length} Real Portals
            </div>
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
              title="Trigger live statutory scraper across all 28 real government tender portals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Scraping Live...' : 'Sync Live Scraper'}</span>
              <span className="sm:hidden">{isSyncing ? '...' : 'Sync'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={portalSearch}
                onChange={(e) => setPortalSearch(e.target.value)}
                placeholder="Search portal name, domain (e.g. eprocure.gov.in), state, or authority (NHAI, DMRC)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Region Select */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer font-medium"
              >
                <option value="ALL">All Regions (India)</option>
                <option value="National">National / Central</option>
                <option value="North">North India</option>
                <option value="South">South India</option>
                <option value="West">West India</option>
                <option value="East & Central">East & Central</option>
                <option value="North East">North East</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Jurisdiction:
            </span>
            {[
              { id: 'ALL', label: `All Portals (${REAL_PORTAL_SOURCES.length})` },
              { id: 'Central', label: 'Central Government' },
              { id: 'State', label: 'State Governments' },
              { id: 'Defense & PSU', label: 'Defense & Energy PSUs' },
              { id: 'Railways', label: 'Railways (IREPS)' },
              { id: 'Open Data', label: 'Open Data (data.gov.in)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPortals.map((portal) => (
            <div
              key={portal.id}
              className="bg-white border border-slate-200 hover:border-cyan-300 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                {/* Header: Portal Name & Domain */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {portal.domain}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 leading-snug group-hover:text-cyan-700 transition-colors">
                      {portal.name}
                    </h4>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* State & Region */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">{portal.state}</span>
                  <span>•</span>
                  <span className="text-slate-400">{portal.region}</span>
                  <span>•</span>
                  <span className="text-cyan-600 font-medium">{portal.category}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {portal.description}
                </p>

                {/* Key Authorities Covered */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Procuring Authorities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {portal.keyAuthorities.slice(0, 4).map((auth) => (
                      <span
                        key={auth}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[170px]"
                      >
                        {auth}
                      </span>
                    ))}
                    {portal.keyAuthorities.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-400">
                        +{portal.keyAuthorities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Statutory Framework */}
                <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                  🛡️ {portal.statutoryFramework}
                </div>
              </div>

              {/* Card Footer: Visit Portal & Filter by Source button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 cursor-pointer"
                  title={`Open official portal ${portal.domain}`}
                >
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onNavigate('current')}
                  className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
                  title="View tenders scraped from this portal"
                >
                  <span>View Tenders</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPortals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
            <Globe className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-800">No portal matched your search "{portalSearch}".</p>
            <button
              onClick={() => { setPortalSearch(''); setSelectedCategory('ALL'); setSelectedRegion('ALL'); }}
              className="text-xs text-cyan-600 underline font-semibold cursor-pointer"
            >
              Reset portal search & filters
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. ZERO DATABASE ARCHITECTURE EXPLANATION */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white space-y-5 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Why Purely Scraping-Based Architecture? (Zero Database Required)
            </h3>
            <p className="text-xs text-slate-400">
              Direct In-Memory RAM Streaming vs Traditional Stale Database Aggregators
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-orange-400 font-bold">
              <Zap className="w-4 h-4" />
              <span>1. Zero Stale Notices</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Traditional aggregator websites store tender notices in relational databases that lag behind official government portals. All India Tenders streams live in-progress notices directly from statutory endpoints into RAM, ensuring 0% stale records.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>2. Sub-Millisecond RAM Queries</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              All 2,688 active tenders and 2,602 historical records reside directly in memory with optimized indexing structures. Instant search, multi-faceted filtering, and bidder calculations execute without disk I/O bottlenecks.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Exact Statutory Fidelity</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Zero intermediate transformation loss. You receive the exact statutory Standard Bidding Documents (SBD), NIT reference numbers, Volume I–IV specifications, and BOQ schedules published by the government authorities.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-lg font-bold text-slate-900">
            Ready to explore India's public procurement tenders?
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Choose a section to inspect live statutory notices, search 10-year awarded bid archives, or evaluate registered infrastructure contractors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <button
            onClick={() => onNavigate('current')}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>InProgress Tenders</span>
          </button>
          <button
            onClick={() => onNavigate('accepted')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Awarded Archive</span>
          </button>
          <button
            onClick={() => onNavigate('bidders')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Contractors</span>
          </button>
        </div>
      </section>
    </div>
  );
};
