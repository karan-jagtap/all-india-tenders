import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

export interface BidderBannerProps {
  totalBidders: number;
  totalContractsSum: number;
  totalValueSumCr: string;
}

export const BidderBanner: React.FC<BidderBannerProps> = ({
  totalBidders,
  totalContractsSum,
  totalValueSumCr
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-xl p-5 shadow-sm border border-blue-900/40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500 text-slate-950 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('bidders.verifiedDirectory')}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono border border-slate-700">
              {t('bidders.inMemoryStream')}
            </span>
            <span className="text-xs text-blue-300 font-mono">
              {t('bidders.acrossPortals')}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {t('bidders.title')}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
            {t('bidders.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 w-full md:w-auto">
          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-lg text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">{t('bidders.registeredBidders')}</span>
            <span className="text-base font-bold text-blue-400 font-mono">
              {t('bidders.contractorsCount', { count: totalBidders })}
            </span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-lg text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">{t('bidders.contractsWon')}</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {t('bidders.awardsCount', { count: totalContractsSum })}
            </span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-lg text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">{t('bidders.totalExecutedValue')}</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {t('bidders.crValue', { value: Number(totalValueSumCr).toLocaleString('en-IN') })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
