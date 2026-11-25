import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, Check, X, RotateCcw } from 'lucide-react';
import type { DropdownOption, MultiSelectDropdownProps } from '../../types';

export type { MultiSelectDropdownProps };

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  values,
  onChange,
  options,
  allOptionLabel,
  allOptionCount,
  placeholder,
  icon,
  accentColor = 'orange',
  emptyMessage,
  className = '',
  maxPreviewCount = 2
}) => {
  const { t } = useTranslation();
  const effectivePlaceholder = placeholder ?? (t('common.search') + '...');
  const effectiveEmptyMessage = emptyMessage ?? t('common.dropdown.noMatchingOptions');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openUpward, setOpenUpward] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input when dropdown opens & calculate open direction
  useEffect(() => {
    if (isOpen) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 280 && rect.top > 280) {
          setOpenUpward(true);
        } else {
          setOpenUpward(false);
        }
      }
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isAllSelected = !values || values.length === 0 || values.includes('ALL');
  const selectedValuesList = useMemo(() => {
    return isAllSelected ? [] : values.filter((v) => v !== 'ALL');
  }, [values, isAllSelected]);

  // Map option values to option objects for fast lookups
  const optionsMap = useMemo(() => {
    const map = new Map<string, DropdownOption>();
    options.forEach((opt) => map.set(opt.value, opt));
    return map;
  }, [options]);

  const selectedOptions = useMemo(() => {
    return selectedValuesList.map((val) => optionsMap.get(val) || { value: val, label: val });
  }, [selectedValuesList, optionsMap]);

  // Filter options based on search query
  const query = searchQuery.trim().toLowerCase();
  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(query);
      const valueMatch = opt.value.toLowerCase().includes(query);
      const countMatch = typeof opt.count === 'number' && String(opt.count).includes(query);
      const suffixMatch = opt.countSuffix ? opt.countSuffix.toLowerCase().includes(query) : false;
      return labelMatch || valueMatch || countMatch || suffixMatch;
    });
  }, [options, query]);

  // Does query match "All ..."?
  const matchesAll =
    !query ||
    allOptionLabel.toLowerCase().includes(query) ||
    (typeof allOptionCount === 'number' && String(allOptionCount).includes(query));

  const getAccentBorderClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'focus:border-emerald-500';
      case 'blue':
        return 'focus:border-blue-500';
      case 'rose':
        return 'focus:border-rose-500';
      case 'amber':
        return 'focus:border-amber-500';
      case 'violet':
        return 'focus:border-violet-500';
      case 'orange':
      default:
        return 'focus:border-orange-500';
    }
  };

  const getAccentBgClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-emerald-600 border-emerald-500 text-white';
      case 'blue':
        return 'bg-blue-600 border-blue-500 text-white';
      case 'rose':
        return 'bg-rose-600 border-rose-500 text-white';
      case 'amber':
        return 'bg-amber-600 border-amber-500 text-white';
      case 'violet':
        return 'bg-violet-600 border-violet-500 text-white';
      case 'orange':
      default:
        return 'bg-orange-600 border-orange-500 text-white';
    }
  };

  const getAccentBadgeClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-700/60';
      case 'blue':
        return 'bg-blue-950/70 text-blue-400 border-blue-700/60';
      case 'rose':
        return 'bg-rose-950/70 text-rose-400 border-rose-700/60';
      case 'amber':
        return 'bg-amber-950/70 text-amber-400 border-amber-700/60';
      case 'violet':
        return 'bg-violet-950/70 text-violet-400 border-violet-700/60';
      case 'orange':
      default:
        return 'bg-orange-950/70 text-orange-400 border-orange-700/60';
    }
  };

  const getAccentTextClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-400';
      case 'blue':
        return 'text-blue-400';
      case 'rose':
        return 'text-rose-400';
      case 'amber':
        return 'text-amber-400';
      case 'violet':
        return 'text-violet-400';
      case 'orange':
      default:
        return 'text-orange-400';
    }
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSelectAll = () => {
    onChange(['ALL']);
  };

  const handleClearAll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange(['ALL']);
  };

  const handleToggleOption = (optValue: string) => {
    if (isAllSelected) {
      onChange([optValue]);
    } else {
      if (values.includes(optValue)) {
        const next = values.filter((v) => v !== optValue && v !== 'ALL');
        onChange(next.length === 0 ? ['ALL'] : next);
      } else {
        const next = [...values.filter((v) => v !== 'ALL'), optValue];
        onChange(next);
      }
    }
  };

  const handleSelectFilteredAll = () => {
    if (filteredOptions.length === 0) return;
    const existing = new Set(isAllSelected ? [] : values.filter((v) => v !== 'ALL'));
    filteredOptions.forEach((opt) => existing.add(opt.value));
    onChange(Array.from(existing));
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggleOpen}
        className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-xs text-white flex items-center justify-between transition-colors cursor-pointer select-none ${
          isOpen
            ? 'border-slate-500 ring-1 ring-slate-600'
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          {icon && <span className="shrink-0">{icon}</span>}

          {isAllSelected ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-medium text-slate-200 truncate">
                {allOptionLabel}
              </span>
              {typeof allOptionCount === 'number' && (
                <span className="text-slate-400 font-mono text-[11px] shrink-0 bg-slate-700/60 px-1.5 py-0.5 rounded">
                  ({allOptionCount})
                </span>
              )}
            </div>
          ) : selectedValuesList.length === 1 ? (
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="font-bold text-white truncate">
                {selectedOptions[0]?.label || selectedValuesList[0]}
              </span>
              {typeof selectedOptions[0]?.count === 'number' && (
                <span className="text-slate-400 font-normal text-[11px] shrink-0 bg-slate-700/60 px-1.5 py-0.5 rounded font-mono">
                  ({selectedOptions[0].count}
                  {selectedOptions[0].countSuffix ? ` ${selectedOptions[0].countSuffix}` : ''})
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 border ${getAccentBadgeClass()}`}
              >
                {t('common.dropdown.selected', { count: selectedValuesList.length })}
              </span>
              <span className="font-medium text-slate-200 truncate text-[11px]">
                {selectedOptions
                  .slice(0, maxPreviewCount)
                  .map((o) => o.label)
                  .join(', ')}
                {selectedValuesList.length > maxPreviewCount &&
                  ` ${t('bidders.plusMore', { count: selectedValuesList.length - maxPreviewCount })}`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isAllSelected && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title={t('common.dropdown.clearSelection')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 flex flex-col text-xs animate-fadeIn ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
          style={{ maxHeight: '380px' }}
        >
          {/* Integrated Search Input Inside Dropdown */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={effectivePlaceholder}
              className={`w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${getAccentBorderClass()}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title={t('common.searchBar.clearSearch')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Toolbar / Summary */}
          <div className="flex items-center justify-between px-1 pb-2 pt-0.5 text-[11px] shrink-0 border-b border-slate-800 mb-1.5">
            <div className="flex items-center gap-1.5">
              {isAllSelected ? (
                <span className="text-slate-400 font-medium">{t('common.dropdown.allOptionsSelected')}</span>
              ) : (
                <span className="font-semibold text-white">
                  {t('common.dropdown.selectedCount', { count: selectedValuesList.length, total: options.length })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {query && filteredOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectFilteredAll}
                  className={`${getAccentTextClass()} hover:underline font-semibold cursor-pointer text-[10px]`}
                >
                  {t('common.dropdown.selectAllMatches', { count: filteredOptions.length })}
                </button>
              )}
              {!isAllSelected && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer text-[10px]"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>{t('common.dropdown.resetToAll')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Options List with Checkboxes */}
          <div className="overflow-y-auto space-y-0.5 pr-1 flex-1 max-h-60 custom-scrollbar">
            {/* "All" Option */}
            {matchesAll && (
              <button
                type="button"
                onClick={handleSelectAll}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  isAllSelected
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isAllSelected
                        ? getAccentBgClass()
                        : 'border-slate-600 bg-slate-800 text-transparent'
                    }`}
                  >
                    {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{allOptionLabel}</span>
                  {typeof allOptionCount === 'number' && (
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/80">
                      ({allOptionCount})
                    </span>
                  )}
                </div>
                {isAllSelected && (
                  <span className={`text-[10px] font-semibold ${getAccentTextClass()}`}>
                    {t('common.dropdown.active')}
                  </span>
                )}
              </button>
            )}

            {/* Divider if All Option was visible */}
            {matchesAll && filteredOptions.length > 0 && (
              <div className="border-t border-slate-800 my-1" />
            )}

            {/* Filtered Options List */}
            {filteredOptions.map((opt) => {
              const isChecked = !isAllSelected && values.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleToggleOption(opt.value)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer group ${
                    isChecked
                      ? 'bg-slate-800/90 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? getAccentBgClass()
                          : 'border-slate-600 bg-slate-800 text-transparent group-hover:border-slate-500'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{opt.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {typeof opt.count === 'number' && (
                      <span
                        className={`text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded border ${
                          isChecked
                            ? 'bg-slate-700 text-white border-slate-600'
                            : opt.count === 0
                            ? 'text-slate-500 bg-slate-800/50 border-slate-800'
                            : 'text-slate-400 bg-slate-800/80 border-slate-700/80'
                        }`}
                      >
                        {opt.count}
                        {opt.countSuffix ? ` ${opt.countSuffix}` : ''}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Zero results */}
            {!matchesAll && filteredOptions.length === 0 && (
              <div className="p-3 text-center text-slate-400 text-xs">
                <p>
                  {effectiveEmptyMessage} for "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={`mt-1.5 text-xs ${getAccentTextClass()} hover:underline font-semibold cursor-pointer`}
                >
                  {t('common.dropdown.clearSearchQuery')}
                </button>
              </div>
            )}
          </div>

          {/* Footer Bar: Apply / Done Button */}
          <div className="pt-2 mt-1.5 border-t border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-slate-400">
              {isAllSelected
                ? t('common.dropdown.showingAll')
                : (selectedValuesList.length === 1
                    ? t('common.dropdown.filterActive', { count: 1 })
                    : t('common.dropdown.filtersActive', { count: selectedValuesList.length }))}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all ${getAccentBgClass()}`}
            >
              {t('common.dropdown.done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
