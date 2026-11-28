import React, { useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  X,
  Globe,
  Building2,
  MapPin,
  Tag,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { QUICK_PORTAL_PILLS } from '../../constants';
import { DropdownOption } from './SearchableDropdown';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import type { TenderFilterDrawerProps } from '../../types';

export type { TenderFilterDrawerProps };

export const TenderFilterDrawer: React.FC<TenderFilterDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  accentColor = 'orange',
  activeFiltersCount,
  hasActiveFilters,
  resetAllFilters,
  totalFilteredCount,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  categoryCounts,
  contextCategoryCount,
  selectedSource,
  setSelectedSource,
  availableSources,
  sourceCounts,
  contextSourceCount,
  selectedOrg,
  setSelectedOrg,
  availableOrgs,
  orgCounts,
  contextOrgCount,
  selectedState,
  setSelectedState,
  availableStates,
  stateCounts,
  contextStateCount,
  selectedCity,
  setSelectedCity,
  availableCities,
  cityCounts,
  contextCityCount,
  extraFilters
}) => {
  const { t } = useTranslation();
  const effectiveTitle = title || t('common.filters');
  const effectiveSubtitle = subtitle || t('currentTenders.filterDrawerSubtitle');
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const normCategories = useMemo(() => {
    if (!selectedCategory) return ['ALL'];
    return Array.isArray(selectedCategory)
      ? selectedCategory.length === 0
        ? ['ALL']
        : selectedCategory
      : [selectedCategory];
  }, [selectedCategory]);

  const normSources = useMemo(() => {
    if (!selectedSource) return ['ALL'];
    return Array.isArray(selectedSource)
      ? selectedSource.length === 0
        ? ['ALL']
        : selectedSource
      : [selectedSource];
  }, [selectedSource]);

  const normOrgs = useMemo(() => {
    if (!selectedOrg) return ['ALL'];
    return Array.isArray(selectedOrg)
      ? selectedOrg.length === 0
        ? ['ALL']
        : selectedOrg
      : [selectedOrg];
  }, [selectedOrg]);

  const normStates = useMemo(() => {
    if (!selectedState) return ['ALL'];
    return Array.isArray(selectedState)
      ? selectedState.length === 0
        ? ['ALL']
        : selectedState
      : [selectedState];
  }, [selectedState]);

  const normCities = useMemo(() => {
    if (!selectedCity) return ['ALL'];
    return Array.isArray(selectedCity)
      ? selectedCity.length === 0
        ? ['ALL']
        : selectedCity
      : [selectedCity];
  }, [selectedCity]);

  // Memoized options for SearchableDropdowns / MultiSelectDropdowns
  const categoryOptions: DropdownOption[] = useMemo(() => {
    return availableCategories.map((cat) => ({
      value: cat,
      label: cat,
      count: categoryCounts.get(cat) ?? 0,
      countSuffix: 'notices'
    }));
  }, [availableCategories, categoryCounts]);

  const sourceOptions: DropdownOption[] = useMemo(() => {
    return availableSources.map((src) => ({
      value: src,
      label: src,
      count: sourceCounts.get(src) ?? 0,
      countSuffix: 'notices'
    }));
  }, [availableSources, sourceCounts]);

  const orgOptions: DropdownOption[] = useMemo(() => {
    return availableOrgs.map((org) => ({
      value: org,
      label: org,
      count: orgCounts.get(org) ?? 0,
      countSuffix: 'notices'
    }));
  }, [availableOrgs, orgCounts]);

  const stateOptions: DropdownOption[] = useMemo(() => {
    return availableStates.map((st) => ({
      value: st,
      label: st,
      count: stateCounts.get(st) ?? 0,
      countSuffix: 'notices'
    }));
  }, [availableStates, stateCounts]);

  const cityOptions: DropdownOption[] = useMemo(() => {
    return availableCities.map((ct) => ({
      value: ct,
      label: ct,
      count: cityCounts.get(ct) ?? 0,
      countSuffix: 'notices'
    }));
  }, [availableCities, cityCounts]);

  if (!isOpen) return null;

  const getHeaderIconBg = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400';
      case 'blue':
        return 'bg-blue-600/20 border-blue-500/40 text-blue-400';
      case 'orange':
      default:
        return 'bg-orange-600/20 border-orange-500/40 text-orange-400';
    }
  };

  const getHeaderBadgeClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-emerald-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'orange':
      default:
        return 'bg-orange-500 text-white';
    }
  };

  const getResetBtnClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-400 hover:text-emerald-300';
      case 'blue':
        return 'text-blue-400 hover:text-blue-300';
      case 'orange':
      default:
        return 'text-orange-400 hover:text-orange-300';
    }
  };

  const getApplyBtnClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white';
      case 'blue':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white';
      case 'orange':
      default:
        return 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white';
    }
  };

  const handleToggleSourcePill = (pillVal: string) => {
    if (normSources.includes(pillVal)) {
      const next = normSources.filter((v) => v !== pillVal && v !== 'ALL');
      setSelectedSource(next.length === 0 ? ['ALL'] : next);
    } else {
      const next = normSources.filter((v) => v !== 'ALL');
      setSelectedSource([...next, pillVal]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-lg sm:max-w-xl md:max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 z-10 animate-slideInRight">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${getHeaderIconBg()}`}>
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{effectiveTitle}</span>
                  {activeFiltersCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getHeaderBadgeClass()}`}>
                      {activeFiltersCount} {t('common.active')}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">{effectiveSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className={`text-xs font-semibold px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${getResetBtnClass()}`}
                >
                  {t('common.resetAll')}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('common.closeFilterDrawer')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Filters Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* 1. Work Category / Sector */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('common.workCategorySector')}</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  {t('common.categoriesCount',  { count: availableCategories.length })}
                </span>
              </div>
              <MultiSelectDropdown
                values={normCategories}
                onChange={setSelectedCategory}
                options={categoryOptions}
                allOptionLabel={t('common.allWorkCategories')}
                allOptionCount={contextCategoryCount}
                placeholder={t('common.searchCategory')}
                icon={<Tag className="w-3.5 h-3.5 text-emerald-400" />}
                accentColor="emerald"
              />
            </div>

            {/* 2. Procurement Portal / Source */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t('common.procurementPortalSource')}</span>
                </label>
                <span className="text-[10px] text-orange-400 font-mono bg-orange-950/60 border border-orange-800/60 px-1.5 py-0.5 rounded">
                  {t('common.portalsCount',  { count: availableSources.length })}
                </span>
              </div>
              <MultiSelectDropdown
                values={normSources}
                onChange={setSelectedSource}
                options={sourceOptions}
                allOptionLabel={t('common.allProcurementPortals')}
                allOptionCount={contextSourceCount}
                placeholder={t('common.searchPortal')}
                icon={<Globe className="w-3.5 h-3.5 text-orange-400" />}
                accentColor="orange"
              />

              {/* Quick Source Pill Shortcuts */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {QUICK_PORTAL_PILLS.map((pill) => {
                  const isActive = normSources.includes(pill.val);
                  return (
                    <button
                      key={pill.val}
                      type="button"
                      onClick={() => handleToggleSourcePill(pill.val)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        isActive
                          ? pill.activeClass
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Procuring Organization */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('common.procuringOrgMinistry')}</span>
                </label>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-950/60 border border-blue-800/60 px-1.5 py-0.5 rounded">
                  {t('common.orgsCount',  { count: availableOrgs.length })}
                </span>
              </div>
              <MultiSelectDropdown
                values={normOrgs}
                onChange={setSelectedOrg}
                options={orgOptions}
                allOptionLabel={t('common.allOrganizations')}
                allOptionCount={contextOrgCount}
                placeholder={t('common.searchOrg')}
                icon={<Building2 className="w-3.5 h-3.5 text-blue-400" />}
                accentColor="blue"
              />
            </div>

            {/* 4. Location: State & City */}
            <div className="space-y-3 bg-slate-800/20 p-3 rounded-xl border border-slate-800">
              {/* State Filter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t('common.stateUnionTerritory')}</span>
                  </label>
                  <span className="text-[10px] text-rose-400 font-mono bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                    {t('common.statesCount',  { count: availableStates.length })}
                  </span>
                </div>
                <MultiSelectDropdown
                  values={normStates}
                  onChange={(vals) => {
                    setSelectedState(vals);
                    setSelectedCity(['ALL']);
                  }}
                  options={stateOptions}
                  allOptionLabel={t('common.allStates')}
                  allOptionCount={contextStateCount}
                  placeholder={t('common.searchState')}
                  icon={<MapPin className="w-3.5 h-3.5 text-rose-400" />}
                  accentColor="rose"
                />
              </div>

              {/* City Filter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('common.cityDistrict')}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                    {t('common.citiesCount',  { count: availableCities.length })}
                  </span>
                </div>
                <MultiSelectDropdown
                  values={normCities}
                  onChange={setSelectedCity}
                  options={cityOptions}
                  allOptionLabel={
                    normStates.length === 1 && normStates[0] !== 'ALL'
                      ? t('common.allCitiesInState',  { state: normStates[0] })
                      : normStates.length > 1 && !normStates.includes('ALL')
                      ? t('common.allCitiesInStates',  { count: normStates.length })
                      : t('common.allCities')
                  }
                  allOptionCount={contextCityCount}
                  placeholder={t('common.searchCity')}
                  icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
                  accentColor="amber"
                />
              </div>
            </div>

            {/* 5. Custom Extra Slot (Value Range or Award Year) */}
            {extraFilters}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 sticky bottom-0 z-20">
            <div className="text-xs text-slate-400">
              {t('common.matching')}{' '}
              <span className="font-bold text-white font-mono">{totalFilteredCount}</span> {t('common.notices')}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('common.close')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${getApplyBtnClass()}`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t('common.viewCountNotices',  { count: totalFilteredCount })}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
