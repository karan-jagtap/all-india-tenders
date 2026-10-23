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
      }
    />
  );
};
