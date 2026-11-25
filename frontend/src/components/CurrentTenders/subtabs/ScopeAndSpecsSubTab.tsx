import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import type { ScopeAndSpecsSubTabProps } from '../../../types';
import { formatDate } from '../../../utils';

export type { ScopeAndSpecsSubTabProps };

export const ScopeAndSpecsSubTab: React.FC<ScopeAndSpecsSubTabProps> = ({ selectedTender }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          {t('currentTenders.scope.title')}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('currentTenders.scope.subtitle')}
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-3">
        <p className="font-medium text-slate-900 dark:text-white">
          {selectedTender.scope_summary || t('currentTenders.scope.defaultScope')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {t('currentTenders.scope.biddingProcedure')}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {t('currentTenders.scope.openCompetitive')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {t('currentTenders.scope.publishedDate')}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(selectedTender.published_date) || t('common.recent')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {t('currentTenders.scope.stateTerritory')}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {selectedTender.state || t('currentTenders.scope.panIndia')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {t('currentTenders.scope.cityLocation')}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {selectedTender.city || t('currentTenders.scope.statewide')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

