import React from 'react';
import {
  Clock,
  ExternalLink,
  BookOpen,
  FileText,
  FileSpreadsheet,
  CheckCircle,
  Copy,
  Check,
  ShieldAlert,
  ServerOff,
  Zap,
  Sparkles,
  Eye,
  Download,
  Building2,
  MapPin,
  Globe,
  Shield
} from 'lucide-react';
import { EnrichedCurrentTender } from '../../types';
import { formatINR } from '../../utils';

export type SubTabType = 'specs' | 'pqc' | 'msme' | 'pdf' | 'scraping' | 'prediction' | 'rag_analysis';

export interface CurrentTenderHeaderProps {
  selectedTender: EnrichedCurrentTender;
  onCopyNit: (nit: string, e?: React.MouseEvent) => void;
  copiedNit: string | null;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
  onOpenWholeDoc: () => void;
  activeSubTab: SubTabType;
  setActiveSubTab: (tab: SubTabType) => void;
  sbdUrl: string;
  nitPdfUrl: string;
  boqUrl: string;
}

export const CurrentTenderHeader: React.FC<CurrentTenderHeaderProps> = ({
  selectedTender,
  onCopyNit,
  copiedNit,
  onOpenPortalBridge,
  onOpenWholeDoc,
  activeSubTab,
  setActiveSubTab,
  sbdUrl,
  nitPdfUrl,
  boqUrl
}) => {
  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs transition-colors">
      {/* Top Meta Badges Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Status Badge */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 shadow-2xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
          <span>IN PROGRESS • UNFILLED</span>
        </span>

        {/* Reference ID Pill */}
        <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">
          <span className="text-slate-400 font-sans text-[11px] font-medium">Ref:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{selectedTender.nit_number}</span>
          <button
            onClick={(e) => onCopyNit(selectedTender.nit_number, e)}
            title="Copy Tender Reference ID"
            className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer ml-0.5"
          >
            {copiedNit === selectedTender.nit_number ? (
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 font-sans">
                <Check className="w-3 h-3" /> Copied!
              </span>
            ) : (
              <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
            )}
          </button>
        </div>

        {/* Source Portal Badge */}
        <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 font-medium whitespace-nowrap shrink-0">
          <Globe className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          <span>{selectedTender.source_portal}</span>
        </span>

        {/* Procurement / Tender Type Badge */}
        {selectedTender.tender_type && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900/50 font-medium whitespace-nowrap shrink-0">
            <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>{selectedTender.tender_type}</span>
          </span>
        )}

        {/* OGD / data.gov.in Badge */}
        {(selectedTender.is_ogd_open_data || selectedTender.source_portal?.includes('data.gov.in')) && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/50 shadow-2xs whitespace-nowrap shrink-0">
            <span>🏛️ data.gov.in Feed • GODL</span>
          </span>
        )}
      </div>

      {/* Tender Title & Authority Subtitle (Full-Width, Spacious) */}
      <div className="mb-3.5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
          {selectedTender.title}
        </h2>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{selectedTender.organization}</span>
          </span>
          {selectedTender.ministry && selectedTender.ministry !== selectedTender.organization && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>{selectedTender.ministry}</span>
            </>
          )}
          {(selectedTender.city || selectedTender.state) && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{[selectedTender.city, selectedTender.state].filter(Boolean).join(', ')}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Primary Document Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PRIMARY: View Whole Tender Document In-App */}
          <button
            onClick={onOpenWholeDoc}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ring-1 ring-indigo-400/30"
            title="Open Whole 48-Page Standard Bidding Document in interactive viewer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Whole Tender Doc</span>
            <span className="text-[9px] bg-indigo-900/80 px-1.5 py-0.2 rounded font-mono">
              Interactive
            </span>
          </button>

          {/* PRIMARY: Download Whole Tender Document (SBD / RFP) */}
          <a
            href={sbdUrl}
            download={`${selectedTender.id}_Whole_Tender_Document_SBD.pdf`}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Download Full 48-Page Standard Bidding Document (SBD / RFP - 3.8 MB PDF)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Whole Doc</span>
            <span className="text-[9px] bg-emerald-900/80 px-1 py-0.2 rounded font-mono">3.8 MB</span>
          </a>
        </div>

        {/* Secondary Document & External Portal Links */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedTender.portal_url && (
            <button
              onClick={(e) => onOpenPortalBridge(selectedTender, e)}
              className="px-3 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Navigate to Exact Tender on Official Portal"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Portal Bridge ↗</span>
            </button>
          )}

          {/* Secondary Action: NIT Summary PDF */}
          <a
            href={nitPdfUrl}
            download={`${selectedTender.id}_NIT_Notice.pdf`}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
            title="Download Official Notice Inviting Tender (NIT Summary)"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>NIT Notice</span>
          </a>

          {/* Tertiary Action: BOQ Rate Schedule */}
          <a
            href={boqUrl}
            download={`${selectedTender.id}_Bill_of_Quantities_BOQ.csv`}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
            title="Download Official Bill of Quantities (BOQ Rate Schedule)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>BOQ Schedule</span>
          </a>
        </div>
      </div>

      {/* In-Progress Notification Callout */}
      <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-900/20 rounded-lg border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Tender is actively in progress (Not Yet Filled / Unawarded):</span>
          <p className="text-[11px] text-emerald-900 dark:text-emerald-300 mt-0.5">
            The procuring authority ({selectedTender.organization}) is actively inviting competitive bids until{' '}
            <strong>{selectedTender.closing_date} at {selectedTender.submission_deadline_time}</strong>. Zero contracts have been finalized.
          </p>
        </div>
      </div>

      {/* Critical Countdown & Deadline Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-900/20 p-3 rounded-lg border border-orange-200 dark:border-amber-900/50 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
          <div>
            <div className="font-bold text-orange-950 dark:text-orange-200 flex items-center gap-1.5">
              <span>Bid Submission Deadline:</span>
              <span className="font-mono text-rose-700 dark:text-rose-400">{selectedTender.closing_date} at {selectedTender.submission_deadline_time}</span>
            </div>
            <div className="text-[11px] text-orange-800 dark:text-orange-300">
              {selectedTender.days_left > 0 ? (
                <span>⚡ Exactly <strong>{selectedTender.days_left} calendar days left</strong> before submission window closes.</span>
              ) : (
                <span className="text-rose-700 dark:text-rose-400 font-bold">Closing today! Final hours.</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-orange-700 dark:text-orange-400 uppercase font-semibold block">Procuring Entity</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[260px] block" title={selectedTender.organization}>
            {selectedTender.organization}
          </span>
        </div>
      </div>

      {/* Quick Parameters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-1 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Project Cost</span>
          <span className="font-bold text-slate-900 dark:text-white block font-mono">
            {selectedTender.estimated_cost_inr ? formatINR(selectedTender.estimated_cost_inr) : 'Refer to Notice'}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">EMD Required</span>
          <span className="font-bold text-purple-700 dark:text-purple-400 block font-mono">
            {selectedTender.emd_amount_inr ? formatINR(selectedTender.emd_amount_inr) : 'Exempt / GFR 170'}
          </span>
          <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">MSEs 100% Exempt</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tender Document Fee</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 block font-mono">
            {selectedTender.tender_fee_inr ? formatINR(selectedTender.tender_fee_inr) : '₹ 0 (Free)'}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Performance Guarantee</span>
          <span className="font-bold text-blue-700 dark:text-blue-400 block font-mono">
            {selectedTender.pbg_pct ? `${selectedTender.pbg_pct}% PBG` : '3-5% PBG'}
          </span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex overflow-x-auto pb-1 no-scrollbar sm:flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('specs')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'specs'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Scope of Work & NIT Specs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pqc')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'pqc'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>2. Pre-Qualification Criteria (PQC)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('msme')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'msme'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>3. GFR Rule 170 MSME Exemptions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pdf')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'pdf'
              ? 'bg-indigo-900 dark:bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-900/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>4. Official Tender Documents (NIT, SBD & BOQ)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-600 dark:bg-indigo-500 text-white">
            3 Docs
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('scraping')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'scraping'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ServerOff className="w-3.5 h-3.5 text-orange-400" />
          <span>5. Scraping & 0-DB Architecture</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prediction')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'prediction'
              ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white shadow-sm ring-1 ring-amber-400'
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-bold'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${activeSubTab === 'prediction' ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'} animate-pulse`} />
          <span>6. ⚡ Competitor Bids & L1 Prediction (AI Simulator)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rag_analysis')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'rag_analysis'
              ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-bold'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeSubTab === 'rag_analysis' ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'} animate-pulse`} />
          <span>7. 🔍 Deep RAG Clause Analysis & BOQ Cost Insights</span>
        </button>
      </div>
    </div>
  );
};
