import React, { useEffect } from 'react';
import {
  BookOpen,
  Download,
  ExternalLink,
  X,
  Building2,
  ShieldCheck,
  Layers,
  Clock
} from 'lucide-react';
import { EnrichedCurrentTender } from '../../types';
import { formatINR } from '../../utils';

export interface WholeTenderDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender | null;
  sbdUrl: string;
}

export const WholeTenderDocModal: React.FC<WholeTenderDocModalProps> = ({
  isOpen,
  onClose,
  tender,
  sbdUrl
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !tender) return null;

  const downloadFileName = `${tender.id}_Whole_Tender_Document_SBD.pdf`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0E1422] rounded-2xl w-full max-w-6xl h-[94vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
        {/* Top Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950">
                  Whole Tender Document (SBD / RFP)
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Ref: {tender.nit_number}
                </span>
                <span className="text-[10px] text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-2 py-0.5 rounded">
                  48 Pages • 3.8 MB PDF
                </span>
                <span className="text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                  {tender.source_portal}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1 max-w-2xl">
                {tender.title}
              </h3>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 text-slate-300">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  {tender.organization}
                </span>
                <span>•</span>
                <span className="text-amber-400 font-bold font-mono">
                  Est. {tender.estimated_cost_inr ? formatINR(tender.estimated_cost_inr) : 'Refer to Notice'}
                </span>
                <span>•</span>
                <span className="text-rose-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> Closes: {tender.closing_date}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Prominent Download, Open in Tab, Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* PRIMARY DOWNLOAD BUTTON */}
            <a
              href={sbdUrl}
              download={downloadFileName}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ring-1 ring-emerald-400/40"
              title="Download Complete 48-Page Standard Bidding Document"
            >
              <Download className="w-4 h-4" />
              <span>Download Whole Doc (PDF)</span>
              <span className="text-[9px] bg-emerald-900/80 px-1.5 py-0.2 rounded font-mono">
                3.8 MB
              </span>
            </a>

            {/* External Tab */}
            <a
              href={sbdUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Open full document in a separate browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close viewer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Volume & Section Navigation Strip */}
        <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar shrink-0">
          <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            Included Volumes:
          </span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium shrink-0">
            Vol I: Instructions to Bidders (ITB)
          </span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium shrink-0">
            Vol II: Pre-Qualification Criteria (PQC)
          </span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium shrink-0">
            Vol III: Contract Conditions (GCC & SCC)
          </span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium shrink-0">
            Vol IV: Technical Specifications (BIS/IRC)
          </span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium shrink-0">
            Vol V: BOQ Rate Schedule
          </span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium shrink-0">
            Vol VI: Statutory Undertakings (GFR 175)
          </span>
        </div>

        {/* Embedded Interactive PDF Viewer */}
        <div className="flex-1 w-full bg-slate-200 dark:bg-slate-900 relative overflow-hidden">
          <iframe
            src={sbdUrl}
            title={`Whole Tender Document Preview - ${tender.nit_number}`}
            className="w-full h-full border-0"
          />
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[11px]">
              Complete statutory Standard Bidding Document (SBD) streamed directly in-memory via ReportLab under GFR 2017 & CVC guidelines.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={sbdUrl}
              download={downloadFileName}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
