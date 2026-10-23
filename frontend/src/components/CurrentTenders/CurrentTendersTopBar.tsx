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
  totalTendersCount
}) => {
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
        onRemove: () => setSelectedCategory('ALL')
      });
    }

    if (selectedSource !== 'ALL') {
      list.push({
        id: 'source',
        label: 'Source',
        value: selectedSource,
        icon: <Globe className="w-3 h-3 text-orange-600" />,
        color: 'orange',
        onRemove: () => setSelectedSource('ALL')
      });
    }

    if (selectedOrg !== 'ALL') {
      list.push({
        id: 'org',
        label: 'Org',
        value: selectedOrg,
        icon: <Building2 className="w-3 h-3 text-blue-600" />,
        color: 'blue',
        onRemove: () => setSelectedOrg('ALL')
      });
    }

    if (selectedState !== 'ALL') {
      list.push({
        id: 'state',
        label: 'State',
        value: selectedState,
        icon: <MapPin className="w-3 h-3 text-rose-600" />,
        color: 'rose',
        onRemove: () => {
          setSelectedState('ALL');
          setSelectedCity('ALL');
        }
      });
    }

    if (selectedCity !== 'ALL') {
      list.push({
        id: 'city',
        label: 'City',
        value: selectedCity,
        icon: <MapPin className="w-3 h-3 text-amber-600" />,
        color: 'amber',
        onRemove: () => setSelectedCity('ALL')
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
        onRemove: () => setSelectedValueRange('ALL')
      });
    }

    if (searchQuery.trim() !== '') {
      list.push({
        id: 'query',
        label: 'Query',
        value: `"${searchQuery}"`,
        color: 'slate',
        onRemove: () => setSearchQuery('')
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
    setSelectedCategory,
    setSelectedSource,
    setSelectedOrg,
    setSelectedState,
    setSelectedCity,
    setSelectedValueRange,
    setSearchQuery
  ]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
      {/* Clean Single Row Toolbar: Search on LEFT, Filter button & Reload on RIGHT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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

      {/* Reusable Applied Filters Tag Chips Bar */}
      <ActiveFilterChipsBar
        chips={chips}
        onClearAll={resetAllFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};
