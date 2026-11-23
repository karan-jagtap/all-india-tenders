import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const MSMESubTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {t('currentTenders.msme.title')}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('currentTenders.msme.subtitle')}
        </p>
      </div>

      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-3">
        <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('currentTenders.msme.guaranteed')}</span>
        </div>

        <p className="text-emerald-950 dark:text-emerald-300 leading-relaxed">
          {t(
            'currentTenders.msme.desc'
          )}
        </p>

        <div className="bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            {t('currentTenders.msme.checklistTitle')}
          </div>
          <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
            <li>{t('currentTenders.msme.check1')}</li>
            <li>{t('currentTenders.msme.check2')}</li>
            <li>{t('currentTenders.msme.check3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

