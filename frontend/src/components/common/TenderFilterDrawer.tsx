import React, { useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  X,
  Globe,
  Building2,
  MapPin,
  Tag,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { QUICK_PORTAL_PILLS } from '../../constants';
import { SearchableDropdown, DropdownOption } from './SearchableDropdown';

export interface TenderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  accentColor?: 'orange' | 'emerald' | 'blue';
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  totalFilteredCount: number;

  // 1. Work Category / Sector
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  availableCategories: string[];
  categoryCounts: Map<string, number>;
  contextCategoryCount: number;

  // 2. Procurement Portal / Source
  selectedSource: string;
  setSelectedSource: (src: string) => void;
  availableSources: string[];
  sourceCounts: Map<string, number>;
  contextSourceCount: number;

  // 3. Procuring Organization
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
  availableOrgs: string[];
  orgCounts: Map<string, number>;
  contextOrgCount: number;

  // 4. State
  selectedState: string;
  setSelectedState: (st: string) => void;
  availableStates: string[];
  stateCounts: Map<string, number>;
  contextStateCount: number;

  // 5. City
  selectedCity: string;
  setSelectedCity: (ct: string) => void;
  availableCities: string[];
  cityCounts: Map<string, number>;
  contextCityCount: number;

  // Custom Extra Filters Slot (e.g. Value Range in Current Tenders, or Award Year in Accepted Tenders)
  extraFilters?: React.ReactNode;
}

export const TenderFilterDrawer: React.FC<TenderFilterDrawerProps> = ({
  isOpen,
  onClose,
  title = 'Tender Filters',
  subtitle = 'Refine procurement notices by authority, portal, sector, and location',
  accentColor = 'orange',
  activeFiltersCount,
  hasActiveFilters,
  resetAllFilters,
  totalFilteredCount,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  categoryCounts,
  contextCategoryCount,
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
  extraFilters
}) => {
  // Close on Escape key
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
    return availableCategories.map((cat) => ({
      value: cat,
      label: cat,
      count: categoryCounts.get(cat) || 0,
      countSuffix: 'notices'
    }));
  }, [availableCategories, categoryCounts]);

  const sourceOptions: DropdownOption[] = useMemo(() => {
    return availableSources.map((src) => ({
      value: src,
      label: src,
      count: sourceCounts.get(src) || 0,
      countSuffix: 'notices'
    }));
  }, [availableSources, sourceCounts]);

  const orgOptions: DropdownOption[] = useMemo(() => {
    return availableOrgs.map((org) => ({
      value: org,
      label: org,
      count: orgCounts.get(org) || 0,
      countSuffix: 'notices'
    }));
  }, [availableOrgs, orgCounts]);

  const stateOptions: DropdownOption[] = useMemo(() => {
    return availableStates.map((st) => ({
      value: st,
      label: st,
      count: stateCounts.get(st) || 0,
      countSuffix: 'notices'
    }));
  }, [availableStates, stateCounts]);

  const cityOptions: DropdownOption[] = useMemo(() => {
    return availableCities.map((ct) => ({
      value: ct,
      label: ct,
      count: cityCounts.get(ct) || 0,
      countSuffix: 'notices'
    }));
  }, [availableCities, cityCounts]);

  if (!isOpen) return null;

  const getHeaderIconBg = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400';
      case 'blue':
        return 'bg-blue-600/20 border-blue-500/40 text-blue-400';
      case 'orange':
      default:
        return 'bg-orange-600/20 border-orange-500/40 text-orange-400';
    }
  };

  const getHeaderBadgeClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-emerald-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'orange':
      default:
        return 'bg-orange-500 text-white';
    }
  };

  const getResetBtnClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-400 hover:text-emerald-300';
      case 'blue':
        return 'text-blue-400 hover:text-blue-300';
      case 'orange':
      default:
        return 'text-orange-400 hover:text-orange-300';
    }
  };

  const getApplyBtnClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white';
      case 'blue':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white';
      case 'orange':
      default:
        return 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 z-10 animate-slideInRight">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${getHeaderIconBg()}`}>
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{title}</span>
                  {activeFiltersCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getHeaderBadgeClass()}`}>
                      {activeFiltersCount} Active
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className={`text-xs font-semibold px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${getResetBtnClass()}`}
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
            {/* 1. Work Category / Sector */}
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
              <SearchableDropdown
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                allOptionLabel="All Work Categories"
                allOptionCount={contextCategoryCount}
                placeholder="Search category or sector..."
                icon={<Tag className="w-3.5 h-3.5 text-emerald-400" />}
                accentColor="emerald"
              />
            </div>

            {/* 2. Procurement Portal / Source */}
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
              <SearchableDropdown
                value={selectedSource}
                onChange={setSelectedSource}
                options={sourceOptions}
                allOptionLabel="All Procurement Portals"
                allOptionCount={contextSourceCount}
                placeholder="Search portal name or acronym..."
                icon={<Globe className="w-3.5 h-3.5 text-orange-400" />}
                accentColor="orange"
              />

              {/* Quick Source Pill Shortcuts */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {QUICK_PORTAL_PILLS.map((pill) => (
                  <button
                    key={pill.val}
                    type="button"
                    onClick={() => setSelectedSource(selectedSource === pill.val ? 'ALL' : pill.val)}
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

            {/* 3. Procuring Organization */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Procuring Organisation / Ministry</span>
                </label>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-950/60 border border-blue-800/60 px-1.5 py-0.5 rounded">
                  {availableOrgs.length} Orgs
                </span>
              </div>
              <SearchableDropdown
                value={selectedOrg}
                onChange={setSelectedOrg}
                options={orgOptions}
                allOptionLabel="All Organizations"
                allOptionCount={contextOrgCount}
                placeholder="Search authority, PSU, ministry, municipal body..."
                icon={<Building2 className="w-3.5 h-3.5 text-blue-400" />}
                accentColor="blue"
              />
            </div>

            {/* 4. Location: State & City */}
            <div className="space-y-3 bg-slate-800/20 p-3 rounded-xl border border-slate-800">
              {/* State Filter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>State / Union Territory</span>
                  </label>
                  <span className="text-[10px] text-rose-400 font-mono bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                    {availableStates.length} States
                  </span>
                </div>
                <SearchableDropdown
                  value={selectedState}
                  onChange={(val) => {
                    setSelectedState(val);
                    setSelectedCity('ALL');
                  }}
                  options={stateOptions}
                  allOptionLabel="All States & UTs"
                  allOptionCount={contextStateCount}
                  placeholder="Search Indian State or UT..."
                  icon={<MapPin className="w-3.5 h-3.5 text-rose-400" />}
                  accentColor="rose"
                />
              </div>

              {/* City Filter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>City / District</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                    {availableCities.length} Cities
                  </span>
                </div>
                <SearchableDropdown
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={cityOptions}
                  allOptionLabel={selectedState !== 'ALL' ? `All Cities in ${selectedState}` : 'All Cities'}
                  allOptionCount={contextCityCount}
                  placeholder="Search city or district..."
                  icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
                  accentColor="amber"
                />
              </div>
            </div>

            {/* 5. Custom Extra Slot (Value Range or Award Year) */}
            {extraFilters}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 sticky bottom-0 z-20">
            <div className="text-xs text-slate-400">
              Matching:{' '}
              <span className="font-bold text-white font-mono">{totalFilteredCount}</span> notices
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${getApplyBtnClass()}`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>View {totalFilteredCount} Notices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
