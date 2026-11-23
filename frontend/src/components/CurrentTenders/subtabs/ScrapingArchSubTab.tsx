import React from 'react';
import { useTranslation } from 'react-i18next';
import { ServerOff, ExternalLink } from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';
import { formatDate } from '../../../utils';

export interface ScrapingArchSubTabProps {
  selectedTender: EnrichedCurrentTender;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
}

export const ScrapingArchSubTab: React.FC<ScrapingArchSubTabProps> = ({
  selectedTender,
  onOpenPortalBridge
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <ServerOff className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          {t('currentTenders.scraping.title')}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('currentTenders.scraping.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {t('currentTenders.scraping.extractionSource')}
          </span>
          <strong className="text-slate-900 dark:text-white">{selectedTender.scraping_source || selectedTender.source_portal}</strong>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            {t('currentTenders.scraping.statusFeed')}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {t('currentTenders.scraping.dbDependency')}
          </span>
          <strong className="text-emerald-700 dark:text-emerald-400">
            {t('currentTenders.scraping.noneSql')}
          </strong>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            {t('currentTenders.scraping.ramStreaming')}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 md:col-span-2">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {t('currentTenders.scraping.portalGateway')}
          </span>
          <button
            onClick={(e) => onOpenPortalBridge(selectedTender, e)}
            className="text-blue-600 dark:text-blue-400 hover:underline font-mono break-all text-[11px] flex items-center gap-1 mt-0.5 text-left cursor-pointer"
          >
            <span>{selectedTender.portal_url}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {t('currentTenders.scraping.biddingStatus')}
          </span>
          <strong className="text-orange-700 dark:text-orange-400">
            {t('currentTenders.scraping.inProgressUnfilled')}
          </strong>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('currentTenders.scraping.proposalsInvited',  { date: formatDate(selectedTender.closing_date) })}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {t('currentTenders.scraping.pdfGenMode')}
          </span>
          <strong className="text-slate-900 dark:text-white">
            {t('currentTenders.scraping.reportLabStreaming')}
          </strong>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('currentTenders.scraping.streamedBytes')}
          </span>
        </div>
      </div>
    </div>
  );
};

