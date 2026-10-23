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

      {/* Metric 2: Pipeline Value */}
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

      {/* Metric 3: Awarded Bids */}
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

      {/* Metric 4: Registered Contractors */}
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

      {/* Metric 5: Real Portals */}
      <div
        onClick={onScrollToSources}
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

      {/* Metric 6: Architecture */}
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
  );
};
