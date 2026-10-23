import React, { useState } from 'react';
import { Layers, Download, ExternalLink, Eye } from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';
import { formatINR } from '../../../utils';

export interface TenderDocsSubTabProps {
  selectedTender: EnrichedCurrentTender;
  sbdUrl: string;
  pdfUrl: string;
  boqUrl: string;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
  onOpenWholeDoc?: () => void;
}

export const TenderDocsSubTab: React.FC<TenderDocsSubTabProps> = ({
  selectedTender,
  sbdUrl,
  pdfUrl,
  boqUrl,
  onOpenPortalBridge,
  onOpenWholeDoc
}) => {
  const [selectedDocType, setSelectedDocType] = useState<'sbd' | 'nit' | 'boq'>('sbd');

  const activeDocUrl =
    selectedDocType === 'sbd' ? sbdUrl : selectedDocType === 'nit' ? pdfUrl : boqUrl;
  const activeDocFileName =
    selectedDocType === 'sbd'
      ? `${selectedTender.id}_Whole_Tender_Document_SBD.pdf`
      : selectedDocType === 'nit'
      ? `${selectedTender.id}_NIT_Notice.pdf`
      : `${selectedTender.id}_Bill_of_Quantities_BOQ.csv`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Top Sourcing & Package Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            Official Sourced Tender Documents Package
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Complete statutory documents published on {selectedTender.source_portal} for NIT Reference{' '}
            <code className="text-blue-700 font-bold font-mono">{selectedTender.nit_number}</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenWholeDoc && (
            <button
              onClick={onOpenWholeDoc}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Expand whole tender document in dedicated reader modal"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full-Screen Viewer</span>
            </button>
          )}
          <a
            href={activeDocUrl}
            download={activeDocFileName}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedDocType === 'sbd' ? 'Whole Doc' : 'Active Doc'}</span>
          </a>
          <a
            href={activeDocUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>New Tab</span>
          </a>
        </div>
      </div>

      {/* 3 Document Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Doc 1: SBD / Detailed Tender Doc */}
        <div
          onClick={() => setSelectedDocType('sbd')}
          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
            selectedDocType === 'sbd'
              ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
              : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
              Comprehensive SBD
            </span>
            <span className="text-[10px] font-mono text-slate-500">48 Pages • 3.8 MB</span>
          </div>
          <h5 className="font-bold text-slate-900 text-xs mb-1">
            Detailed Tender Document (SBD / RFP)
          </h5>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            Includes Instructions to Bidders (ITB), General & Special Conditions of Contract (GCC/SCC), PQC Qualification, Technical Specs & Codes (IRC/MoRTH/CPWD/BIS), and Statutory Annexures.
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
            <span className="text-indigo-700 font-semibold">
              {selectedDocType === 'sbd' ? '● Active in Viewer' : 'Click to View'}
            </span>
            <a
              href={sbdUrl}
              download={`${selectedTender.id}_Detailed_Tender_Document_SBD.pdf`}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" /> Download
            </a>
          </div>
        </div>

        {/* Doc 2: Notice Inviting Tender (NIT) */}
        <div
          onClick={() => setSelectedDocType('nit')}
          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
            selectedDocType === 'nit'
              ? 'bg-orange-50/70 border-orange-600 shadow-sm ring-1 ring-orange-600'
              : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
              NIT Notice
            </span>
            <span className="text-[10px] font-mono text-slate-500">2 Pages • 480 KB</span>
          </div>
          <h5 className="font-bold text-slate-900 text-xs mb-1">
            Notice Inviting Tender (NIT Summary)
          </h5>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            Official advertisement summary notice published on portal specifying key dates, EMD amount, tender fee, and basic eligibility criteria.
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
            <span className="text-orange-700 font-semibold">
              {selectedDocType === 'nit' ? '● Active in Viewer' : 'Click to View'}
            </span>
            <a
              href={pdfUrl}
              download={`${selectedTender.id}_NIT_notice.pdf`}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 hover:text-orange-600 font-medium flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" /> Download
            </a>
          </div>
        </div>

        {/* Doc 3: Bill of Quantities (BOQ) */}
        <div
          onClick={() => setSelectedDocType('boq')}
          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
            selectedDocType === 'boq'
              ? 'bg-emerald-50/70 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
              : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Price BOQ
            </span>
            <span className="text-[10px] font-mono text-slate-500">6 Pages • 320 KB</span>
          </div>
          <h5 className="font-bold text-slate-900 text-xs mb-1">
            Bill of Quantities (BOQ / Rate Schedule)
          </h5>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            Itemized financial schedule detailing item descriptions, quantities, and departmental estimate totaling {formatINR(selectedTender.estimated_cost_inr || 0)} for Cover-2 bidding.
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
            <span className="text-emerald-700 font-semibold">
              {selectedDocType === 'boq' ? '● Active in Viewer' : 'Click to View'}
            </span>
            <a
              href={boqUrl}
              download={`${selectedTender.id}_BOQ_Schedule.pdf`}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" /> Download
            </a>
          </div>
        </div>
      </div>

      {/* Document Sourcing Notice Bar */}
      <div className="p-3 bg-slate-900 text-white rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 font-mono text-[10px] rounded font-bold uppercase">
            Official Portal Sourcing
          </span>
          <span className="text-slate-300 text-[11px]">
            Sourced from: <strong className="text-white">{selectedTender.source_portal}</strong> • Section:{' '}
            <em className="text-indigo-200">Work / Item Documents</em>
          </span>
        </div>

        {selectedTender.portal_url && (
          <button
            onClick={(e) => onOpenPortalBridge(selectedTender, e)}
            className="text-blue-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer underline shrink-0"
          >
            Verify Original Sourcing on Portal ↗
          </button>
        )}
      </div>

      {/* Live In-Browser PDF Preview Iframe */}
      <div className="w-full h-[640px] rounded-lg border border-slate-300 overflow-hidden bg-slate-100 shadow-inner">
        <iframe
          src={activeDocUrl}
          title={`Official Tender Document Preview - ${selectedDocType.toUpperCase()}`}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};
