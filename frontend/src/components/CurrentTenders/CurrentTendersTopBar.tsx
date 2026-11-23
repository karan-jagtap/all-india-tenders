import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Globe, Building2, MapPin, Clock, ArrowUpDown } from 'lucide-react';
import {
  FilterSearchBar,
  TopFilterActionBar,
  ActiveFilterChipsBar,
  FilterChipItem,
  ToolbarSortDropdown,
  ToolbarSortOption
} from '../common';
import { CurrentTenderSortOption, CurrentTendersTopBarProps } from '../../types';
import { CURRENT_TENDER_SORT_OPTIONS } from '../../constants';

export { CURRENT_TENDER_SORT_OPTIONS };
export type { CurrentTendersTopBarProps };

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
  const { t } = useTranslation();

  const localizedSortOptions = useMemo<ToolbarSortOption<CurrentTenderSortOption>[]>(() => [
    {
      value: 'CLOSING_SOONEST',
      label: t('currentTenders.sort.closingSoonest'),
      shortLabel: t('currentTenders.sort.closingSoonestShort'),
      desc: t('currentTenders.sort.closingSoonestDesc')
    },
    {
      value: 'CLOSING_LATEST',
      label: t('currentTenders.sort.closingLatest'),
      shortLabel: t('currentTenders.sort.closingLatestShort'),
      desc: t('currentTenders.sort.closingLatestDesc')
    },
    {
      value: 'VALUE_DESC',
      label: t('currentTenders.sort.valueDesc'),
      shortLabel: t('currentTenders.sort.valueDescShort'),
      desc: t('currentTenders.sort.valueDescDesc')
    },
    {
      value: 'VALUE_ASC',
      label: t('currentTenders.sort.valueAsc'),
      shortLabel: t('currentTenders.sort.valueAscShort'),
      desc: t('currentTenders.sort.valueAscDesc')
    },
    {
      value: 'PUBLISHED_DESC',
      label: t('currentTenders.sort.publishedDesc'),
      shortLabel: t('currentTenders.sort.publishedDescShort'),
      desc: t('currentTenders.sort.publishedDescDesc')
    },
    {
      value: 'PUBLISHED_ASC',
      label: t('currentTenders.sort.publishedAsc'),
      shortLabel: t('currentTenders.sort.publishedAscShort'),
      desc: t('currentTenders.sort.publishedAscDesc')
    },
    {
      value: 'EMD_DESC',
      label: t('currentTenders.sort.emdDesc'),
      shortLabel: t('currentTenders.sort.emdDescShort'),
      desc: t('currentTenders.sort.emdDescDesc')
    },
    {
      value: 'TITLE_ASC',
      label: t('currentTenders.sort.titleAsc'),
      shortLabel: t('currentTenders.sort.titleAscShort'),
      desc: t('currentTenders.sort.titleAscDesc')
    }
  ], [t]);
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
          label: t('common.category'),
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
          label: t('common.source'),
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
          label: t('common.organization'),
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
          label: t('common.state'),
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
          label: t('common.city'),
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
          ? t('currentTenders.filter.closingSoon')
          : selectedValueRange === 'UNDER_10CR'
          ? t('currentTenders.filter.under10Cr')
          : selectedValueRange === '10CR_50CR'
          ? t('currentTenders.filter.10to50Cr')
          : t('currentTenders.filter.above50Cr');
      list.push({
        id: 'valueRange',
        label: t('common.range'),
        value: labelVal,
        icon: <Clock className="w-3 h-3 text-amber-600" />,
        color: 'amber',
        onRemove: handleRemoveValueRangeChip
      });
    }

    if (sortBy !== 'CLOSING_SOONEST') {
      const activeOpt = localizedSortOptions.find((o) => o.value === sortBy);
      list.push({
        id: 'sort',
        label: t('common.sort'),
        value: activeOpt?.shortLabel || activeOpt?.label || sortBy,
        icon: <ArrowUpDown className="w-3 h-3 text-orange-600" />,
        color: 'orange',
        onRemove: () => setSortBy('CLOSING_SOONEST')
      });
    }

    if (searchQuery.trim() !== '') {
      list.push({
        id: 'query',
        label: t('common.query'),
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
    searchQuery,
    localizedSortOptions,
    t
  ]);

  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5">
      {/* Clean Single Row Toolbar: Search on LEFT, Filter button & Reload on RIGHT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Reusable Search Bar Component */}
        <FilterSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={t('currentTenders.searchPlaceholder')}
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
          reloadLabel={t('common.reload')}
          accentColor="orange"
          sortControl={
            <ToolbarSortDropdown<CurrentTenderSortOption>
              value={sortBy}
              onChange={setSortBy}
              options={localizedSortOptions}
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
