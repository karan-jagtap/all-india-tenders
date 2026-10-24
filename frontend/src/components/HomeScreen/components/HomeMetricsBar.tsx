import React from 'react';
import { Radio, TrendingDown, Award, Users, Globe, Cpu, ChevronRight } from 'lucide-react';

export interface HomeMetricsBarProps {
  activeTenders: number;
  totalValueCr: string;
  acceptedTenders: number;
  biddersCount: number;
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
  onScrollToSources: () => void;
}

export const HomeMetricsBar: React.FC<HomeMetricsBarProps> = ({
  activeTenders,
  totalValueCr,
  acceptedTenders,
  biddersCount,
  onNavigate,
  onScrollToSources
}) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Metric 1: Live Notices */}
      <div
        onClick={() => onNavigate('current')}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Notices
          </span>
          <Radio className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {activeTenders.toLocaleString()}
        </div>
        <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1 mt-0.5">
          <span>In-Progress Unfilled</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Metric 2: Pipeline Value */}
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pipeline Value
          </span>
          <TrendingDown className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          ₹ {totalValueCr} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cr</span>
        </div>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          Estimated Cost Total
        </span>
      </div>

      {/* Metric 3: Awarded Bids */}
      <div
        onClick={() => onNavigate('accepted')}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Awarded Bids
          </span>
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {acceptedTenders.toLocaleString()}
        </div>
        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
          <span>10-Yr Historical Archive</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Metric 4: Registered Contractors */}
      <div
        onClick={() => onNavigate('bidders')}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Contractors
          </span>
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {biddersCount}
        </div>
        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-0.5">
          <span>EPC & Infra Profiles</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Metric 5: Real Portals */}
      <div
        onClick={onScrollToSources}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Real Portals
          </span>
          <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          28+ <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sources</span>
        </div>
        <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium flex items-center gap-1 mt-0.5">
          <span>51 Endpoints Monitored</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Metric 6: Architecture */}
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Architecture
          </span>
          <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          0 DB
        </div>
        <span className="text-[11px] text-purple-700 dark:text-purple-400 font-mono font-medium">
          100% In-Memory RAM
        </span>
      </div>
    </section>
  );
};
