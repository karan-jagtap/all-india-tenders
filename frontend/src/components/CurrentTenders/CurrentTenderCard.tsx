import React from 'react';
import { Calendar, Building2, MapPin, ChevronRight, Copy, Check, Download } from 'lucide-react';
import { EnrichedCurrentTender } from '../../types';
import { formatINR, getUrgencyBadge } from '../../utils';

export interface CurrentTenderCardProps {
  tender: EnrichedCurrentTender;
  isSelected: boolean;
  onSelect: () => void;
  onCopyNit: (nit: string, e: React.MouseEvent) => void;
  copiedNit: string | null;
}

export const CurrentTenderCard: React.FC<CurrentTenderCardProps> = ({
  tender,
  isSelected,
  onSelect,
  onCopyNit,
  copiedNit
}) => {
  const sourceLabel = tender._sourceLabel;

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl p-4 border transition-all text-xs relative ${
        isSelected
          ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
      }`}
    >
      {/* 1. Line 1: In Progress & Days Left badges (Left) + Close Date (Right Aligned) */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            IN PROGRESS (UNFILLED)
          </span>
          {getUrgencyBadge(tender.days_left)}
        </div>
        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
          <Calendar className="w-3 h-3" />
          <span>Closes: {tender.closing_date}</span>
        </span>
      </div>

      {/* 2. Line 2: Source portal badge */}
      <div className="flex items-center gap-1.5 mb-2 text-xs">
        <span
          title={tender.source_portal}
          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[240px]"
        >
          {sourceLabel}
        </span>
        {(tender.is_ogd_open_data || tender.source_portal.includes('data.gov.in')) && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center gap-1 shadow-2xs shrink-0">
            🏛️ data.gov.in (OGD)
          </span>
        )}
      </div>

      <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 mb-1.5">
        {tender.title}
      </h3>

      <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="truncate">{tender.organization}</span>
      </div>

      {/* Location badge & Scraping Origin */}
      <div className="text-[10px] text-slate-600 mb-2 flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 bg-rose-50/70 border border-rose-200/70 px-2 py-0.5 rounded-md text-[10px]">
          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
          <span className="font-semibold text-slate-800">{tender.state}</span>
          <span className="text-slate-300">•</span>
          <span className="text-rose-700 font-medium">{tender.city}</span>
        </span>
        <span className="inline-flex items-center gap-1 bg-blue-50/70 border border-blue-200/70 px-2 py-0.5 rounded-md text-[10px] text-blue-800 font-medium truncate max-w-[170px]">
          {tender.category}
        </span>
        <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded text-[9px] text-indigo-700 font-semibold">
          📑 SBD & NIT Docs
        </span>
        <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[9px] text-slate-600 font-mono">
          0 DB • RAM
        </span>
      </div>

      {/* Financial Metrics Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[10px]">Estimated Cost</span>
          <strong className="text-slate-900 font-bold">
            {tender.estimated_cost_inr ? formatINR(tender.estimated_cost_inr) : 'Refer to NIT'}
          </strong>
        </div>

        <div className="text-right">
          <span className="text-slate-400 block text-[10px]">EMD Amount</span>
          <span className="text-purple-700 font-bold">
            {tender.emd_amount_inr ? formatINR(tender.emd_amount_inr) : 'Exempt / Nil'}
          </span>
        </div>
      </div>

      {/* Unfilled Bidding Callout & Quick Whole Doc Download */}
      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 gap-1.5 flex-wrap">
        <span
          onClick={(e) => onCopyNit(tender.nit_number, e)}
          title="Click to copy NIT Reference Number"
          className="font-mono text-slate-500 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-slate-200 transition-colors"
        >
          {copiedNit === tender.nit_number ? (
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Copied!
            </span>
          ) : (
            <>
              <Copy className="w-2.5 h-2.5 text-slate-400" />
              <span>{tender.nit_number}</span>
            </>
          )}
        </span>

        <div className="flex items-center gap-1.5">
          <a
            href={`/api/current-tenders/${tender.id}/tender-document`}
            download={`${tender.id}_Whole_Tender_Document_SBD.pdf`}
            onClick={(e) => e.stopPropagation()}
            title="Download Whole 48-Page Standard Bidding Document (PDF)"
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Download className="w-2.5 h-2.5" />
            <span>Whole Doc</span>
          </a>
          <span className="text-orange-700 font-medium">Bids Open</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
