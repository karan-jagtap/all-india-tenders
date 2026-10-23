import React from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';

export interface FilterSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  isVoiceSearching?: boolean;
  toggleVoiceSearch?: () => void;
  accentColor?: 'orange' | 'emerald' | 'blue' | 'slate';
  className?: string;
  variant?: 'light' | 'dark';
}

export const FilterSearchBar: React.FC<FilterSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = 'Search tenders, authority, ref no, city...',
  isVoiceSearching = false,
  toggleVoiceSearch,
  accentColor = 'orange',
  className = '',
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  const getAccentClass = () => {
    switch (accentColor) {
      case 'emerald':
        return 'focus:border-emerald-500 focus:ring-emerald-500/20';
      case 'blue':
        return 'focus:border-blue-500 focus:ring-blue-500/20';
      case 'slate':
        return 'focus:border-slate-500 focus:ring-slate-500/20';
      case 'orange':
      default:
        return 'focus:border-orange-500 focus:ring-orange-500/20';
    }
  };

  return (
    <div className={`relative flex-1 min-w-[240px] ${className}`}>
      <Search
        className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
          isDark ? 'text-slate-400' : 'text-slate-400'
        }`}
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={isVoiceSearching ? '🎙️ Listening to voice query...' : placeholder}
        className={`w-full text-xs rounded-lg pl-9 ${
          toggleVoiceSearch || searchQuery ? 'pr-16' : 'pr-3'
        } py-2.5 transition-all focus:outline-none focus:ring-2 ${
          isDark
            ? 'bg-slate-800/90 hover:bg-slate-800 text-white placeholder-slate-400 border border-slate-700'
            : 'bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200'
        } ${
          isVoiceSearching
            ? 'border-red-400 ring-2 ring-red-400 bg-red-50 text-red-900'
            : getAccentClass()
        }`}
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
            }`}
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {toggleVoiceSearch && (
          <button
            type="button"
            onClick={toggleVoiceSearch}
            title={isVoiceSearching ? 'Listening... click to stop' : 'Click to speak search query'}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isVoiceSearching
                ? 'text-red-600 animate-pulse bg-red-100'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            {isVoiceSearching ? (
              <MicOff className="w-3.5 h-3.5" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
