import React, { useState, useMemo } from 'react';
import { Globe, Search, Filter, RefreshCw } from 'lucide-react';
import { REAL_PORTAL_SOURCES } from '../../../constants/portalSources';
import { PortalSourceCard } from './PortalSourceCard';

export interface HomeSourcesDirectoryProps {
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const HomeSourcesDirectory: React.FC<HomeSourcesDirectoryProps> = ({
  onNavigate,
  onTriggerSync,
  isSyncing
}) => {
  const [portalSearch, setPortalSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Filtered Portal Sources
  const filteredPortals = useMemo(() => {
    return REAL_PORTAL_SOURCES.filter((portal) => {
      if (selectedCategory !== 'ALL' && portal.category !== selectedCategory) {
        return false;
      }
      if (selectedRegion !== 'ALL' && portal.region !== selectedRegion) {
        return false;
      }
      if (portalSearch.trim()) {
        const q = portalSearch.toLowerCase().trim();
        const blob = `${portal.name} ${portal.domain} ${portal.state} ${portal.region} ${portal.description} ${portal.keyAuthorities.join(' ')} ${portal.procurementTypes.join(' ')}`.toLowerCase();
        return blob.includes(q);
      }
      return true;
    });
  }, [portalSearch, selectedCategory, selectedRegion]);

  return (
    <section id="real-sources-directory" className="space-y-5 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-900 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-700" />
              Statutory Source Directory
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              What All Real Sources Are We Sourcing From?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct statutory ingestion from {REAL_PORTAL_SOURCES.length} official national procurement platforms, state government portals, and open data feeds.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Showing <strong className="text-slate-900">{filteredPortals.length}</strong> of {REAL_PORTAL_SOURCES.length} Real Portals
          </div>
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
            title="Trigger live statutory scraper across all 28 real government tender portals"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Scraping Live...' : 'Sync Live Scraper'}</span>
            <span className="sm:hidden">{isSyncing ? '...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={portalSearch}
              onChange={(e) => setPortalSearch(e.target.value)}
              placeholder="Search portal name, domain (e.g. eprocure.gov.in), state, or authority (NHAI, DMRC)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Region Select */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer font-medium"
            >
              <option value="ALL">All Regions (India)</option>
              <option value="National">National / Central</option>
              <option value="North">North India</option>
              <option value="South">South India</option>
              <option value="West">West India</option>
              <option value="East & Central">East & Central</option>
              <option value="North East">North East</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Jurisdiction:
          </span>
          {[
            { id: 'ALL', label: `All Portals (${REAL_PORTAL_SOURCES.length})` },
            { id: 'Central', label: 'Central Government' },
            { id: 'State', label: 'State Governments' },
            { id: 'Defense & PSU', label: 'Defense & Energy PSUs' },
            { id: 'Railways', label: 'Railways (IREPS)' },
            { id: 'Open Data', label: 'Open Data (data.gov.in)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => (
          <PortalSourceCard
            key={portal.id}
            portal={portal}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {filteredPortals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <Globe className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-800">No portal matched your search "{portalSearch}".</p>
          <button
            onClick={() => { setPortalSearch(''); setSelectedCategory('ALL'); setSelectedRegion('ALL'); }}
            className="text-xs text-cyan-600 underline font-semibold cursor-pointer"
          >
            Reset portal search & filters
          </button>
        </div>
      )}
    </section>
  );
};
