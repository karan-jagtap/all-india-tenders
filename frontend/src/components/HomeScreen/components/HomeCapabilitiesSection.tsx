import React from 'react';
import { Radio, Award, Users, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export interface HomeCapabilitiesSectionProps {
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
}

export const HomeCapabilitiesSection: React.FC<HomeCapabilitiesSectionProps> = ({ onNavigate }) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60">
              Core Capabilities
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              What Our Application Does
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Engineered specifically for infrastructure contractors, EPC estimators, pre-bid analysts, and government procurement officers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: In-Progress Unfilled Tenders */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-orange-400/80 dark:hover:border-orange-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1. Live In-Progress Tender Discovery & Document Viewer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Direct statutory scraping of active, unfilled notices across 28+ Central and State procurement portals. Inspect comprehensive tender details without registering on individual state portals.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Full 48-Page Standard Bidding Document (SBD):</strong> In-app interactive viewer & 1-click PDF download.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Volume I–IV Specifications:</strong> Instructions to Bidders, GCC, Technical Specs & BOQ Rate Schedules.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Statutory Pre-Qualification (PQC):</strong> Automated 3-2-1 similar work rules, turnover, and net worth checks.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>GFR Rule 170 / MSME Exemptions:</strong> Real-time assessment of EMD waivers and technical exemptions.</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('current')}
            className="w-full py-2.5 px-4 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Explore In-Progress Tenders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 2: 17-Year Awarded Bids Archive */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-emerald-400/80 dark:hover:border-emerald-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              2. 17-Year Awarded Bids & Letters of Acceptance (LOA) Archive
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore how leading contractors (L&T, Tata Projects, Afcons, Dilip Buildcon, NCC, B.G. Shirke) structured winning bids, technical submissions, and secured official government work orders.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>4,350+ Historical Awarded Dossiers:</strong> Covering awarded contracts from 2010 to 2026 across India.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Winning Price vs Estimate Rebate:</strong> Exact percentage variance (% below or above estimated cost).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>3-Cover Submission Structure:</strong> Fee/EMD Cover, Technical Experience Cover, and Financial Price Bid.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Official LOA Orders:</strong> Work orders with bank guarantee mandates and milestone delivery schedules.</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('accepted')}
            className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Search Awarded Bids Archive</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 3: Registered Contractors Intelligence */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-blue-400/80 dark:hover:border-blue-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              3. Registered Contractors Directory & Financial Profiling
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Comprehensive directory of 87 registered infrastructure and EPC contractors across India, complete with corporate credentials, audited financials, past awards, and Joint Venture (JV) eligibility.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Audited Financial Metrics:</strong> 3-year average annual turnover, tangible net worth, and active work-in-hand.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Max Single-Work Capacity:</strong> Calculated according to statutory NHAI & CPWD bid formulas.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Sector Specializations:</strong> Highways, Bridges, Metro/Rail, Water & Sanitation, and Commercial Buildings.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Corporate Registrations:</strong> CIN numbers, GSTIN, PAN, and Primary Banker branches.</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('bidders')}
            className="w-full py-2.5 px-4 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Inspect Registered Contractors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 4: Deep RAG Analytics & Competitor Simulation */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-purple-400/80 dark:hover:border-purple-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              4. AI Competitor Simulation & Deep RAG Clause Analytics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Advanced analytical models evaluating tender competition probability and parsing dense contract clauses from RFP documents in real time.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>AI L1 Bidder Prediction:</strong> Mathematical simulation predicting top competing bidders and win probabilities.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Clause-by-Clause RAG Querying:</strong> Instant retrieval of critical liquidated damages, defect liability & mobilization terms.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>BOQ Rate Schedule Insights:</strong> Historical unit pricing benchmarks for cement, steel, earthwork, and bitumen.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Voice-Driven Search:</strong> Hands-free voice querying across reference numbers, cities, and ministries.</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('current')}
            className="w-full py-2.5 px-4 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Explore AI Analytics on Tenders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
