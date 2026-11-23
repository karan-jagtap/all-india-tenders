import React, { useState, useEffect, useMemo } from 'react';
import { Globe, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  REAL_PORTAL_SOURCES,
  subscribePortalSources,
  PortalCategory,
  PortalRegion,
  PORTAL_CATEGORY_OPTIONS,
  PORTAL_REGION_OPTIONS
} from '../../../constants/portalSources';
import { NavigableTab, UserQuotaInfo } from '../../../types';
import { PortalSourceCard } from './PortalSourceCard';
import { FilterSearchBar, SyncLiveButton } from '../../common';
import { useAuthContext } from '../../../context/AuthContext';

export interface HomeSourcesDirectoryProps {
  onNavigate: (tab: NavigableTab) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  cooldownRemaining?: number;
  quotaInfo?: UserQuotaInfo | null;
  userEmail?: string | null;
  userName?: string | null;
}

export const HomeSourcesDirectory: React.FC<HomeSourcesDirectoryProps> = ({
  onNavigate,
  onTriggerSync,
  isSyncing,
  cooldownRemaining = 0,
  quotaInfo,
  userEmail,
  userName
}) => {
  const { t } = useTranslation();
  const [portalSearch, setPortalSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | PortalCategory>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | PortalRegion>('ALL');
  const [tick, setTick] = useState<number>(0);

  const { isSignedIn, openSignIn } = useAuthContext();

  useEffect(() => {
    return subscribePortalSources(() => setTick((t) => t + 1));
  }, []);

  // Filtered Portal Sources
  const filteredPortals = useMemo(() => {
    return REAL_PORTAL_SOURCES.filter((portal) => {
      if (selectedCategory !== 'ALL' && portal.category !== selectedCategory) {
        return false;
      }
      if (selectedRegion !== 'ALL' && portal.region !== selectedRegion) {
        return false;
      }
      if (portalSearch.trim()) {
        const q = portalSearch.toLowerCase().trim();
        const blob = `${portal.name} ${portal.domain} ${portal.state} ${portal.region} ${portal.description} ${portal.keyAuthorities.join(' ')} ${portal.procurementTypes.join(' ')}`.toLowerCase();
        return blob.includes(q);
      }
      return true;
    });
  }, [portalSearch, selectedCategory, selectedRegion, tick]);

  const resetPortalFilters = () => {
    setPortalSearch('');
    setSelectedCategory('ALL');
    setSelectedRegion('ALL');
  };

  const handleSelectCategory = (catId: 'ALL' | PortalCategory) => {
    setSelectedCategory(catId);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value as 'ALL' | PortalRegion);
  };

  return (
    <section id="real-sources-directory" className="space-y-5 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-700 dark:text-cyan-400" />
              {t('home.sources.badge')}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('home.sources.title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('home.sources.subtitle',  { count: REAL_PORTAL_SOURCES.length })}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {t('common.showing')}{' '}
            <strong className="text-slate-900 dark:text-white">{filteredPortals.length}</strong>{' '}
            {t('common.of')} {REAL_PORTAL_SOURCES.length} {t('common.notices')}
          </div>
          <SyncLiveButton
            onClick={onTriggerSync}
            isSyncing={isSyncing}
            cooldownRemaining={cooldownRemaining}
            variant="section"
            isLocked={!isSignedIn}
            onLockedClick={openSignIn}
            quotaInfo={quotaInfo}
            userEmail={userEmail}
            userName={userName}
          />
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Reusable Search Bar Component */}
          <FilterSearchBar
            searchQuery={portalSearch}
            setSearchQuery={setPortalSearch}
            placeholder={t('home.sources.searchPlaceholder')}
            variant="light"
            accentColor="blue"
            className="flex-1 max-w-lg"
          />

          {/* Region Select */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('home.sources.regionLabel')}
            </span>
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              {PORTAL_REGION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            {t('home.sources.jurisdiction')}
          </span>
          {PORTAL_CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.id === 'ALL'
                ? t('home.sources.allPortals',  { count: REAL_PORTAL_SOURCES.length })
                : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => (
          <PortalSourceCard
            key={portal.id}
            portal={portal}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {filteredPortals.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-2">
          <Globe className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {t('home.sources.noPortalMatched',  { query: portalSearch })}
          </p>
          <button
            onClick={resetPortalFilters}
            className="text-xs text-cyan-600 dark:text-cyan-400 underline font-semibold cursor-pointer"
          >
            {t('home.sources.resetPortalFilters')}
          </button>
        </div>
      )}
    </section>
  );
};
