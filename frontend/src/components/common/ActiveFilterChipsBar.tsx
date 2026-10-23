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
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300';
      case 'blue':
        return 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-300';
      case 'rose':
        return 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-300';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300';
      case 'violet':
        return 'bg-violet-50 text-violet-800 border-violet-200 hover:border-violet-300';
      case 'slate':
        return 'bg-slate-100 text-slate-800 border-slate-300 hover:border-slate-400';
      case 'orange':
      default:
        return 'bg-orange-50 text-orange-800 border-orange-200 hover:border-orange-300';
    }
  };

  return (
    <div
      className={`pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs animate-fadeIn ${className}`}
    >
      <span className="text-[11px] text-slate-500 font-semibold mr-1">Applied:</span>

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
