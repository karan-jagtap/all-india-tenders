import React, { useState } from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  Landmark, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';

export interface PQCSubTabProps {
  selectedTender: EnrichedCurrentTender;
}

export const PQCSubTab: React.FC<PQCSubTabProps> = ({ selectedTender }) => {
  const [showFullClauses, setShowFullClauses] = useState(false);

  const estCost = selectedTender.estimated_cost_inr || 0;

  // Extract primary amounts using regex or calculated fallbacks
  const extractAmount = (text?: string, fallbackMultiplier?: number): string => {
    if (text) {
      const match = text.match(/₹\s*([0-9.,]+(?:\s*(?:Cr|Crore|Lakh|Lakhs))?)/i);
      if (match) return `₹ ${match[1].trim()}`;
    }
    if (estCost && fallbackMultiplier) {
      const val = estCost * fallbackMultiplier;
      return val >= 10000000 
        ? `₹ ${(val / 10000000).toFixed(2)} Cr` 
        : `₹ ${(val / 100000).toFixed(2)} Lakh`;
    }
    return 'As per NIT';
  };

  const extractExpAmounts = (text?: string) => {
    if (text) {
      const matches = Array.from(text.matchAll(/₹\s*([0-9.,]+(?:\s*(?:Cr|Crore|Lakh|Lakhs))?)/gi));
      if (matches.length >= 3) {
        return {
          work3: `₹ ${matches[0][1].trim()}`,
          work2: `₹ ${matches[1][1].trim()}`,
          work1: `₹ ${matches[2][1].trim()}`,
          headline: `₹ ${matches[2][1].trim()}`
        };
      }
      if (matches.length === 1) {
        const val = `₹ ${matches[0][1].trim()}`;
        return { work3: val, work2: val, work1: val, headline: val };
      }
    }
    const fmt = (v: number) => v >= 10000000 ? `₹ ${(v / 10000000).toFixed(2)} Cr` : `₹ ${(v / 100000).toFixed(2)} Lakh`;
    return {
      work3: fmt(estCost * 0.4),
      work2: fmt(estCost * 0.5),
      work1: fmt(estCost * 0.8),
      headline: fmt(estCost * 0.8)
    };
  };

  const turnoverAmount = extractAmount(selectedTender.turnover_criteria, 0.4);
  const solvencyAmount = extractAmount(selectedTender.solvency_criteria, 0.2);
  const expAmounts = extractExpAmounts(selectedTender.experience_criteria);

  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-5 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            Pre-Qualification & Eligibility Criteria (PQC)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mandatory Cover-2 qualification thresholds required before price bid opening.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Cover-2 Mandatory
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            GFR 2017
          </span>
        </div>
      </div>

      {/* 3 Simpler Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Annual Turnover */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                Annual Turnover
              </span>
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {turnoverAmount}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Min. average annual turnover (40%)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-[11px] text-blue-800 dark:text-blue-300">
            <span>Period: Past 3 Audited FY</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">CA UDIN</span>
          </div>
        </div>

        {/* Card 2: Bank Solvency */}
        <div className="rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 p-4 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                Bank Solvency
              </span>
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {solvencyAmount}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Banker's Solvency Certificate (20%)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between text-[11px] text-purple-800 dark:text-purple-300">
            <span>Issuer: Scheduled Bank</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Form C</span>
          </div>
        </div>

        {/* Card 3: Similar Work Experience */}
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-800 transition-all shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Similar Work (3-2-1)
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {expAmounts.headline}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
              1 work @ 80% or equivalent past 7 yrs
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
            <span>2 works: {expAmounts.work2}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">3 works: {expAmounts.work3}</span>
          </div>
        </div>
      </div>

      {/* Expandable Detailed Statutory NIT Clauses */}
      <div className="pt-1">
        <button
          onClick={() => setShowFullClauses(!showFullClauses)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showFullClauses ? 'Hide Detailed Legal NIT Clauses' : 'View Detailed Legal NIT Clauses & Criteria Text'}</span>
          {showFullClauses ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFullClauses && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-2.5 text-xs animate-fadeIn">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Turnover Clause:</span>
              <p className="text-slate-600 dark:text-slate-400">{selectedTender.turnover_criteria || 'As per NIT'}</p>
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Bank Solvency Clause:</span>
              <p className="text-slate-600 dark:text-slate-400">{selectedTender.solvency_criteria || 'As per NIT'}</p>
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Work Experience Clause:</span>
              <p className="text-slate-600 dark:text-slate-400">{selectedTender.experience_criteria || 'As per NIT'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
