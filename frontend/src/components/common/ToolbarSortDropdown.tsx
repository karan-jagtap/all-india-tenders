import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ToolbarSortOption, ToolbarSortDropdownProps } from '../../types';

export type { ToolbarSortOption, ToolbarSortDropdownProps };

export function ToolbarSortDropdown<T extends string = string>({
  value,
  onChange,
  options,
  defaultValue,
  accentColor = 'orange',
  className = ''
}: ToolbarSortDropdownProps<T>) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const isCustomSort = defaultValue !== undefined && value !== defaultValue;

  const getAccentActiveClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50';
      case 'blue':
        return 'text-blue-400 bg-blue-950/60 border-blue-500/50';
      case 'orange':
      default:
        return 'text-orange-400 bg-orange-950/60 border-orange-500/50';
    }
  };

  const getAccentCheckClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-400';
      case 'blue':
        return 'text-blue-400';
      case 'orange':
      default:
        return 'text-orange-400';
    }
  };

  const getAccentBorderClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'border-emerald-500/40';
      case 'blue':
        return 'border-blue-500/40';
      case 'orange':
      default:
        return 'border-orange-500/40';
    }
  };

  const handleSelect = (optionVal: T) => {
    onChange(optionVal);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs select-none ${
          isCustomSort
            ? getAccentActiveClass()
            : 'bg-white dark:bg-[#141C2E] hover:bg-slate-50 dark:hover:bg-[#18233A] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        } ${isOpen ? 'ring-1 ring-slate-400 dark:ring-slate-600' : ''}`}
        title={t('common.sortBy')}
      >
        <ArrowUpDown className={`w-3.5 h-3.5 shrink-0 ${isCustomSort ? getAccentCheckClass() : 'text-slate-400'}`} />
        <span className="hidden sm:inline text-slate-400 font-normal">{t('common.sort')}</span>
        <span className="truncate max-w-[130px] sm:max-w-[160px]">
          {selectedOption?.shortLabel || selectedOption?.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 z-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 min-w-[210px] sm:min-w-[230px] text-xs space-y-0.5 animate-fadeIn"
          style={{ maxHeight: '360px' }}
        >
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
            <span>{t('common.sortOrder')}</span>
            {isCustomSort && (
              <span className={`text-[9px] font-semibold ${getAccentCheckClass()}`}>{t('common.custom')}</span>
            )}
          </div>

          <div className="overflow-y-auto max-h-72 space-y-0.5 custom-scrollbar">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? `bg-slate-800 text-white font-bold border ${getAccentBorderClass()}`
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.desc && (
                      <span className="text-[10px] text-slate-400 font-normal truncate">
                        {opt.desc}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${getAccentCheckClass()} shrink-0`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
