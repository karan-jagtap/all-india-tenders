import React, { useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  X,
  Tag,
  MapPin,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { SearchableDropdown, DropdownOption } from '../common';

export type BidderSortOption =
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'CONTRACTS_DESC'
  | 'VALUE_DESC'
  | 'TURNOVER_DESC';

export interface BidderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  totalFilteredCount: number;

  // 1. Work Specialization / Category
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  allCategories: string[];
  categoryCounts?: Map<string, number>;
  totalBidders: number;

  // 2. State / Region
  selectedState: string;
  setSelectedState: (st: string) => void;
  allStates: string[];
  stateCounts?: Map<string, number>;

  // 3. Ranking & Sorting
  sortBy: BidderSortOption;
  setSortBy: (s: BidderSortOption) => void;
}

export const SORT_OPTIONS: { value: BidderSortOption; label: string; desc: string }[] = [
  {
    value: 'NAME_ASC',
    label: 'Alphabetical (A → Z)',
    desc: 'Contractors sorted by corporate name from A to Z'
  },
  {
    value: 'NAME_DESC',
    label: 'Alphabetical (Z → A)',
    desc: 'Contractors sorted by corporate name from Z to A'
  },
  {
    value: 'CONTRACTS_DESC',
    label: 'Most Contracts Won',
    desc: 'Ranked by total public procurement contracts won till date'
  },
  {
    value: 'VALUE_DESC',
    label: 'Highest Total Value Awarded',
    desc: 'Ranked by cumulative rupee value of won government tenders'
  },
  {
    value: 'TURNOVER_DESC',
    label: 'Highest Audited Turnover',
    desc: 'Ranked by statutory audited annual turnover from balance sheets'
  }
];

interface BidderSortOptionCardProps {
  option: (typeof SORT_OPTIONS)[number];
  isSelected: boolean;
  onSelect: (val: BidderSortOption) => void;
}

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

  // Memoized options for SearchableDropdowns
  const categoryOptions: DropdownOption[] = useMemo(() => {
    return allCategories.map((c) => ({
      value: c,
      label: c,
      count: categoryCounts?.get(c) ?? 0,
      countSuffix: 'bidders'
    }));
  }, [allCategories, categoryCounts]);

  const stateOptions: DropdownOption[] = useMemo(() => {
    return allStates.map((s) => ({
      value: s,
      label: s,
      count: stateCounts?.get(s) ?? 0,
      countSuffix: 'bidders'
    }));
  }, [allStates, stateCounts]);

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
                  <span>Contractor Directory Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow-xs">
                      {activeFiltersCount} Active
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Refine registered contractors by specialization, state, and ranking
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
                  Reset All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close filter drawer (Esc)"
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
                  <span>Work Specialization / Sector</span>
                </label>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-950/60 border border-blue-800/60 px-1.5 py-0.5 rounded">
                  {allCategories.length} Specializations
                </span>
              </div>
              <SearchableDropdown
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                allOptionLabel="All Specializations"
                allOptionCount={totalBidders}
                placeholder="Search specialization or sector..."
                icon={<Tag className="w-3.5 h-3.5 text-blue-400" />}
                accentColor="blue"
              />
            </div>

            {/* 2. State / Operational Region */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>State / Operational Region</span>
                </label>
                <span className="text-[10px] text-rose-400 font-mono bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                  {allStates.length} States
                </span>
              </div>
              <SearchableDropdown
                value={selectedState}
                onChange={setSelectedState}
                options={stateOptions}
                allOptionLabel="All States"
                allOptionCount={totalBidders}
                placeholder="Search state..."
                icon={<MapPin className="w-3.5 h-3.5 text-rose-400" />}
                accentColor="rose"
              />
            </div>

            {/* 3. Ranking & Sorting */}
            <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contractor Ranking & Sorting</span>
              </label>
              <div className="space-y-1.5">
                {SORT_OPTIONS.map((opt) => (
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
              Reset All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
            >
              <span>Apply & Show {totalFilteredCount} Contractors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
