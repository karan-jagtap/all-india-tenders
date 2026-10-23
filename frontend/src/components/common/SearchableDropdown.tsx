import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
  countSuffix?: string;
}

export interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  allOptionLabel: string;
  allOptionCount?: number;
  placeholder?: string;
  icon?: React.ReactNode;
  accentColor?: 'emerald' | 'orange' | 'blue' | 'rose' | 'amber';
  emptyMessage?: string;
  className?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  options,
  allOptionLabel,
  allOptionCount,
  placeholder = 'Search...',
  icon,
  accentColor = 'orange',
  emptyMessage = 'No matching options found',
  className = ''
}) => {
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
        if (spaceBelow < 260 && rect.top > 260) {
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

  // Find currently selected option object
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search query
  const query = searchQuery.trim().toLowerCase();
  const filteredOptions = query
    ? options.filter((opt) => opt.label.toLowerCase().includes(query))
    : options;

  // Does the query match "All ..."?
  const matchesAll = !query || allOptionLabel.toLowerCase().includes(query);

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
      case 'orange':
      default:
        return 'focus:border-orange-500';
    }
  };

  const getAccentCheckColor = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-400';
      case 'blue':
        return 'text-blue-400';
      case 'rose':
        return 'text-rose-400';
      case 'amber':
        return 'text-amber-400';
      case 'orange':
      default:
        return 'text-orange-400';
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
      case 'orange':
      default:
        return 'text-orange-400';
    }
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
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-xs text-white flex items-center justify-between transition-colors cursor-pointer ${
          isOpen
            ? 'border-slate-500 ring-1 ring-slate-600'
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {icon && <span className="shrink-0">{icon}</span>}
          {value === 'ALL' || !selectedOption ? (
            <span className="font-medium text-slate-200 truncate">
              {allOptionLabel}
              {typeof allOptionCount === 'number' && (
                <span className="text-slate-400 ml-1">({allOptionCount})</span>
              )}
            </span>
          ) : (
            <span className="font-bold text-white truncate">
              {selectedOption.label}
              {typeof selectedOption.count === 'number' && (
                <span className="text-slate-400 font-normal ml-1.5 text-[11px]">
                  ({selectedOption.count} {selectedOption.countSuffix || 'notices'})
                </span>
              )}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu (Contains Search Inside!) */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 flex flex-col text-xs animate-fadeIn ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
          style={{ maxHeight: '340px' }}
        >
          {/* Integrated Search Input INSIDE Dropdown */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${getAccentBorderClass()}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results Summary if Searching */}
          {query && (
            <div className="text-[10px] text-slate-400 px-2 pb-1.5 font-medium shrink-0 flex items-center justify-between">
              <span>{filteredOptions.length} matching result{filteredOptions.length === 1 ? '' : 's'}</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`${getAccentTextClass()} hover:underline cursor-pointer`}
              >
                Clear
              </button>
            </div>
          )}

          {/* Scrollable Options List */}
          <div className="overflow-y-auto space-y-0.5 pr-1 flex-1 max-h-60 custom-scrollbar">
            {/* "All" Option */}
            {matchesAll && (
              <button
                type="button"
                onClick={() => {
                  onChange('ALL');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  value === 'ALL'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{allOptionLabel}</span>
                  {typeof allOptionCount === 'number' && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({allOptionCount})
                    </span>
                  )}
                </div>
                {value === 'ALL' && (
                  <Check className={`w-3.5 h-3.5 ${getAccentCheckColor()} shrink-0`} />
                )}
              </button>
            )}

            {/* Divider if All Option was visible */}
            {matchesAll && filteredOptions.length > 0 && (
              <div className="border-t border-slate-800 my-1" />
            )}

            {/* Filtered Options List */}
            {filteredOptions.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2">{opt.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {typeof opt.count === 'number' && (
                      <span className={`text-[10px] font-mono ${opt.count === 0 ? 'text-slate-500' : 'text-slate-400'}`}>
                        {opt.count} {opt.countSuffix || ''}
                      </span>
                    )}
                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 ${getAccentCheckColor()}`} />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Zero results */}
            {!matchesAll && filteredOptions.length === 0 && (
              <div className="p-3 text-center text-slate-400 text-xs">
                <p>{emptyMessage} for "{searchQuery}"</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`mt-1.5 text-xs ${getAccentTextClass()} hover:underline font-semibold cursor-pointer`}
                >
                  Clear search query
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
