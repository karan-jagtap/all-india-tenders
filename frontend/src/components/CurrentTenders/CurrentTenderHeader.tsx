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
  Download
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
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
              IN PROGRESS • UNFILLED
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs font-mono text-slate-700">
              <span>Ref: {selectedTender.nit_number}</span>
              <button
                onClick={(e) => onCopyNit(selectedTender.nit_number, e)}
                title="Copy Tender Reference ID"
                className="hover:text-blue-700 transition-colors p-0.5 rounded hover:bg-slate-200 cursor-pointer"
              >
                {copiedNit === selectedTender.nit_number ? (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Copied!
                  </span>
                ) : (
                  <Copy className="w-3 h-3 text-slate-500" />
                )}
              </button>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
              {selectedTender.source_portal}
            </span>
            {(selectedTender.is_ogd_open_data || selectedTender.source_portal.includes('data.gov.in')) && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center gap-1 shadow-2xs">
                🏛️ data.gov.in Open Data Feed • GODL Licensed
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {selectedTender.title}
          </h3>
        </div>

        {/* Actions: View Whole Doc, Download Whole Doc, Portal Link, NIT Summary, and BOQ */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* PRIMARY: View Whole Tender Document In-App */}
          <button
            onClick={onOpenWholeDoc}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ring-1 ring-indigo-400/30"
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
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Download Full 48-Page Standard Bidding Document (SBD / RFP - 3.8 MB PDF)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Whole Doc</span>
            <span className="text-[9px] bg-emerald-900/80 px-1 py-0.2 rounded font-mono">3.8 MB</span>
          </a>

          {selectedTender.portal_url && (
            <button
              onClick={(e) => onOpenPortalBridge(selectedTender, e)}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Navigate to Exact Tender on Official Portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Portal Bridge ↗</span>
            </button>
          )}

          {/* Secondary Action: NIT Summary PDF */}
          <a
            href={nitPdfUrl}
            download={`${selectedTender.id}_NIT_Notice.pdf`}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            title="Download Official Notice Inviting Tender (NIT Summary)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>NIT</span>
          </a>

          {/* Tertiary Action: BOQ Rate Schedule */}
          <a
            href={boqUrl}
            download={`${selectedTender.id}_Bill_of_Quantities_BOQ.csv`}
            className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            title="Download Official Bill of Quantities (BOQ Rate Schedule)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>BOQ</span>
          </a>
        </div>
      </div>

      {/* In-Progress Notification Callout */}
      <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 rounded-lg border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Tender is actively in progress (Not Yet Filled / Unawarded):</span>
          <p className="text-[11px] text-emerald-900 mt-0.5">
            The procuring authority ({selectedTender.organization}) is actively inviting competitive bids until{' '}
            <strong>{selectedTender.closing_date} at {selectedTender.submission_deadline_time}</strong>. Zero contracts have been finalized.
          </p>
        </div>
      </div>

      {/* Critical Countdown & Deadline Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 p-3 rounded-lg border border-orange-200 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600 shrink-0" />
          <div>
            <div className="font-bold text-orange-950 flex items-center gap-1.5">
              <span>Bid Submission Deadline:</span>
              <span className="font-mono text-rose-700">{selectedTender.closing_date} at {selectedTender.submission_deadline_time}</span>
            </div>
            <div className="text-[11px] text-orange-800">
              {selectedTender.days_left > 0 ? (
                <span>⚡ Exactly <strong>{selectedTender.days_left} calendar days left</strong> before submission window closes.</span>
              ) : (
                <span className="text-rose-700 font-bold">Closing today! Final hours.</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-orange-700 uppercase font-semibold block">Procuring Entity</span>
          <span className="font-bold text-slate-900 text-xs truncate max-w-[260px] block" title={selectedTender.organization}>
            {selectedTender.organization}
          </span>
        </div>
      </div>

      {/* Quick Parameters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-1 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Project Cost</span>
          <span className="font-bold text-slate-900 block">
            {selectedTender.estimated_cost_inr ? formatINR(selectedTender.estimated_cost_inr) : 'Refer to Notice'}
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">EMD Required</span>
          <span className="font-bold text-purple-700 block">
            {selectedTender.emd_amount_inr ? formatINR(selectedTender.emd_amount_inr) : 'Exempt / GFR 170'}
          </span>
          <span className="text-[9px] text-emerald-700 font-semibold block mt-0.5">MSEs 100% Exempt</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tender Document Fee</span>
          <span className="font-bold text-slate-800 block">
            {selectedTender.tender_fee_inr ? formatINR(selectedTender.tender_fee_inr) : '₹ 0 (Free)'}
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Performance Guarantee</span>
          <span className="font-bold text-blue-700 block">
            {selectedTender.pbg_pct ? `${selectedTender.pbg_pct}% PBG` : '3-5% PBG'}
          </span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => setActiveSubTab('specs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'specs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Scope of Work & NIT Specs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pqc')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'pqc'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>2. Pre-Qualification Criteria (PQC)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('msme')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'msme'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>3. GFR Rule 170 MSME Exemptions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pdf')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'pdf'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>4. Official Tender Documents (NIT, SBD & BOQ)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-600 text-white">
            3 Docs
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('scraping')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'scraping'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ServerOff className="w-3.5 h-3.5 text-orange-400" />
          <span>5. Scraping & 0-DB Architecture</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prediction')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'prediction'
              ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white shadow-sm ring-1 ring-amber-400'
              : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 font-bold'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${activeSubTab === 'prediction' ? 'text-amber-200' : 'text-amber-600'} animate-pulse`} />
          <span>6. ⚡ Competitor Bids & L1 Prediction (AI Simulator)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rag_analysis')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'rag_analysis'
              ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-indigo-50 text-indigo-900 border border-indigo-300 hover:bg-indigo-100 font-bold'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeSubTab === 'rag_analysis' ? 'text-indigo-200' : 'text-indigo-600'} animate-pulse`} />
          <span>7. 🔍 Deep RAG Clause Analysis & BOQ Cost Insights</span>
        </button>
      </div>
    </div>
  );
};
