import React from 'react';
import { Calendar, Building2, MapPin, Copy, Check, Download } from 'lucide-react';
import { EnrichedCurrentTender } from '../../types';
import { formatINR, getUrgencyBadge, formatDate } from '../../utils';

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
  const todayStr = new Date().toISOString().split('T')[0];
  const isClosed = (tender.days_left !== undefined && tender.days_left <= 0) || (Boolean(tender.closing_date) && tender.closing_date < todayStr);

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl p-4 border transition-all text-xs relative hover:z-20 ${
        isSelected
          ? 'bg-white dark:bg-[#131A2B] border-orange-500 dark:border-orange-500 shadow-md ring-1 ring-orange-500 z-10'
          : isClosed
          ? 'bg-slate-50/60 dark:bg-[#0E1422]/60 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-[#131A2B]/60 shadow-[0_1px_3px_rgba(15,23,42,0.02)] opacity-90'
          : 'bg-white dark:bg-[#0E1422] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-[#131A2B]/60 shadow-[0_1px_3px_rgba(15,23,42,0.03)]'
      }`}
    >
      {/* 1. Line 1: In Progress & Days Left badges + Close Date (Responsive wrapping) */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {isClosed ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              UNDER EVALUATION
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              IN PROGRESS (OPEN)
            </span>
          )}
          {getUrgencyBadge(tender.days_left, isClosed)}
        </div>

        {/* Date with Explanatory Tooltip */}
        <div className="relative group/date shrink-0">
          <div
            className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 cursor-help hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-0.5 px-1 rounded hover:bg-orange-50/70 dark:hover:bg-orange-950/40"
          >
            <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover/date:text-orange-500" />
            <span className="border-b border-dotted border-slate-300 dark:border-slate-700 group-hover/date:border-orange-500">
              {isClosed ? 'Closed:' : 'Closes:'} {formatDate(tender.closing_date)}
            </span>
          </div>

          {/* Floating Tooltip Card */}
          <div
            role="tooltip"
            className="absolute right-0 top-full mt-1.5 w-64 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-slate-700/90 backdrop-blur-md opacity-0 invisible group-hover/date:opacity-100 group-hover/date:visible transition-all duration-200 pointer-events-none z-50 text-[10px]"
          >
            {/* Header */}
            <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="font-bold text-xs text-white">
                {isClosed ? 'Bid Submission Closed' : 'Bid Submission Deadline'}
              </span>
            </div>

            {/* Explanation of what the date is for */}
            <p className="text-slate-300 leading-relaxed">
              {isClosed
                ? 'This date is the official bid submission cutoff that has elapsed. The tender is now under technical evaluation.'
                : 'This date is the final deadline to submit commercial and technical bids online before the official portal closes.'}
            </p>

            {/* Key Schedule Timestamps */}
            <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Closing Date:</span>
                <span className="text-amber-300 font-bold">{formatDate(tender.closing_date)}</span>
              </div>
              {tender.submission_deadline_time && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cutoff Time:</span>
                  <span className="text-slate-200 font-semibold">{tender.submission_deadline_time}</span>
                </div>
              )}
              {tender.published_date && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Notice Published:</span>
                  <span className="text-slate-300">{formatDate(tender.published_date)}</span>
                </div>
              )}
              {tender.opening_date && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bid Opening:</span>
                  <span className="text-emerald-300">{formatDate(tender.opening_date)}</span>
                </div>
              )}
            </div>

            {/* Little top arrow */}
            <div className="absolute right-4 -top-1 w-2 h-2 bg-slate-900/95 dark:bg-slate-950/95 border-l border-t border-slate-700/90 transform rotate-45" />
          </div>
        </div>
      </div>

      {/* 2. Line 2: Source portal badge */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2 text-xs">
        <span
          title={tender.source_portal}
          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 break-words"
        >
          {sourceLabel}
        </span>
        {tender.source_portal.includes('gem.gov.in') && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 shadow-2xs">
            ⚡ GeM Portal
          </span>
        )}
        {(tender.is_ogd_open_data || tender.source_portal.includes('data.gov.in')) && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 flex items-center gap-1 shadow-2xs">
            🏛️ data.gov.in (OGD)
          </span>
        )}
      </div>

      {/* 3. Full Tender Title (Whole text displayed, zero cutoff) */}
      <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug break-words mb-2">
        {tender.title}
      </h3>

      {/* 4. Procuring Authority (Whole text displayed) */}
      <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-2 flex items-start gap-1.5">
        <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
        <span className="break-words font-medium">{tender.organization}</span>
      </div>

      {/* Location badge & Scraping Origin */}
      <div className="text-[10px] text-slate-600 dark:text-slate-400 mb-2.5 flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/60 px-2 py-0.5 rounded-md text-[10px]">
          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{tender.state}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-rose-700 dark:text-rose-400 font-medium">{tender.city}</span>
        </span>
        <span className="inline-flex items-center gap-1 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 px-2 py-0.5 rounded-md text-[10px] text-blue-800 dark:text-blue-300 font-medium break-words">
          {tender.category}
        </span>
        <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 px-1.5 py-0.5 rounded text-[9px] text-indigo-700 dark:text-indigo-300 font-semibold">
          📑 SBD & NIT Docs
        </span>
      </div>

      {/* Financial Metrics Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Estimated Cost</span>
          <strong className="text-slate-900 dark:text-white font-bold font-mono">
            {tender.estimated_cost_inr ? formatINR(tender.estimated_cost_inr) : 'Refer to NIT'}
          </strong>
        </div>

        <div className="text-right">
          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">EMD Amount</span>
          <span className="text-purple-700 dark:text-purple-400 font-bold font-mono">
            {tender.emd_amount_inr ? formatINR(tender.emd_amount_inr) : 'Exempt / Nil'}
          </span>
        </div>
      </div>

      {/* Unfilled Bidding Callout & Quick Whole Doc Download */}
      <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 gap-1.5 flex-wrap">
        <span
          onClick={(e) => onCopyNit(tender.nit_number, e)}
          title="Click to copy NIT Reference Number"
          className="font-mono text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 transition-colors"
        >
          {copiedNit === tender.nit_number ? (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Copied!
            </span>
          ) : (
            <>
              <Copy className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
              <span>{tender.nit_number}</span>
            </>
          )}
        </span>

        <div className="flex items-center gap-1.5">
          <a
            href={`/api/current-tenders/${tender.id}/tender-document`}
            download={`${tender.id}_Whole_Tender_Document_SBD.pdf`}
            onClick={(e) => e.stopPropagation()}
            title="Download Whole 4-Page Standard Bidding Document (PDF)"
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Download className="w-2.5 h-2.5" />
            <span>[RAG] Whole Doc</span>
          </a>
          <span className={isClosed ? "text-slate-500 dark:text-slate-400 font-medium" : "text-orange-700 dark:text-orange-400 font-medium"}>
            {isClosed ? "Bids Closed" : "Bids Open"}
          </span>
        </div>
      </div>
    </div>
  );
};
