import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Award, Users, Sparkles, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import type { HomeCapabilitiesSectionProps } from '../../../types';
import { useAuthContext } from '../../../context/AuthContext';
import { renderBulletPoint } from '../../../utils';

export type { HomeCapabilitiesSectionProps };

export const HomeCapabilitiesSection: React.FC<HomeCapabilitiesSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isSignedIn } = useAuthContext();

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60">
              {t('home.capabilities.badge')}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('home.capabilities.title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('home.capabilities.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: In-Progress Unfilled Tenders */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-orange-400/80 dark:hover:border-orange-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.capabilities.pillar1Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('home.capabilities.pillar1Desc')}
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar1Point1'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar1Point2'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar1Point3'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar1Point4'))}
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('current')}
            className="w-full py-2.5 px-4 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{t('home.capabilities.pillar1Button')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 2: 17-Year Awarded Bids Archive */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-emerald-400/80 dark:hover:border-emerald-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.capabilities.pillar2Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('home.capabilities.pillar2Desc')}
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar2Point1'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar2Point2'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar2Point3'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar2Point4'))}
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('accepted')}
            className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{t('home.capabilities.pillar2Button')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 3: Registered Contractors Intelligence */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-blue-400/80 dark:hover:border-blue-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.capabilities.pillar3Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('home.capabilities.pillar3Desc')}
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar3Point1'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar3Point2'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar3Point3'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar3Point4'))}
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('bidders')}
            className="w-full py-2.5 px-4 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            title={!isSignedIn ? t('nav.loginPromptBidders') : undefined}
          >
            <span>{t('home.capabilities.pillar3Button')}</span>
            {!isSignedIn && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 4: Deep RAG Analytics & Competitor Simulation */}
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-purple-400/80 dark:hover:border-purple-500/80 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.capabilities.pillar4Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('home.capabilities.pillar4Desc')}
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar4Point1'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar4Point2'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar4Point3'))}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {renderBulletPoint(t('home.capabilities.pillar4Point4'))}
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('current')}
            className="w-full py-2.5 px-4 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{t('home.capabilities.pillar4Button')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
