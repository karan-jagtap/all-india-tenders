import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Radio, RefreshCw } from 'lucide-react';
import {
  EnrichedCurrentTender,
  PreBidSimulationReport,
  DeepDocumentRAGReport
} from '../types';
import {
  listCurrentTenders,
  getCurrentTenderPdfUrl,
  getCurrentTenderSbdDocUrl,
  getCurrentTenderBoqUrl,
  triggerLiveScrape
} from '../services/api';
import { generatePreBidSimulation } from '../services/preBidPrediction';
import { generateDeepDocumentRAG } from '../services/deepDocumentRAG';
import {
  CurrentTendersTopBar,
  CurrentTenderFilterDrawer,
  CurrentTenderCard,
  CurrentTenderHeader,
  PortalBridgeModal,
  WholeTenderDocModal,
  SubTabType,
  ScopeAndSpecsSubTab,
  PQCSubTab,
  MSMESubTab,
  TenderDocsSubTab,
  ScrapingArchSubTab,
  CompetitorPredictionSubTab,
  DeepRAGClauseSubTab
} from './CurrentTenders';
import {
  ALL_STATUTORY_PORTAL_SOURCES,
  canonicalizePortalSource,
  ALL_CANONICAL_CATEGORIES,
  ALL_CANONICAL_STATES,
  ALL_MASTER_ORGANIZATIONS,
  ALL_MASTER_CITIES,
  canonicalizeCategory,
  canonicalizeState,
  canonicalizeCity
} from '../constants';

export const CurrentTendersTab: React.FC = () => {
  const [tenders, setTenders] = useState<EnrichedCurrentTender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('specs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedOrg, setSelectedOrg] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedValueRange, setSelectedValueRange] = useState<string>('ALL');
  const [isVoiceSearching, setIsVoiceSearching] = useState<boolean>(false);
  const voiceSearchRef = useRef<any>(null);

  // Overlapping Filter Sidebar Drawer State
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterSidebarOpen) {
        setIsFilterSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterSidebarOpen]);

  // Live Scraper State
  const [isScrapingLive, setIsScrapingLive] = useState<boolean>(false);

  // Portal Navigation Bridge & Clipboard State
  const [copiedNit, setCopiedNit] = useState<string | null>(null);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState<boolean>(false);
  const [isWholeDocModalOpen, setIsWholeDocModalOpen] = useState<boolean>(false);

  const handleCopyNit = (nit: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(nit);
    setCopiedNit(nit);
    setTimeout(() => {
      setCopiedNit(null);
    }, 3000);
  };

  const handleOpenPortalBridge = (tender: EnrichedCurrentTender, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(tender.nit_number);
    setCopiedNit(tender.nit_number);
    setIsPortalModalOpen(true);
  };

  const toggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isVoiceSearching) {
      if (voiceSearchRef.current) {
        voiceSearchRef.current.stop();
      }
      setIsVoiceSearching(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsVoiceSearching(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setSearchQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice search error:', event.error);
        setIsVoiceSearching(false);
      };

      recognition.onend = () => {
        setIsVoiceSearching(false);
      };

      voiceSearchRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start voice search', e);
      setIsVoiceSearching(false);
    }
  };

  const loadData = () => {
    setLoading(true);
    listCurrentTenders()
      .then((data) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const strictlyUnfilled = data.filter((t) => {
          const isNotFilled = t.is_filled !== true;
          const isNotAwarded = t.is_awarded !== true;
          const isDue = (t.days_left !== undefined ? t.days_left > 0 : true) && (!t.closing_date || t.closing_date >= todayStr);
          const notAwardedStatus = !t.status?.toUpperCase().includes('AWARDED') && !t.status?.toUpperCase().includes('CLOSED');
          return isNotFilled && isNotAwarded && isDue && notAwardedStatus;
        });

        const enriched: EnrichedCurrentTender[] = strictlyUnfilled.map((t) => {
          const canonicalSource = canonicalizePortalSource(t.source_portal);
          const canonicalSt = canonicalizeState(t.state, t.title, t.scope_summary, t.organization, canonicalSource);
          const canonicalCt = canonicalizeCity(t.city, canonicalSt, t.title, t.scope_summary, t.organization, canonicalSource);
          const canonicalCat = canonicalizeCategory(t.category, t.title, t.scope_summary);
          return {
            ...t,
            source_portal: canonicalSource,
            state: canonicalSt,
            city: canonicalCt,
            category: canonicalCat,
            _sourceLabel: canonicalSource.split('(')[0].trim(),
            _searchBlob: `${t.title} ${t.organization} ${t.nit_number} ${canonicalSt} ${canonicalCt} ${canonicalSource} ${canonicalCat} ${t.scope_summary || ''} ${t.ogd_resource_id || ''} ${t.departmental_channel || ''}`.toLowerCase()
          };
        });
        setTenders(enriched);
        if (enriched.length > 0 && (!selectedTenderId || !enriched.some(t => t.id === selectedTenderId))) {
          setSelectedTenderId(enriched[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load in-progress tenders');
        setLoading(false);
      });
  };

  const handleRunLiveScraper = async () => {
    setIsScrapingLive(true);
    try {
      await triggerLiveScrape();
      loadData();
    } catch (err: any) {
      console.error('Live scraping failed:', err);
      alert('Scraper execution encountered a network issue. Retrying with memory cache.');
      loadData();
    } finally {
      setIsScrapingLive(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const query = searchQuery.toLowerCase().trim();

  // Faceted matcher: checks if tender satisfies all active filters except an excluded dimension
  const matchesFilter = useCallback(
    (t: EnrichedCurrentTender, excludeDimension?: string) => {
      if (query && !t._searchBlob.includes(query)) return false;

      if (excludeDimension !== 'source' && selectedSource !== 'ALL' && t.source_portal !== selectedSource) {
        return false;
      }
      if (excludeDimension !== 'org' && selectedOrg !== 'ALL' && t.organization !== selectedOrg) {
        return false;
      }
      if (excludeDimension !== 'state' && selectedState !== 'ALL' && t.state !== selectedState) {
        return false;
      }
      if (excludeDimension !== 'city' && selectedCity !== 'ALL' && t.city !== selectedCity) {
        return false;
      }
      if (excludeDimension !== 'category' && selectedCategory !== 'ALL' && t.category !== selectedCategory) {
        return false;
      }
      if (excludeDimension !== 'value' && selectedValueRange !== 'ALL') {
        const cost = t.estimated_cost_inr || 0;
        if (selectedValueRange === 'UNDER_10CR') {
          if (!(cost > 0 && cost < 100000000)) return false;
        } else if (selectedValueRange === '10CR_50CR') {
          if (!(cost >= 100000000 && cost <= 500000000)) return false;
        } else if (selectedValueRange === 'OVER_50CR') {
          if (!(cost > 500000000)) return false;
        } else if (selectedValueRange === 'CLOSING_SOON') {
          if (t.days_left > 15) return false;
        }
      }
      return true;
    },
    [query, selectedSource, selectedOrg, selectedState, selectedCity, selectedCategory, selectedValueRange]
  );

  // Faceted counts
  const contextForSource = useMemo(() => tenders.filter((t) => matchesFilter(t, 'source')), [tenders, matchesFilter]);
  const sourceCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForSource) {
      map.set(t.source_portal, (map.get(t.source_portal) || 0) + 1);
    }
    return map;
  }, [contextForSource]);

  const availableSources = useMemo(() => {
    const set = new Set<string>(ALL_STATUTORY_PORTAL_SOURCES);
    for (const t of tenders) {
      if (t.source_portal) set.add(t.source_portal);
    }
    if (selectedSource !== 'ALL') {
      set.add(selectedSource);
    }
    return Array.from(set).sort();
  }, [tenders, selectedSource]);

  const contextForOrg = useMemo(() => tenders.filter((t) => matchesFilter(t, 'org')), [tenders, matchesFilter]);
  const orgCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForOrg) {
      map.set(t.organization, (map.get(t.organization) || 0) + 1);
    }
    return map;
  }, [contextForOrg]);

  const availableOrgs = useMemo(() => {
    const set = new Set<string>(ALL_MASTER_ORGANIZATIONS);
    for (const t of tenders) {
      if (t.organization) set.add(t.organization);
    }
    if (selectedOrg !== 'ALL') {
      set.add(selectedOrg);
    }
    return Array.from(set).sort();
  }, [tenders, selectedOrg]);

  const contextForState = useMemo(() => tenders.filter((t) => matchesFilter(t, 'state')), [tenders, matchesFilter]);
  const stateCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForState) {
      if (t.state) map.set(t.state, (map.get(t.state) || 0) + 1);
    }
    return map;
  }, [contextForState]);

  const availableStates = useMemo(() => {
    const set = new Set<string>(ALL_CANONICAL_STATES);
    for (const t of tenders) {
      if (t.state) set.add(t.state);
    }
    if (selectedState !== 'ALL') {
      set.add(selectedState);
    }
    return Array.from(set).sort();
  }, [tenders, selectedState]);

  const contextForCity = useMemo(() => tenders.filter((t) => matchesFilter(t, 'city')), [tenders, matchesFilter]);
  const cityCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForCity) {
      if (t.city) map.set(t.city, (map.get(t.city) || 0) + 1);
    }
    return map;
  }, [contextForCity]);

  const availableCities = useMemo(() => {
    const set = new Set<string>(ALL_MASTER_CITIES);
    for (const t of tenders) {
      if (t.city) set.add(t.city);
    }
    if (selectedCity !== 'ALL') {
      set.add(selectedCity);
    }
    return Array.from(set).sort();
  }, [tenders, selectedCity]);

  const contextForCategory = useMemo(() => tenders.filter((t) => matchesFilter(t, 'category')), [tenders, matchesFilter]);
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForCategory) {
      if (t.category) map.set(t.category, (map.get(t.category) || 0) + 1);
    }
    return map;
  }, [contextForCategory]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>(ALL_CANONICAL_CATEGORIES);
    for (const t of tenders) {
      if (t.category) set.add(t.category);
    }
    if (selectedCategory !== 'ALL') {
      set.add(selectedCategory);
    }
    return Array.from(set).sort();
  }, [tenders, selectedCategory]);

  // Final intersection of all active filters
  const filteredTenders = useMemo(() => tenders.filter((t) => matchesFilter(t)), [tenders, matchesFilter]);

  const selectedTender = useMemo(() => {
    return filteredTenders.find((t) => t.id === selectedTenderId) || filteredTenders[0] || null;
  }, [filteredTenders, selectedTenderId]);

  useEffect(() => {
    if (selectedTender?.id) {
      setActiveSubTab('specs');
    }
  }, [selectedTender?.id]);

  const hasActiveFilters =
    selectedSource !== 'ALL' ||
    selectedOrg !== 'ALL' ||
    selectedState !== 'ALL' ||
    selectedCity !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedValueRange !== 'ALL' ||
    searchQuery.trim() !== '';

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSource !== 'ALL') count++;
    if (selectedOrg !== 'ALL') count++;
    if (selectedState !== 'ALL') count++;
    if (selectedCity !== 'ALL') count++;
    if (selectedCategory !== 'ALL') count++;
    if (selectedValueRange !== 'ALL') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedSource, selectedOrg, selectedState, selectedCity, selectedCategory, selectedValueRange, searchQuery]);

  const resetAllFilters = () => {
    setSelectedSource('ALL');
    setSelectedOrg('ALL');
    setSelectedState('ALL');
    setSelectedCity('ALL');
    setSelectedCategory('ALL');
    setSelectedValueRange('ALL');
    setSearchQuery('');
  };

  const pdfUrl = useMemo(() => (selectedTender ? getCurrentTenderPdfUrl(selectedTender.id) : ''), [selectedTender?.id]);
  const sbdUrl = useMemo(() => (selectedTender ? getCurrentTenderSbdDocUrl(selectedTender.id) : ''), [selectedTender?.id]);
  const boqUrl = useMemo(() => (selectedTender ? getCurrentTenderBoqUrl(selectedTender.id) : ''), [selectedTender?.id]);

  const preBidPrediction: PreBidSimulationReport | null = useMemo(() => {
    if (!selectedTender) return null;
    return generatePreBidSimulation(selectedTender);
  }, [selectedTender]);

  const deepRAGReport: DeepDocumentRAGReport | null = useMemo(() => {
    if (!selectedTender) return null;
    return generateDeepDocumentRAG(selectedTender);
  }, [selectedTender]);

  // Infinite scroll
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleTenders = filteredTenders.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= filteredTenders.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredTenders.length));
      setIsLoadingMore(false);
    }, 200);
  }, [isLoadingMore, visibleCount, filteredTenders.length]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [selectedSource, selectedOrg, selectedState, selectedCity, selectedCategory, selectedValueRange, searchQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { root: listContainerRef.current, rootMargin: '120px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 150) {
      loadMore();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
        <p className="text-sm font-medium">Scraping in-progress notices directly from official portals...</p>
        <span className="text-xs text-slate-400">100% In-Memory RAM • 0 Database Queries</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <strong className="block font-bold mb-1">Failed to connect to official procurement portals</strong>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar: Search on LEFT, Filters on RIGHT */}
      <CurrentTendersTopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isVoiceSearching={isVoiceSearching}
        toggleVoiceSearch={toggleVoiceSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
        categoryCounts={categoryCounts}
        contextCategoryCount={contextForCategory.length}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        availableSources={availableSources}
        sourceCounts={sourceCounts}
        contextSourceCount={contextForSource.length}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedValueRange={selectedValueRange}
        setSelectedValueRange={setSelectedValueRange}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        onOpenFilterDrawer={() => setIsFilterSidebarOpen(true)}
        loadData={handleRunLiveScraper}
        loading={isScrapingLive}
        totalTendersCount={tenders.length}
      />

      {/* Overlapping Filter Drawer (Slides from Right) */}
      <CurrentTenderFilterDrawer
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        totalFilteredCount={filteredTenders.length}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        availableSources={availableSources}
        sourceCounts={sourceCounts}
        contextSourceCount={contextForSource.length}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        availableOrgs={availableOrgs}
        orgCounts={orgCounts}
        contextOrgCount={contextForOrg.length}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        availableStates={availableStates}
        stateCounts={stateCounts}
        contextStateCount={contextForState.length}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        availableCities={availableCities}
        cityCounts={cityCounts}
        contextCityCount={contextForCity.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
        categoryCounts={categoryCounts}
        contextCategoryCount={contextForCategory.length}
        selectedValueRange={selectedValueRange}
        setSelectedValueRange={setSelectedValueRange}
      />

      {/* Main Grid: Left Tender List (35%) | Right Deep-Dive Dossier (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[35fr_65fr] gap-5">
        {/* Left Column: Current Tenders Cards (35%) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>In-Progress Notices</span>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {visibleTenders.length < filteredTenders.length
                  ? `${visibleTenders.length} of ${filteredTenders.length}`
                  : `${filteredTenders.length}`}
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Click notice to inspect specifications</span>
          </div>

          <div
            ref={listContainerRef}
            onScroll={handleScroll}
            className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1 scroll-smooth"
          >
            {visibleTenders.map((tender) => {
              const isSelected = selectedTender ? tender.id === selectedTender.id : false;
              return (
                <CurrentTenderCard
                  key={tender.id}
                  tender={tender}
                  isSelected={isSelected}
                  onSelect={() => {
                    setSelectedTenderId(tender.id);
                    setActiveSubTab('specs');
                  }}
                  onCopyNit={handleCopyNit}
                  copiedNit={copiedNit}
                />
              );
            })}

            {/* Infinite Scroll Sentinel */}
            {visibleCount < filteredTenders.length && (
              <div
                ref={sentinelRef}
                className="py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2 bg-slate-50/80 rounded-xl border border-dashed border-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-600" />
                <span>
                  Loading {Math.min(PAGE_SIZE, filteredTenders.length - visibleCount)} more notices...
                </span>
              </div>
            )}

            {visibleCount >= filteredTenders.length && filteredTenders.length > 0 && (
              <div className="py-2.5 text-center text-[11px] text-slate-400 font-medium">
                ✓ Showing all {filteredTenders.length} in-progress notices (Purely Scraped)
              </div>
            )}

            {filteredTenders.length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
                <Radio className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-800">No in-progress tenders matched the active filters.</p>
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep-Dive Dossier (65%) */}
        <div className="space-y-4">
          {!selectedTender || filteredTenders.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
              <Radio className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No matching in-progress tenders found</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                No active tenders match your selected filter combination. Try resetting your filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Selected Tender Header with Actions & Subtab navigation */}
              <CurrentTenderHeader
                selectedTender={selectedTender}
                onCopyNit={handleCopyNit}
                copiedNit={copiedNit}
                onOpenPortalBridge={handleOpenPortalBridge}
                onOpenWholeDoc={() => setIsWholeDocModalOpen(true)}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                sbdUrl={sbdUrl}
                nitPdfUrl={pdfUrl}
                boqUrl={boqUrl}
              />

              {/* Sub-Tab 1: Scope of Work & Specs */}
              {activeSubTab === 'specs' && (
                <ScopeAndSpecsSubTab selectedTender={selectedTender} />
              )}

              {/* Sub-Tab 2: Pre-Qualification Criteria (PQC) */}
              {activeSubTab === 'pqc' && (
                <PQCSubTab selectedTender={selectedTender} />
              )}

              {/* Sub-Tab 3: GFR 170 MSME Exemptions */}
              {activeSubTab === 'msme' && (
                <MSMESubTab />
              )}

              {/* Sub-Tab 4: Official Tender Documents (NIT, SBD & BOQ) */}
              {activeSubTab === 'pdf' && (
                <TenderDocsSubTab
                  selectedTender={selectedTender}
                  sbdUrl={sbdUrl}
                  pdfUrl={pdfUrl}
                  boqUrl={boqUrl}
                  onOpenPortalBridge={handleOpenPortalBridge}
                  onOpenWholeDoc={() => setIsWholeDocModalOpen(true)}
                />
              )}

              {/* Sub-Tab 5: Scraping & 0-DB Architecture */}
              {activeSubTab === 'scraping' && (
                <ScrapingArchSubTab
                  selectedTender={selectedTender}
                  onOpenPortalBridge={handleOpenPortalBridge}
                />
              )}

              {/* Sub-Tab 6: Pre-Bid Competitor Intelligence & Winning L1 Simulator */}
              {activeSubTab === 'prediction' && preBidPrediction && (
                <CompetitorPredictionSubTab preBidPrediction={preBidPrediction} />
              )}

              {/* Sub-Tab 7: Deep RAG SBD Clause Analysis & BOQ Cost Insights */}
              {activeSubTab === 'rag_analysis' && deepRAGReport && (
                <DeepRAGClauseSubTab
                  deepRAGReport={deepRAGReport}
                  selectedTender={selectedTender}
                  sbdUrl={sbdUrl}
                  boqUrl={boqUrl}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Official Portal Direct Navigation Modal */}
      <PortalBridgeModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        tender={selectedTender}
        copiedNit={copiedNit}
        onCopyNit={handleCopyNit}
      />

      {/* Whole Tender Document In-App Reader Modal (Downloadable) */}
      <WholeTenderDocModal
        isOpen={isWholeDocModalOpen}
        onClose={() => setIsWholeDocModalOpen(false)}
        tender={selectedTender}
        sbdUrl={sbdUrl}
      />
    </div>
  );
};
