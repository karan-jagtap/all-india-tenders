import React from 'react';
import {
  Search,
  Mic,
  MicOff,
  SlidersHorizontal,
  RotateCcw,
  RefreshCw,
  X,
  Tag,
  Globe,
  Building2,
  MapPin,
  Clock
} from 'lucide-react';

interface CurrentTendersTopBarProps {
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
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
      {/* Clean Single Row Toolbar: Search on LEFT, Filter button & Reload on RIGHT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* LEFT: Search Bar with Voice Input */}
        <div className="relative flex-1 min-w-[240px] max-w-xl">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isVoiceSearching
                ? '🎙️ Listening to voice query...'
                : 'Search live tenders, ref no, authority, city...'
            }
            className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border text-xs rounded-lg pl-9 pr-16 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              isVoiceSearching
                ? 'border-red-400 ring-2 ring-red-400 bg-red-50 text-red-900'
                : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500/20'
            }`}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/60 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={toggleVoiceSearch}
              title={isVoiceSearching ? 'Listening... click to stop' : 'Click to speak search query'}
              className={`p-1 rounded transition-colors ${
                isVoiceSearching
                  ? 'text-red-600 animate-pulse bg-red-100'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              {isVoiceSearching ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* RIGHT: Primary Filters Button (opens sidebar) & Action Controls */}
        <div className="flex items-center gap-2 shrink-0 justify-end">
          {/* PRIMARY FILTER BUTTON: Opens Right Overlapping Sidebar Drawer */}
          <button
            onClick={onOpenFilterDrawer}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              activeFiltersCount > 0
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-2 ring-orange-500/30 hover:brightness-105'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
            title="Open comprehensive filters in right sidebar drawer"
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${activeFiltersCount > 0 ? 'text-white' : 'text-orange-500'}`} />
            <span>Filters</span>
            {activeFiltersCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-orange-700 font-black shadow-2xs">
                {activeFiltersCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-normal">
                (Sidebar)
              </span>
            )}
          </button>

          {/* Reset Filters Quick Button (if any active) */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Reload Button */}
          <button
            onClick={loadData}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Reload live tenders catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload ({totalTendersCount})</span>
          </button>
        </div>
      </div>

      {/* Applied Filters Tag Chips (visible when filters are active) */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold mr-1">Applied:</span>

          {selectedCategory !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>Category: {selectedCategory}</span>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="hover:text-emerald-950 cursor-pointer ml-0.5"
                title="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSource !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <Globe className="w-3 h-3 text-orange-600" />
              <span>Source: {selectedSource}</span>
              <button
                onClick={() => setSelectedSource('ALL')}
                className="hover:text-orange-950 cursor-pointer ml-0.5"
                title="Remove source filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedOrg !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <Building2 className="w-3 h-3 text-blue-600" />
              <span>Org: {selectedOrg}</span>
              <button
                onClick={() => setSelectedOrg('ALL')}
                className="hover:text-blue-950 cursor-pointer ml-0.5"
                title="Remove organisation filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedState !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-rose-600" />
              <span>State: {selectedState}</span>
              <button
                onClick={() => {
                  setSelectedState('ALL');
                  setSelectedCity('ALL');
                }}
                className="hover:text-rose-950 cursor-pointer ml-0.5"
                title="Remove state filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCity !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>City: {selectedCity}</span>
              <button
                onClick={() => setSelectedCity('ALL')}
                className="hover:text-amber-950 cursor-pointer ml-0.5"
                title="Remove city filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedValueRange !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <Clock className="w-3 h-3 text-yellow-600" />
              <span>
                {selectedValueRange === 'CLOSING_SOON'
                  ? '⚡ Closing Soon'
                  : selectedValueRange === 'UNDER_10CR'
                  ? '< ₹ 10 Cr'
                  : selectedValueRange === '10CR_50CR'
                  ? '₹ 10–50 Cr'
                  : '> ₹ 50 Cr'}
              </span>
              <button
                onClick={() => setSelectedValueRange('ALL')}
                className="hover:text-yellow-950 cursor-pointer ml-0.5"
                title="Remove value filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery.trim() !== '' && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <span>Query: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-slate-950 cursor-pointer ml-0.5"
                title="Clear query"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetAllFilters}
            className="text-orange-600 hover:text-orange-700 font-semibold text-[11px] underline ml-1 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
