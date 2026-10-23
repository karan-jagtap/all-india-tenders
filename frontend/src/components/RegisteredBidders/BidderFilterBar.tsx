import React, { useMemo } from 'react';
import { Tag, MapPin, TrendingUp, RotateCcw } from 'lucide-react';
import { QUICK_SECTOR_CHIPS } from '../../constants';
import { FilterSearchBar, SearchableDropdown, DropdownOption } from '../common';

export type BidderSortOption = 'NAME_ASC' | 'NAME_DESC' | 'CONTRACTS_DESC' | 'VALUE_DESC' | 'TURNOVER_DESC';

export interface BidderFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  allCategories: string[];
  selectedState: string;
  setSelectedState: (s: string) => void;
  allStates: string[];
  sortBy: BidderSortOption;
  setSortBy: (s: BidderSortOption) => void;
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

export const BidderFilterBar: React.FC<BidderFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  allCategories,
  selectedState,
  setSelectedState,
  allStates,
  sortBy,
  setSortBy,
  hasActiveFilters,
  resetFilters
}) => {
  const categoryOptions: DropdownOption[] = useMemo(() => {
    return allCategories.map((c) => ({
      value: c,
      label: c
    }));
  }, [allCategories]);

  const stateOptions: DropdownOption[] = useMemo(() => {
    return allStates.map((s) => ({
      value: s,
      label: s
    }));
  }, [allStates]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
      {/* Primary Bar: Search on LEFT, Filters & Sort on RIGHT */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* LEFT SECTION: Search Box */}
        <FilterSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search contractor, CIN, GSTIN, PAN, city, authority..."
          variant="dark"
          accentColor="blue"
          className="max-w-lg"
        />

        {/* RIGHT SECTION: Dropdowns & Reset */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Category Filter */}
          <div className="w-full sm:w-52">
            <SearchableDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              allOptionLabel="All Specializations"
              allOptionCount={allCategories.length}
              placeholder="Search specialization..."
              icon={<Tag className="w-3.5 h-3.5 text-blue-400" />}
              accentColor="blue"
            />
          </div>

          {/* State Filter */}
          <div className="w-full sm:w-48">
            <SearchableDropdown
              value={selectedState}
              onChange={setSelectedState}
              options={stateOptions}
              allOptionLabel="All States"
              allOptionCount={allStates.length}
              placeholder="Search state..."
              icon={<MapPin className="w-3.5 h-3.5 text-rose-400" />}
              accentColor="rose"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs w-full sm:w-auto">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as BidderSortOption)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer flex-1"
            >
              <option value="NAME_ASC" className="bg-slate-900 text-white">Alphabetical (A → Z)</option>
              <option value="NAME_DESC" className="bg-slate-900 text-white">Alphabetical (Z → A)</option>
              <option value="CONTRACTS_DESC" className="bg-slate-900 text-white">Most Contracts Won</option>
              <option value="VALUE_DESC" className="bg-slate-900 text-white">Highest Total Value</option>
              <option value="TURNOVER_DESC" className="bg-slate-900 text-white">Highest Audited Turnover</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Sector Quick Filter Chips */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0">Quick Sector:</span>
        {QUICK_SECTOR_CHIPS.map((chip) => {
          const isActive = (chip.val === 'ALL' && selectedCategory === 'ALL') || selectedCategory === chip.val;
          return (
            <button
              key={chip.val}
              onClick={() => setSelectedCategory(chip.val)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
