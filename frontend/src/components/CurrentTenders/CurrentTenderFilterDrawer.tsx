import React from 'react';
import { Clock } from 'lucide-react';
import { VALUE_RANGE_OPTIONS } from '../../constants';
import { TenderFilterDrawer } from '../common';

export interface CurrentTenderFilterDrawerProps {
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

  // Closed / Expired Toggle
  includeClosed: boolean;
  setIncludeClosed: (inc: boolean) => void;
  openCount: number;
  totalAvailableCount: number;
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
  setSelectedValueRange,
  includeClosed,
  setIncludeClosed,
  openCount,
  totalAvailableCount
}) => {
  return (
    <TenderFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Live Tender Filters"
      subtitle="Refine in-progress procurement notices by authority, portal, sector, and location"
      accentColor="orange"
      activeFiltersCount={activeFiltersCount}
      hasActiveFilters={hasActiveFilters}
      resetAllFilters={resetAllFilters}
      totalFilteredCount={totalFilteredCount}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      availableCategories={availableCategories}
      categoryCounts={categoryCounts}
      contextCategoryCount={contextCategoryCount}
      selectedSource={selectedSource}
      setSelectedSource={setSelectedSource}
      availableSources={availableSources}
      sourceCounts={sourceCounts}
      contextSourceCount={contextSourceCount}
      selectedOrg={selectedOrg}
      setSelectedOrg={setSelectedOrg}
      availableOrgs={availableOrgs}
      orgCounts={orgCounts}
      contextOrgCount={contextOrgCount}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      availableStates={availableStates}
      stateCounts={stateCounts}
      contextStateCount={contextStateCount}
      selectedCity={selectedCity}
      setSelectedCity={setSelectedCity}
      availableCities={availableCities}
      cityCounts={cityCounts}
      contextCityCount={contextCityCount}
      extraFilters={
        <div className="space-y-4">
          {/* Include Closed / Expired Notices Toggle */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <label
                  className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                  onClick={() => setIncludeClosed(!includeClosed)}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Include Closed / Expired Notices</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Include notices whose bid submission deadline has elapsed (under technical & financial evaluation).
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={includeClosed}
                onClick={() => setIncludeClosed(!includeClosed)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  includeClosed ? 'bg-orange-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    includeClosed ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 pt-1.5 border-t border-slate-700/60 text-[10px] text-slate-300">
              <span className={`px-2 py-0.5 rounded font-semibold ${!includeClosed ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-400'}`}>
                Open Bids: {openCount.toLocaleString()}
              </span>
              <span className={`px-2 py-0.5 rounded font-semibold ${includeClosed ? 'bg-orange-950/80 text-orange-300 border border-orange-800' : 'bg-slate-900 text-slate-400'}`}>
                All Notices: {totalAvailableCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Value Range Filter */}
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
              {VALUE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      }
    />
  );
};
