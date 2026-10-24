import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Building2,
  Globe,
  Search,
  Award,
  Radio,
  Layers,
  MapPin,
  Train,
  Zap,
  Shield,
  Landmark
} from 'lucide-react';
import allOrgsData from '../data/all_organizations.json';

interface OrgItem {
  authority: string;
  portal: string;
  category: string;
  accepted_count: number;
  current_count: number;
  sector: string;
  state: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrg?: (orgName: string) => void;
  initialSector?: string;
}

export const OrganizationsDirectoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectOrg,
  initialSector = 'ALL'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>(initialSector);

  useEffect(() => {
    if (initialSector) {
      setSelectedSector(initialSector);
    }
  }, [initialSector, isOpen]);

  const orgs: OrgItem[] = allOrgsData as OrgItem[];

  // 25 statutory portals list
  const statutoryPortals = useMemo(() => {
    const map = new Map<string, { portal: string; orgsCount: number; activeTenders: number; awardedTenders: number }>();
    for (const o of orgs) {
      if (!map.has(o.portal)) {
        map.set(o.portal, { portal: o.portal, orgsCount: 0, activeTenders: 0, awardedTenders: 0 });
      }
      const entry = map.get(o.portal)!;
      entry.orgsCount += 1;
      entry.activeTenders += o.current_count;
      entry.awardedTenders += o.accepted_count;
    }
    return Array.from(map.values()).sort((a, b) => b.awardedTenders - a.awardedTenders);
  }, [orgs]);

  const sectors = [
    { id: 'ALL', label: 'All Organizations', count: orgs.length, icon: Landmark },
    { id: 'Central Infra & Works', label: 'Central Infra & Works', count: orgs.filter((o) => o.sector === 'Central Infra & Works').length, icon: Building2 },
    { id: 'Railways & Metros', label: 'Railways & Metros', count: orgs.filter((o) => o.sector === 'Railways & Metros').length, icon: Train },
    { id: 'PSUs & Energy', label: 'PSUs & Energy', count: orgs.filter((o) => o.sector === 'PSUs & Energy').length, icon: Zap },
    { id: 'Defense & Paramilitary', label: 'Defense & Security', count: orgs.filter((o) => o.sector === 'Defense & Paramilitary').length, icon: Shield },
    { id: 'State Governments & Local Bodies', label: '19 States & Local Bodies', count: orgs.filter((o) => o.sector === 'State Governments & Local Bodies').length, icon: MapPin },
    { id: 'PORTALS', label: '25 Statutory Portals', count: statutoryPortals.length, icon: Globe }
  ];

  const filteredOrgs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return orgs.filter((o) => {
      if (selectedSector !== 'ALL' && selectedSector !== 'PORTALS' && o.sector !== selectedSector) {
        return false;
      }
      if (!q) return true;
      return (
        o.authority.toLowerCase().includes(q) ||
        o.portal.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.state.toLowerCase().includes(q) ||
        o.sector.toLowerCase().includes(q)
      );
    });
  }, [orgs, selectedSector, searchQuery]);

  const filteredPortals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return statutoryPortals.filter((p) => {
      if (!q) return true;
      return p.portal.toLowerCase().includes(q);
    });
  }, [statutoryPortals, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0E1422] w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Header Bar */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-orange-500 text-white flex items-center gap-1 shadow-xs">
                <Globe className="w-3.5 h-3.5" />
                Pan-India Sourcing Directory
              </span>
              <span className="text-xs text-slate-400 font-mono">100% Statutory Public Feeds</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              All 123 Sourced Indian Authorities & 25 Statutory Portals
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-5 sm:px-7 py-2.5 flex items-center justify-between gap-3 text-xs flex-wrap shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span><strong>123</strong> Government Organizations</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span><strong>25</strong> National & State Portals</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span><strong>2,602</strong> Awarded Contracts</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Radio className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span><strong>502</strong> Live In-Progress Notices</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Zero Database • In-Memory Stream</span>
        </div>

        {/* Search & Sector Filters */}
        <div className="p-4 sm:px-7 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1422] space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by organization name (NHAI, CPWD, BHEL, DMRC, MahaPWD...), state, or portal..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {sectors.map((sec) => {
              const Icon = sec.icon;
              const isActive = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{sec.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-slate-800 dark:bg-slate-200 text-slate-200 dark:text-slate-800' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sec.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Body */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-[#070A10]/50">
          {selectedSector === 'PORTALS' ? (
            /* 25 Portals Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredPortals.map((p, idx) => {
                const domain = p.portal.match(/\((.*?)\)/)?.[1] || p.portal;
                const portalName = p.portal.split('(')[0].trim();
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0E1422] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          200 OK Active Feed
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">{portalName}</h4>
                      <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 break-all mb-3">{domain}</p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Executing Bodies</span>
                        <strong className="text-slate-800 dark:text-slate-200">{p.orgsCount} Orgs</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Tenders Catalog</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{p.awardedTenders} Awarded</span>
                        <span className="text-slate-300 dark:text-slate-700 mx-1">•</span>
                        <span className="text-orange-600 dark:text-orange-400 font-bold">{p.activeTenders} Live</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 123 Organizations Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredOrgs.map((o, idx) => {
                const portalShort = o.portal.split('(')[0].trim();
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0E1422] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200 dark:border-slate-700">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {o.state}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 truncate max-w-[140px]">
                          {o.sector}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug mb-1.5">
                        {o.authority}
                      </h4>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{o.category}</span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 truncate" title={o.portal}>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Source: </span>
                        {portalShort}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {o.accepted_count} Awarded
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                            {o.current_count} Live
                          </span>
                        </div>

                        {onSelectOrg && (
                          <button
                            onClick={() => {
                              onSelectOrg(o.authority);
                              onClose();
                            }}
                            className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline cursor-pointer"
                          >
                            Filter Tenders →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredOrgs.length === 0 && selectedSector !== 'PORTALS' && (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <span>No organizations found matching "{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-[#0E1422] border-t border-slate-200 dark:border-slate-800 px-5 sm:px-7 py-3 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            National Public Procurement Catalog • Unified Portal Framework (CPPP, GeM, IREPS, MoD & 19 States)
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
