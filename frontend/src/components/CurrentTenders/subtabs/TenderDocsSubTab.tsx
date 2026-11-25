import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Download, ExternalLink, Eye } from 'lucide-react';
import { TenderDocType, TenderDocsSubTabProps } from '../../../types';
import { formatINR } from '../../../utils';

export type { TenderDocsSubTabProps };

export const TenderDocsSubTab: React.FC<TenderDocsSubTabProps> = ({
  selectedTender,
  sbdUrl,
  pdfUrl,
  boqUrl,
  onOpenPortalBridge,
  onOpenWholeDoc
}) => {
  const { t } = useTranslation();
  const [selectedDocType, setSelectedDocType] = useState<TenderDocType>(TenderDocType.SBD);

  const activeDocUrl =
    selectedDocType === TenderDocType.SBD ? sbdUrl : selectedDocType === TenderDocType.NIT ? pdfUrl : boqUrl;
  const activeDocFileName =
    selectedDocType === TenderDocType.SBD
      ? `${selectedTender.id}_Whole_Tender_Document_SBD.pdf`
      : selectedDocType === TenderDocType.NIT
      ? `${selectedTender.id}_NIT_Notice.pdf`
      : `${selectedTender.id}_Bill_of_Quantities_BOQ.csv`;

  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
      {/* Top Sourcing & Package Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            {t('currentTenders.docs.packageTitle')}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t(
              'currentTenders.docs.packageDesc', 
              { portal: selectedTender.source_portal, nit: selectedTender.nit_number }
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenWholeDoc && (
            <button
              onClick={onOpenWholeDoc}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title={t('currentTenders.docs.expandWholeDocTitle')}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('currentTenders.docs.fullScreenViewer')}</span>
            </button>
          )}
          <a
            href={activeDocUrl}
            download={activeDocFileName}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {selectedDocType === 'sbd'
                ? t('currentTenders.docs.downloadWholeDoc')
                : t('currentTenders.docs.downloadActiveDoc')}
            </span>
          </a>
          <a
            href={activeDocUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t('common.newTab')}</span>
          </a>
        </div>
      </div>

      {/* 3 Document Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Doc 1: SBD / Detailed Tender Doc */}
        <div
          onClick={() => setSelectedDocType(TenderDocType.SBD)}
          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
            selectedDocType === TenderDocType.SBD
              ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              {t('currentTenders.docs.sbdBadge')}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {t('currentTenders.docs.sbdPages')}
            </span>
          </div>
          <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
            {t('currentTenders.docs.sbdTitle')}
          </h5>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {t(
              'currentTenders.docs.sbdDesc'
            )}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
            <span className="text-indigo-700 dark:text-indigo-400 font-semibold">
              {selectedDocType === TenderDocType.SBD
                ? t('currentTenders.docs.activeInViewer')
                : t('currentTenders.docs.clickToView')}
            </span>
            <a
              href={sbdUrl}
              download={`${selectedTender.id}_Detailed_Tender_Document_SBD.pdf`}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" /> {t('common.download')}
            </a>
          </div>
        </div>

        {/* Doc 2: Notice Inviting Tender (NIT) */}
        <div
          onClick={() => setSelectedDocType(TenderDocType.NIT)}
          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
            selectedDocType === TenderDocType.NIT
              ? 'bg-orange-50/70 dark:bg-orange-950/40 border-orange-600 shadow-sm ring-1 ring-orange-600'
              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
              {t('currentTenders.docs.nitBadge')}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {t('currentTenders.docs.nitPages')}
            </span>
          </div>
          <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
            {t('currentTenders.docs.nitTitle')}
          </h5>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {t(
              'currentTenders.docs.nitDesc'
            )}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
            <span className="text-orange-700 dark:text-orange-400 font-semibold">
              {selectedDocType === TenderDocType.NIT
                ? t('currentTenders.docs.activeInViewer')
                : t('currentTenders.docs.clickToView')}
            </span>
            <a
              href={pdfUrl}
              download={`${selectedTender.id}_NIT_notice.pdf`}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" /> {t('common.download')}
            </a>
          </div>
        </div>

        {/* Doc 3: Bill of Quantities (BOQ) */}
        <div
          onClick={() => setSelectedDocType(TenderDocType.BOQ)}
          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
            selectedDocType === TenderDocType.BOQ
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              {t('currentTenders.docs.boqBadge')}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {t('currentTenders.docs.boqPages')}
            </span>
          </div>
          <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
            {t('currentTenders.docs.boqTitle')}
          </h5>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {t(
              'currentTenders.docs.boqDesc', 
              { amount: formatINR(selectedTender.estimated_cost_inr || 0) }
            )}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              {selectedDocType === TenderDocType.BOQ
                ? t('currentTenders.docs.activeInViewer')
                : t('currentTenders.docs.clickToView')}
            </span>
            <a
              href={boqUrl}
              download={`${selectedTender.id}_BOQ_Schedule.pdf`}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" /> {t('common.download')}
            </a>
          </div>
        </div>
      </div>

      {/* Document Sourcing Notice Bar */}
      <div className="p-3 bg-slate-900 dark:bg-slate-950 text-white rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 font-mono text-[10px] rounded font-bold uppercase">
            {t('currentTenders.docs.portalSourcing')}
          </span>
          <span className="text-slate-300 text-[11px]">
            {t('currentTenders.docs.sourcedFrom')}{' '}
            <strong className="text-white">{selectedTender.source_portal}</strong>
            {t('currentTenders.docs.section')}{' '}
            <em className="text-indigo-200">{t('currentTenders.docs.workDocuments')}</em>
          </span>
        </div>

        {selectedTender.portal_url && (
          <button
            onClick={(e) => onOpenPortalBridge(selectedTender, e)}
            className="text-blue-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer underline shrink-0"
          >
            {t('currentTenders.docs.verifyPortal')}
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
