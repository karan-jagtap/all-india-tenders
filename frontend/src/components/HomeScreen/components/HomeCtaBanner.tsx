import React from 'react';
import { Radio, Award, Users } from 'lucide-react';

export interface HomeCtaBannerProps {
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
}

export const HomeCtaBanner: React.FC<HomeCtaBannerProps> = ({ onNavigate }) => {
  return (
    <section className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
      <div className="space-y-1.5 text-center sm:text-left">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Ready to explore India's public procurement tenders?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
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
  );
};
