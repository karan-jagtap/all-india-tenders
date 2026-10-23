import React from 'react';
import { SlidersHorizontal, RotateCcw, RefreshCw } from 'lucide-react';

export interface TopFilterActionBarProps {
  onOpenFilters: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onReload?: () => void;
  isLoading?: boolean;
  totalCount?: number;
  reloadLabel?: string;
  accentColor?: 'orange' | 'emerald' | 'blue';
  className?: string;
}

export const TopFilterActionBar: React.FC<TopFilterActionBarProps> = ({
  onOpenFilters,
  activeFiltersCount,
  hasActiveFilters,
  onResetFilters,
  onReload,
  isLoading = false,
  totalCount,
  reloadLabel = 'Reload',
  accentColor = 'orange',
  className = ''
}) => {
  const getFilterButtonActiveClasses = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-2 ring-emerald-500/30 hover:brightness-105';
      case 'blue':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 ring-blue-500/30 hover:brightness-105';
      case 'orange':
      default:
        return 'bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-2 ring-orange-500/30 hover:brightness-105';
    }
  };

  const getFilterBadgeColor = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-700';
      case 'blue':
        return 'text-blue-700';
      case 'orange':
      default:
        return 'text-orange-700';
    }
  };

  const getIconColor = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-500';
      case 'blue':
        return 'text-blue-500';
      case 'orange':
      default:
        return 'text-orange-500';
    }
  };

  return (
    <div className={`flex items-center gap-2 shrink-0 justify-end ${className}`}>
      {/* PRIMARY FILTER BUTTON: Opens Right Overlapping Sidebar Drawer */}
      <button
        onClick={onOpenFilters}
        className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
          activeFiltersCount > 0
            ? getFilterButtonActiveClasses()
            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
        }`}
        title="Open comprehensive filters in right sidebar drawer"
      >
        <SlidersHorizontal
          className={`w-3.5 h-3.5 ${activeFiltersCount > 0 ? 'text-white' : getIconColor()}`}
        />
        <span>Filters</span>
        {activeFiltersCount > 0 ? (
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-white font-black shadow-2xs ${getFilterBadgeColor()}`}
          >
            {activeFiltersCount}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-normal">(Sidebar)</span>
        )}
      </button>

      {/* Reset Filters Quick Button (if any active) */}
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3 text-slate-500" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}

      {/* Optional Reload Button */}
      {onReload && (
        <button
          onClick={onReload}
          disabled={isLoading}
          className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          title="Reload notices"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              accentColor === 'emerald'
                ? 'text-emerald-600'
                : accentColor === 'blue'
                ? 'text-blue-600'
                : 'text-orange-500'
            } ${isLoading ? 'animate-spin' : ''}`}
          />
          <span>
            {reloadLabel}
            {totalCount !== undefined ? ` (${totalCount.toLocaleString()})` : ''}
          </span>
        </button>
      )}
    </div>
  );
};
