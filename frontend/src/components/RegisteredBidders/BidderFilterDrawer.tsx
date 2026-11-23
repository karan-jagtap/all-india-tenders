import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  X,
  Tag,
  MapPin,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { MultiSelectDropdown, DropdownOption } from '../common';
import {
  BidderSortOption,
  BidderFilterDrawerProps,
  BidderSortOptionItem,
  BidderSortOptionCardProps
} from '../../types';

export type {
  BidderSortOption,
  BidderFilterDrawerProps,
  BidderSortOptionItem,
  BidderSortOptionCardProps
};

const BidderSortOptionCard: React.FC<BidderSortOptionCardProps> = ({
  option,
  isSelected,
  onSelect
}) => {
  const handleClick = () => {
    onSelect(option.value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
        isSelected
          ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/30'
          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div>
        <div className="text-xs font-bold flex items-center gap-2">
          <span className={isSelected ? 'text-blue-300' : 'text-slate-200'}>
            {option.label}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">{option.desc}</div>
      </div>
      {isSelected && (
        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
      )}
    </button>
  );
};

export const BidderFilterDrawer: React.FC<BidderFilterDrawerProps> = ({
  isOpen,
  onClose,
  activeFiltersCount,
  hasActiveFilters,
  resetAllFilters,
  totalFilteredCount,
  selectedCategory,
  setSelectedCategory,
  allCategories,
  categoryCounts,
  totalBidders,
  selectedState,
  setSelectedState,
  allStates,
  stateCounts,
  sortBy,
  setSortBy
}) => {
  const { t } = useTranslation();

  const sortOptions: BidderSortOptionItem[] = useMemo(() => [
    {
      value: 'NAME_ASC',
      label: t('bidders.sort.nameAsc'),
      desc: t('bidders.sort.nameAscDesc')
    },
    {
      value: 'NAME_DESC',
      label: t('bidders.sort.nameDesc'),
      desc: t('bidders.sort.nameDescDesc')
    },
    {
      value: 'CONTRACTS_DESC',
      label: t('bidders.sort.contractsDesc'),
      desc: t('bidders.sort.contractsDescDesc')
    },
    {
      value: 'VALUE_DESC',
      label: t('bidders.sort.valueDesc'),
      desc: t('bidders.sort.valueDescDesc')
    },
    {
      value: 'TURNOVER_DESC',
      label: t('bidders.sort.turnoverDesc'),
      desc: t('bidders.sort.turnoverDescDesc')
    }
  ], [t]);

  // Listen for Escape key
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

  const normStates = useMemo(() => {
    if (!selectedState) return ['ALL'];
    return Array.isArray(selectedState)
      ? selectedState.length === 0
        ? ['ALL']
        : selectedState
      : [selectedState];
  }, [selectedState]);

  // Memoized options for Dropdowns
  const categoryOptions: DropdownOption[] = useMemo(() => {
    return allCategories.map((c) => ({
      value: c,
      label: c,
      count: categoryCounts?.get(c) ?? 0,
      countSuffix: t('common.contractors')
    }));
  }, [allCategories, categoryCounts, t]);

  const stateOptions: DropdownOption[] = useMemo(() => {
    return allStates.map((s) => ({
      value: s,
      label: s,
      count: stateCounts?.get(s) ?? 0,
      countSuffix: t('common.contractors')
    }));
  }, [allStates, stateCounts, t]);

  const handleSelectSort = (optionVal: BidderSortOption) => {
    setSortBy(optionVal);
  };

  if (!isOpen) return null;

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
              <div className="w-9 h-9 rounded-xl border flex items-center justify-center bg-blue-600/20 border-blue-500/40 text-blue-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{t('bidders.filterDrawer.title')}</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow-xs">
                      {t('bidders.filterDrawer.activeCount', { count: activeFiltersCount })}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {t('bidders.filterDrawer.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold px-2 py-1 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {t('common.resetAll')}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Filters Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* 1. Work Specialization / Sector */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('bidders.filterDrawer.workSpecialization')}</span>
                </label>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-950/60 border border-blue-800/60 px-1.5 py-0.5 rounded">
                  {t('bidders.filterDrawer.specializationsCount', { count: allCategories.length })}
                </span>
              </div>
              <MultiSelectDropdown
                values={normCategories}
                onChange={setSelectedCategory}
                options={categoryOptions}
                allOptionLabel={t('bidders.filterDrawer.allSpecializations')}
                allOptionCount={totalBidders}
                placeholder={t('bidders.filterDrawer.searchSpecialization')}
                icon={<Tag className="w-3.5 h-3.5 text-blue-400" />}
                accentColor="blue"
              />
            </div>

            {/* 2. State / Operational Region */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t('bidders.filterDrawer.stateHeadquarters')}</span>
                </label>
                <span className="text-[10px] text-rose-400 font-mono bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                  {t('bidders.filterDrawer.statesCount', { count: allStates.length })}
                </span>
              </div>
              <MultiSelectDropdown
                values={normStates}
                onChange={setSelectedState}
                options={stateOptions}
                allOptionLabel={t('bidders.filterDrawer.allStates')}
                allOptionCount={totalBidders}
                placeholder={t('bidders.filterDrawer.searchState')}
                icon={<MapPin className="w-3.5 h-3.5 text-rose-400" />}
                accentColor="rose"
              />
            </div>

            {/* 3. Ranking & Sorting */}
            <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('bidders.filterDrawer.rankingSorting')}</span>
              </label>
              <div className="space-y-1.5">
                {sortOptions.map((opt) => (
                  <BidderSortOptionCard
                    key={opt.value}
                    option={opt}
                    isSelected={sortBy === opt.value}
                    onSelect={handleSelectSort}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/95 sticky bottom-0 z-20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetAllFilters}
              disabled={!hasActiveFilters}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('common.resetAll')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
            >
              <span>{t('bidders.filterDrawer.viewCountContractors', { count: totalFilteredCount })}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
