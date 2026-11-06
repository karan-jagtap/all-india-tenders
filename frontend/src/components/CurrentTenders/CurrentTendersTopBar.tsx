import React, { useMemo } from 'react';
import { Tag, Globe, Building2, MapPin, Clock } from 'lucide-react';
import {
  FilterSearchBar,
  TopFilterActionBar,
  ActiveFilterChipsBar,
  FilterChipItem
} from '../common';

export interface CurrentTendersTopBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isVoiceSearching: boolean;
  toggleVoiceSearch: () => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  availableCategories: string[];
  categoryCounts: Map<string, number>;
  contextCategoryCount: number;
  selectedSource: string;
  setSelectedSource: (s: string) => void;
  availableSources: string[];
  sourceCounts: Map<string, number>;
  contextSourceCount: number;
  selectedOrg: string;
  setSelectedOrg: (o: string) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  selectedValueRange: string;
  setSelectedValueRange: (v: string) => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  onOpenFilterDrawer: () => void;
  loadData: () => void;
  loading: boolean;
  totalTendersCount: number;
  includeClosed: boolean;
  setIncludeClosed: (inc: boolean) => void;
  openCount: number;
}

export const CurrentTendersTopBar: React.FC<CurrentTendersTopBarProps> = ({
  searchQuery,
  setSearchQuery,
  isVoiceSearching,
  toggleVoiceSearch,
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  selectedOrg,
  setSelectedOrg,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedValueRange,
  setSelectedValueRange,
  activeFiltersCount,
  hasActiveFilters,
  resetAllFilters,
  onOpenFilterDrawer,
  loadData,
  loading,
  totalTendersCount,
  includeClosed,
  setIncludeClosed,
  openCount
}) => {
  const handleRemoveCategoryChip = () => {
    setSelectedCategory('ALL');
  };

  const handleRemoveSourceChip = () => {
    setSelectedSource('ALL');
  };

  const handleRemoveOrgChip = () => {
    setSelectedOrg('ALL');
  };

  const handleRemoveStateChip = () => {
    setSelectedState('ALL');
    setSelectedCity('ALL');
  };

  const handleRemoveCityChip = () => {
    setSelectedCity('ALL');
  };

  const handleRemoveValueRangeChip = () => {
    setSelectedValueRange('ALL');
  };

  const handleRemoveQueryChip = () => {
    setSearchQuery('');
  };

  // Construct memoized chip items for ActiveFilterChipsBar
  const chips: FilterChipItem[] = useMemo(() => {
    const list: FilterChipItem[] = [];

    if (selectedCategory !== 'ALL') {
      list.push({
        id: 'category',
        label: 'Category',
        value: selectedCategory,
        icon: <Tag className="w-3 h-3 text-emerald-600" />,
        color: 'emerald',
        onRemove: handleRemoveCategoryChip
      });
    }

    if (selectedSource !== 'ALL') {
      list.push({
        id: 'source',
        label: 'Source',
        value: selectedSource,
        icon: <Globe className="w-3 h-3 text-orange-600" />,
        color: 'orange',
        onRemove: handleRemoveSourceChip
      });
    }

    if (selectedOrg !== 'ALL') {
      list.push({
        id: 'org',
        label: 'Org',
        value: selectedOrg,
        icon: <Building2 className="w-3 h-3 text-blue-600" />,
        color: 'blue',
        onRemove: handleRemoveOrgChip
      });
    }

    if (selectedState !== 'ALL') {
      list.push({
        id: 'state',
        label: 'State',
        value: selectedState,
        icon: <MapPin className="w-3 h-3 text-rose-600" />,
        color: 'rose',
        onRemove: handleRemoveStateChip
      });
    }

    if (selectedCity !== 'ALL') {
      list.push({
        id: 'city',
        label: 'City',
        value: selectedCity,
        icon: <MapPin className="w-3 h-3 text-amber-600" />,
        color: 'amber',
        onRemove: handleRemoveCityChip
      });
    }

    if (selectedValueRange !== 'ALL') {
      const labelVal =
        selectedValueRange === 'CLOSING_SOON'
          ? '⚡ Closing Soon'
          : selectedValueRange === 'UNDER_10CR'
          ? '< ₹ 10 Cr'
          : selectedValueRange === '10CR_50CR'
          ? '₹ 10–50 Cr'
          : '> ₹ 50 Cr';
      list.push({
        id: 'valueRange',
        label: 'Range',
        value: labelVal,
        icon: <Clock className="w-3 h-3 text-amber-600" />,
        color: 'amber',
        onRemove: handleRemoveValueRangeChip
      });
    }

    if (searchQuery.trim() !== '') {
      list.push({
        id: 'query',
        label: 'Query',
        value: `"${searchQuery}"`,
        color: 'slate',
        onRemove: handleRemoveQueryChip
      });
    }

    if (includeClosed) {
      list.push({
        id: 'includeClosed',
        label: 'Scope',
        value: 'All Notices (Incl. Closed)',
        color: 'blue',
        onRemove: () => setIncludeClosed(false)
      });
    }

    return list;
  }, [
    selectedCategory,
    selectedSource,
    selectedOrg,
    selectedState,
    selectedCity,
    selectedValueRange,
    searchQuery,
    includeClosed,
    setIncludeClosed,
    setSelectedCategory,
    setSelectedSource,
    setSelectedOrg,
    setSelectedState,
    setSelectedCity,
    setSelectedValueRange,
    setSearchQuery
  ]);

  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5">
      {/* Clean Single Row Toolbar: Search on LEFT, Toggle & Action buttons on RIGHT */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Reusable Search Bar Component */}
        <FilterSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search live tenders, ref no, authority, city..."
          isVoiceSearching={isVoiceSearching}
          toggleVoiceSearch={toggleVoiceSearch}
          accentColor="orange"
          className="max-w-xl"
        />

        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Quick Lifecycle Toggle Pill */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setIncludeClosed(false)}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                !includeClosed
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Show only open tenders actively accepting bids"
            >
              <span className={`w-2 h-2 rounded-full ${!includeClosed ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Open Bids ({openCount.toLocaleString()})</span>
            </button>
            <button
              type="button"
              onClick={() => setIncludeClosed(true)}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                includeClosed
                  ? 'bg-white dark:bg-slate-700 text-orange-700 dark:text-orange-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Show all notices including closed / under technical evaluation"
            >
              <span>All Notices ({totalTendersCount.toLocaleString()})</span>
            </button>
          </div>

          {/* Reusable Top Action Bar Component */}
          <TopFilterActionBar
            onOpenFilters={onOpenFilterDrawer}
            activeFiltersCount={activeFiltersCount}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetAllFilters}
            onReload={loadData}
            isLoading={loading}
            totalCount={totalTendersCount}
            reloadLabel="Reload"
            accentColor="orange"
          />
        </div>
      </div>

      {/* Reusable Applied Filters Tag Chips Bar */}
      <ActiveFilterChipsBar
        chips={chips}
        onClearAll={resetAllFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};
