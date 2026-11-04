import React from 'react';
import {
  FilterSearchBar,
  TopFilterActionBar,
  ActiveFilterChipsBar,
  FilterChipItem
} from '../common';

export interface BidderFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isVoiceSearching: boolean;
  toggleVoiceSearch: () => void;
  onOpenFilterDrawer: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetFilters: () => void;
  onReload: () => void;
  isLoading: boolean;
  totalBidders: number;
  chips: FilterChipItem[];
}

export const BidderFilterBar: React.FC<BidderFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  isVoiceSearching,
  toggleVoiceSearch,
  onOpenFilterDrawer,
  activeFiltersCount,
  hasActiveFilters,
  resetFilters,
  onReload,
  isLoading,
  totalBidders,
  chips
}) => {
  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5 transition-colors">
      {/* Clean Single Row Toolbar: Search on LEFT, Filters & Reload on RIGHT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Reusable Search Bar Component */}
        <FilterSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search registered contractors, CIN, GSTIN, PAN, city, authority..."
          isVoiceSearching={isVoiceSearching}
          toggleVoiceSearch={toggleVoiceSearch}
          accentColor="blue"
          className="max-w-xl"
        />

        {/* Reusable Top Action Bar Component */}
        <TopFilterActionBar
          onOpenFilters={onOpenFilterDrawer}
          activeFiltersCount={activeFiltersCount}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
          onReload={onReload}
          isLoading={isLoading}
          totalCount={totalBidders}
          reloadLabel="Reload"
          accentColor="blue"
        />
      </div>

      {/* Reusable Applied Filters Tag Chips Bar */}
      <ActiveFilterChipsBar
        chips={chips}
        onClearAll={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};
