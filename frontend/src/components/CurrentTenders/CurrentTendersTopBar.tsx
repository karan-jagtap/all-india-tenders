import React, { useMemo } from 'react';
import { Tag, Globe, Building2, MapPin, Clock, ArrowUpDown } from 'lucide-react';
import {
  FilterSearchBar,
  TopFilterActionBar,
  ActiveFilterChipsBar,
  FilterChipItem,
  ToolbarSortDropdown,
  ToolbarSortOption
} from '../common';
import { CurrentTenderSortOption } from '../../types';

export const CURRENT_TENDER_SORT_OPTIONS: ToolbarSortOption<CurrentTenderSortOption>[] = [
  {
    value: 'CLOSING_SOONEST',
    label: '⏰ Closing Soonest',
    shortLabel: 'Closing Soonest',
    desc: 'Notices with closest submission deadlines first'
  },
  {
    value: 'CLOSING_LATEST',
    label: '⏳ Closing Latest',
    shortLabel: 'Closing Latest',
    desc: 'Notices with longest submission windows remaining'
  },
  {
    value: 'VALUE_DESC',
    label: '💰 Value: High to Low',
    shortLabel: 'Value (High → Low)',
    desc: 'Largest estimated contract values first'
  },
  {
    value: 'VALUE_ASC',
    label: '🪙 Value: Low to High',
    shortLabel: 'Value (Low → High)',
    desc: 'Smallest / MSME-accessible estimated values first'
  },
  {
    value: 'PUBLISHED_DESC',
    label: '📅 Newest Published',
    shortLabel: 'Newest Published',
    desc: 'Most recently published procurement notices'
  },
  {
    value: 'PUBLISHED_ASC',
    label: '🗓️ Oldest Published',
    shortLabel: 'Oldest Published',
    desc: 'Oldest active notices first'
  },
  {
    value: 'EMD_DESC',
    label: '🛡️ EMD: High to Low',
    shortLabel: 'EMD (High → Low)',
    desc: 'Highest earnest money deposit first'
  },
  {
    value: 'TITLE_ASC',
    label: '🔤 Title (A → Z)',
    shortLabel: 'Title (A → Z)',
    desc: 'Alphabetical order by tender title'
  }
];

export interface CurrentTendersTopBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isVoiceSearching: boolean;
  toggleVoiceSearch: () => void;
  selectedCategory: string[] | string;
  setSelectedCategory: (c: string[]) => void;
  availableCategories: string[];
  categoryCounts: Map<string, number>;
  contextCategoryCount: number;
  selectedSource: string[] | string;
  setSelectedSource: (s: string[]) => void;
  availableSources: string[];
  sourceCounts: Map<string, number>;
  contextSourceCount: number;
  selectedOrg: string[] | string;
  setSelectedOrg: (o: string[]) => void;
  selectedState: string[] | string;
  setSelectedState: (s: string[]) => void;
  selectedCity: string[] | string;
  setSelectedCity: (c: string[]) => void;
  selectedValueRange: string;
  setSelectedValueRange: (v: string) => void;
  sortBy: CurrentTenderSortOption;
  setSortBy: (s: CurrentTenderSortOption) => void;
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
  sortBy,
  setSortBy,
  activeFiltersCount,
  hasActiveFilters,
  resetAllFilters,
  onOpenFilterDrawer,
  loadData,
  loading,
  totalTendersCount
}) => {
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

  const handleRemoveCategory = (cat: string) => {
    const next = normCategories.filter((c) => c !== cat && c !== 'ALL');
    setSelectedCategory(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveSource = (src: string) => {
    const next = normSources.filter((s) => s !== src && s !== 'ALL');
    setSelectedSource(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveOrg = (org: string) => {
    const next = normOrgs.filter((o) => o !== org && o !== 'ALL');
    setSelectedOrg(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveState = (st: string) => {
    const next = normStates.filter((s) => s !== st && s !== 'ALL');
    setSelectedState(next.length === 0 ? ['ALL'] : next);
    if (next.length === 0) {
      setSelectedCity(['ALL']);
    }
  };

  const handleRemoveCity = (ct: string) => {
    const next = normCities.filter((c) => c !== ct && c !== 'ALL');
    setSelectedCity(next.length === 0 ? ['ALL'] : next);
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

    if (!normCategories.includes('ALL')) {
      normCategories.forEach((cat) => {
        list.push({
          id: `category-${cat}`,
          label: 'Category',
          value: cat,
          icon: <Tag className="w-3 h-3 text-emerald-600" />,
          color: 'emerald',
          onRemove: () => handleRemoveCategory(cat)
        });
      });
    }

    if (!normSources.includes('ALL')) {
      normSources.forEach((src) => {
        list.push({
          id: `source-${src}`,
          label: 'Source',
          value: src,
          icon: <Globe className="w-3 h-3 text-orange-600" />,
          color: 'orange',
          onRemove: () => handleRemoveSource(src)
        });
      });
    }

    if (!normOrgs.includes('ALL')) {
      normOrgs.forEach((org) => {
        list.push({
          id: `org-${org}`,
          label: 'Org',
          value: org,
          icon: <Building2 className="w-3 h-3 text-blue-600" />,
          color: 'blue',
          onRemove: () => handleRemoveOrg(org)
        });
      });
    }

    if (!normStates.includes('ALL')) {
      normStates.forEach((st) => {
        list.push({
          id: `state-${st}`,
          label: 'State',
          value: st,
          icon: <MapPin className="w-3 h-3 text-rose-600" />,
          color: 'rose',
          onRemove: () => handleRemoveState(st)
        });
      });
    }

    if (!normCities.includes('ALL')) {
      normCities.forEach((ct) => {
        list.push({
          id: `city-${ct}`,
          label: 'City',
          value: ct,
          icon: <MapPin className="w-3 h-3 text-amber-600" />,
          color: 'amber',
          onRemove: () => handleRemoveCity(ct)
        });
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

    if (sortBy !== 'CLOSING_SOONEST') {
      const activeOpt = CURRENT_TENDER_SORT_OPTIONS.find((o) => o.value === sortBy);
      list.push({
        id: 'sort',
        label: 'Sort',
        value: activeOpt?.shortLabel || activeOpt?.label || sortBy,
        icon: <ArrowUpDown className="w-3 h-3 text-orange-600" />,
        color: 'orange',
        onRemove: () => setSortBy('CLOSING_SOONEST')
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

    return list;
  }, [
    normCategories,
    normSources,
    normOrgs,
    normStates,
    normCities,
    selectedValueRange,
    sortBy,
    searchQuery
  ]);

  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5">
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
          sortControl={
            <ToolbarSortDropdown<CurrentTenderSortOption>
              value={sortBy}
              onChange={setSortBy}
              options={CURRENT_TENDER_SORT_OPTIONS}
              defaultValue="CLOSING_SOONEST"
              accentColor="orange"
            />
          }
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
