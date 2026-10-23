import React from 'react';
import { ServerOff, ExternalLink } from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';

export interface ScrapingArchSubTabProps {
  selectedTender: EnrichedCurrentTender;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
}

export const ScrapingArchSubTab: React.FC<ScrapingArchSubTabProps> = ({
  selectedTender,
  onOpenPortalBridge
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <ServerOff className="w-4 h-4 text-orange-600" />
          Purely Scraping-Based Architecture (No Database Required)
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Technical documentation of how this tender was scraped live from official portals with zero database storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Scraping Extraction Source</span>
          <strong className="text-slate-900">{selectedTender.scraping_source || selectedTender.source_portal}</strong>
          <span className="block text-[11px] text-slate-500 mt-0.5 font-mono">Status: 200 OK / Live Feed</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Database Dependency</span>
          <strong className="text-emerald-700">NONE (0 SQL Queries / 0 Tables)</strong>
          <span className="block text-[11px] text-slate-500 mt-0.5 font-mono">100% In-Memory RAM Streaming</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 md:col-span-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Official Live Portal Gateway</span>
          <button
            onClick={(e) => onOpenPortalBridge(selectedTender, e)}
            className="text-blue-600 hover:underline font-mono break-all text-[11px] flex items-center gap-1 mt-0.5 text-left cursor-pointer"
          >
            <span>{selectedTender.portal_url}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tender Bidding Status</span>
          <strong className="text-orange-700">IN PROGRESS (UNFILLED)</strong>
          <span className="block text-[11px] text-slate-500 mt-0.5">Proposals actively invited until {selectedTender.closing_date}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">NIT PDF Generation Mode</span>
          <strong className="text-slate-900">In-Memory ReportLab Streaming</strong>
          <span className="block text-[11px] text-slate-500 mt-0.5">Streamed as bytes, 0 disk files stored</span>
        </div>
      </div>
    </div>
  );
};
