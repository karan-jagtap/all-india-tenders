import React from 'react';
import { Search, Tag, MapPin, TrendingUp, RotateCcw } from 'lucide-react';
import { QUICK_SECTOR_CHIPS } from '../../constants';

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
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
      {/* Primary Bar: Search on LEFT, Filters & Sort on RIGHT */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* LEFT SECTION: Search Box */}
        <div className="relative min-w-[260px] flex-1 max-w-lg">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contractor, CIN, GSTIN, PAN, city, authority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        {/* RIGHT SECTION: Dropdowns & Reset */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs">
            <Tag className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-300 font-semibold">Specialization:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Specializations ({allCategories.length})</option>
              {allCategories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-slate-300 font-semibold">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="ALL" className="bg-slate-900 text-white">All States ({allStates.length})</option>
              {allStates.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as BidderSortOption)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
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
