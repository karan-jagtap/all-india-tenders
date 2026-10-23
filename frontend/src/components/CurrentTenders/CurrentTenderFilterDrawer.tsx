import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Globe,
  Building2,
  MapPin,
  Tag,
  Clock,
  RotateCcw,
  Search,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { QUICK_PORTAL_PILLS, VALUE_RANGE_OPTIONS } from '../../constants';

interface CurrentTenderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  totalFilteredCount: number;
  // Source
  selectedSource: string;
  setSelectedSource: (s: string) => void;
  availableSources: string[];
  sourceCounts: Map<string, number>;
  contextSourceCount: number;
  // Org
  selectedOrg: string;
  setSelectedOrg: (o: string) => void;
  availableOrgs: string[];
  orgCounts: Map<string, number>;
  contextOrgCount: number;
  // State
  selectedState: string;
  setSelectedState: (s: string) => void;
  availableStates: string[];
  stateCounts: Map<string, number>;
  contextStateCount: number;
  // City
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  availableCities: string[];
  cityCounts: Map<string, number>;
  contextCityCount: number;
  // Category
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  availableCategories: string[];
  categoryCounts: Map<string, number>;
  contextCategoryCount: number;
  // Value Range
  selectedValueRange: string;
  setSelectedValueRange: (v: string) => void;
}

export const CurrentTenderFilterDrawer: React.FC<CurrentTenderFilterDrawerProps> = ({
  isOpen,
  onClose,
  activeFiltersCount,
  hasActiveFilters,
  resetAllFilters,
  totalFilteredCount,
  selectedSource,
  setSelectedSource,
  availableSources,
  sourceCounts,
  contextSourceCount,
  selectedOrg,
  setSelectedOrg,
  availableOrgs,
  orgCounts,
  contextOrgCount,
  selectedState,
  setSelectedState,
  availableStates,
  stateCounts,
  contextStateCount,
  selectedCity,
  setSelectedCity,
  availableCities,
  cityCounts,
  contextCityCount,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  categoryCounts,
  contextCategoryCount,
  selectedValueRange,
  setSelectedValueRange
}) => {
  const [drawerOrgSearch, setDrawerOrgSearch] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer Sliding Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 z-10 animate-slideInRight">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Tender Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                      {activeFiltersCount} Active
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">
                  All filter controls switched to sidebar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Reset All
                </button>
              )}
              <button
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
            {/* 1. TOP FILTER: Work Category / Sector (At top as requested) */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Work Category / Sector</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  {availableCategories.length} Categories
                </span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium">
                  All Work Categories ({contextCategoryCount})
                </option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat} ({categoryCounts.get(cat) || 0} notices)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. TOP FILTER: Procurement Portal (Source) (At top as requested) */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-orange-400" />
                  <span>Procurement Portal (Source)</span>
                </label>
                <span className="text-[10px] text-orange-400 font-mono bg-orange-950/60 border border-orange-800/60 px-1.5 py-0.5 rounded">
                  {availableSources.length} Portals
                </span>
              </div>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium">
                  All Procurement Portals ({contextSourceCount})
                </option>
                {availableSources.map(src => (
                  <option key={src} value={src} className="bg-slate-900 text-white">
                    {src} ({sourceCounts.get(src) || 0} notices)
                  </option>
                ))}
              </select>

              {/* Quick Source Pill Shortcuts */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {QUICK_PORTAL_PILLS.map((pill) => (
                  <button
                    key={pill.val}
                    onClick={() => setSelectedSource(pill.val)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      selectedSource === pill.val
                        ? pill.activeClass
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Procuring Organisation / Ministry */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Procuring Organisation / Ministry</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {availableOrgs.length} Entities
                </span>
              </div>

              {availableOrgs.length > 8 && (
                <div className="relative mb-1">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={drawerOrgSearch}
                    onChange={(e) => setDrawerOrgSearch(e.target.value)}
                    placeholder="Search organisation name..."
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-md pl-7 pr-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium">
                  All Procuring Entities ({contextOrgCount})
                </option>
                {availableOrgs
                  .filter(org => !drawerOrgSearch || org.toLowerCase().includes(drawerOrgSearch.toLowerCase()))
                  .map(org => (
                    <option key={org} value={org} className="bg-slate-900 text-white">
                      {org} ({orgCounts.get(org) || 0} notices)
                    </option>
                  ))}
              </select>
            </div>

            {/* 4. State & Territory */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>State / Territory</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {availableStates.length} States
                </span>
              </div>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('ALL');
                }}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium">
                  All States & Union Territories ({contextStateCount})
                </option>
                {availableStates.map(state => (
                  <option key={state} value={state} className="bg-slate-900 text-white">
                    {state} ({stateCounts.get(state) || 0} notices)
                  </option>
                ))}
              </select>
            </div>

            {/* 5. City / District */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>City / District</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {availableCities.length} Cities
                </span>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium">
                  All Cities / Districts ({contextCityCount})
                </option>
                {availableCities.map(city => (
                  <option key={city} value={city} className="bg-slate-900 text-white">
                    {city} ({cityCounts.get(city) || 0} notices)
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Estimated Procurement Value & Urgency */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Estimated Value & Urgency</span>
                </label>
              </div>
              <select
                value={selectedValueRange}
                onChange={(e) => setSelectedValueRange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {VALUE_RANGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drawer Sticky Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 sticky bottom-0 z-20 flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>View {totalFilteredCount} Tenders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
