import React from 'react';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { PortalSourceInfo } from '../../../constants/portalSources';

export interface PortalSourceCardProps {
  portal: PortalSourceInfo;
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
}

export const PortalSourceCard: React.FC<PortalSourceCardProps> = ({ portal, onNavigate }) => {
  return (
    <div className="bg-white border border-slate-200 hover:border-cyan-300 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group">
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

        {/* State, Region & Category */}
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
  );
};
