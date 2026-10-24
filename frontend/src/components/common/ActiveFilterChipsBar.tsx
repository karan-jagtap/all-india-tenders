import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export interface FilterChipItem {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: 'orange' | 'emerald' | 'blue' | 'rose' | 'amber' | 'slate' | 'violet';
  onRemove: () => void;
}

export interface ActiveFilterChipsBarProps {
  chips: FilterChipItem[];
  onClearAll: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export const ActiveFilterChipsBar: React.FC<ActiveFilterChipsBarProps> = ({
  chips,
  onClearAll,
  hasActiveFilters,
  className = ''
}) => {
  const visible = hasActiveFilters !== undefined ? hasActiveFilters : chips.length > 0;
  if (!visible || chips.length === 0) return null;

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300';
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:border-blue-300';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 hover:border-rose-300';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:border-amber-300';
      case 'violet':
        return 'bg-violet-50 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800 hover:border-violet-300';
      case 'slate':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-400';
      case 'orange':
      default:
        return 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:border-orange-300';
    }
  };

  return (
    <div
      className={`pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs animate-fadeIn ${className}`}
    >
      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">Applied:</span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className={`inline-flex items-center gap-1.5 border px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors shadow-2xs ${getColorClasses(
            chip.color
          )}`}
        >
          {chip.icon && <span className="shrink-0">{chip.icon}</span>}
          <span className="truncate max-w-[200px]" title={`${chip.label}: ${chip.value}`}>
            {chip.label}: <strong className="font-semibold">{chip.value}</strong>
          </span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="hover:opacity-75 cursor-pointer ml-0.5 p-0.5 rounded-full hover:bg-black/5 transition-colors"
            title={`Remove ${chip.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-[11px] text-slate-500 hover:text-slate-800 font-medium underline underline-offset-2 ml-1 cursor-pointer flex items-center gap-1 py-0.5 px-1 hover:bg-slate-100 rounded"
        title="Clear all active filters"
      >
        <RotateCcw className="w-2.5 h-2.5" />
        <span>Clear all</span>
      </button>
    </div>
  );
};
