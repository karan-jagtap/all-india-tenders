import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Award, Users, Globe, ArrowRight } from 'lucide-react';
import { NavigableTab } from '../../../types';

export interface HomeHeroSectionProps {
  activeTenders: number;
  acceptedTenders: number;
  biddersCount: number;
  onNavigate: (tab: NavigableTab) => void;
  onScrollToSources: () => void;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  activeTenders,
  acceptedTenders,
  biddersCount,
  onNavigate,
  onScrollToSources
}) => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
      {/* Decorative background glow accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-5">
        {/* National Tricolor Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm text-slate-200">
          <span className="text-base leading-none">🇮🇳</span>
          <span className="font-bold text-orange-400">{t('brand.tricolorBadge')}</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-mono">{t('brand.hybridBadge')}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          {t('home.heroHeadline')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
            {t('home.heroHeadlineAccent')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          {t('home.heroSubtitle')}
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('current')}
            className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
          >
            <Radio className="w-4 h-4 animate-pulse text-white" />
            <span>{t('home.exploreInProgress', { count: activeTenders.toLocaleString(), defaultValue: `Explore In-Progress Tenders (${activeTenders.toLocaleString()})` })}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('accepted')}
            className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-emerald-300" />
            <span>{t('home.exploreAwarded', { count: acceptedTenders.toLocaleString(), defaultValue: `Awarded Bids Archive (${acceptedTenders.toLocaleString()})` })}</span>
          </button>

          <button
            onClick={() => onNavigate('bidders')}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>{t('home.registeredContractors', { count: biddersCount, defaultValue: `Registered Contractors (${biddersCount})` })}</span>
          </button>

          <button
            onClick={onScrollToSources}
            className="px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{t('home.viewPortals')}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
