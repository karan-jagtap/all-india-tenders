import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Radio, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CurrentTender,
  EnrichedCurrentTender,
  PreBidSimulationReport,
  DeepDocumentRAGReport,
  CurrentTenderSortOption
} from '../types';
import {
  listCurrentTenders,
  CurrentTenderFilters,
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
  canonicalizeCity,
  subscribeMasterFilters,
  subscribePortalSources
} from '../constants';

function enrichTenderList(rawList: CurrentTender[]): EnrichedCurrentTender[] {
  const strictlyUnawarded = rawList.filter((t) => {
    const isNotAwarded = t.is_awarded !== true;
    const notAwardedStatus = !t.status?.toUpperCase().includes('AWARDED');
    return isNotAwarded && notAwardedStatus;
  });

  return strictlyUnawarded.map((t) => {
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
      _searchBlob: `${t.id} ${t.title} ${t.organization} ${t.nit_number} ${canonicalSt} ${canonicalCt} ${canonicalSource} ${canonicalCat} ${t.scope_summary || ''} ${t.ogd_resource_id || ''} ${t.departmental_channel || ''}`.toLowerCase()
    };
  });
}

export const CurrentTendersTab: React.FC = () => {
  const { t } = useTranslation();
  const [tenders, setTenders] = useState<EnrichedCurrentTender[]>([]);
  const [totalDbCount, setTotalDbCount] = useState<number>(112261);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('specs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string[]>(['ALL']);
  const [selectedOrg, setSelectedOrg] = useState<string[]>(['ALL']);
  const [selectedState, setSelectedState] = useState<string[]>(['ALL']);
  const [selectedCity, setSelectedCity] = useState<string[]>(['ALL']);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['ALL']);
  const [selectedValueRange, setSelectedValueRange] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<CurrentTenderSortOption>('CLOSING_SOONEST');
  const [includeClosed, setIncludeClosed] = useState<boolean>(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState<boolean>(false);
  const voiceSearchRef = useRef<any>(null);
  const dossierRef = useRef<HTMLDivElement>(null);

  // Overlapping Filter Sidebar Drawer State
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState<boolean>(false);
  const [filterConstantsTick, setFilterConstantsTick] = useState<number>(0);

  useEffect(() => {
    const unsub1 = subscribeMasterFilters(() => setFilterConstantsTick((t) => t + 1));
    const unsub2 = subscribePortalSources(() => setFilterConstantsTick((t) => t + 1));
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

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

  const PAGE_SIZE = 12;

  const buildApiFilters = useCallback(
    (customOffset: number = 0, customSearch?: string): CurrentTenderFilters => {
      const q = customSearch !== undefined ? customSearch : (searchQuery.trim() || undefined);
      const filters: CurrentTenderFilters = {
        include_closed: includeClosed,
        sort_by: sortBy,
        limit: PAGE_SIZE,
        offset: customOffset
      };

      if (q) filters.search = q;
      if (!isAll(selectedSource)) filters.source_portal = selectedSource.join(',');
      if (!isAll(selectedOrg)) filters.organization = selectedOrg.join(',');
      if (!isAll(selectedState)) filters.state = selectedState.join(',');
      if (!isAll(selectedCity)) filters.city = selectedCity.join(',');
      if (!isAll(selectedCategory)) filters.category = selectedCategory.join(',');

      if (selectedValueRange === 'UNDER_10CR') {
        filters.max_cost = 100000000;
      } else if (selectedValueRange === '10CR_50CR') {
        filters.min_cost = 100000000;
        filters.max_cost = 500000000;
      } else if (selectedValueRange === 'OVER_50CR') {
        filters.min_cost = 500000000;
      }

      return filters;
    },
    [searchQuery, includeClosed, sortBy, selectedSource, selectedOrg, selectedState, selectedCity, selectedCategory, selectedValueRange]
  );

  const loadData = useCallback(
    (searchParam?: string) => {
      setLoading(true);
      const filters = buildApiFilters(0, searchParam);
      listCurrentTenders(filters)
        .then(({ tenders: data, totalCount }) => {
          setTotalDbCount(totalCount);
          const enriched = enrichTenderList(data);
          setTenders(enriched);
          if (enriched.length > 0 && (!selectedTenderId || !enriched.some((t) => t.id === selectedTenderId))) {
            setSelectedTenderId(enriched[0].id);
          } else if (enriched.length === 0) {
            setSelectedTenderId('');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load in-progress tenders');
          setLoading(false);
        });
    },
    [buildApiFilters, selectedTenderId]
  );

  const handleRunLiveScraper = async () => {
    setIsScrapingLive(true);
    try {
      await triggerLiveScrape();
      loadData();
    } catch (err: any) {
      console.error('Live scraping failed:', err);
      alert('Scraper execution encountered a network issue. Retrying with database stream.');
      loadData();
    } finally {
      setIsScrapingLive(false);
    }
  };

  useEffect(() => {
    loadData();
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [
    selectedSource,
    selectedOrg,
    selectedState,
    selectedCity,
    selectedCategory,
    selectedValueRange,
    sortBy,
    includeClosed
  ]);

  // Debounced server-side DB search for target tender IDs or keywords
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 3) {
      const timer = setTimeout(() => {
        loadData(q);
        if (listContainerRef.current) {
          listContainerRef.current.scrollTop = 0;
        }
      }, 350);
      return () => clearTimeout(timer);
    } else if (q.length === 0) {
      loadData('');
    }
  }, [searchQuery]);

  const query = searchQuery.toLowerCase().trim();
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const isAll = (arr: string[]) => !arr || arr.length === 0 || arr.includes('ALL');

  // Faceted matcher: checks if tender satisfies all active filters except an excluded dimension
  const matchesFilter = useCallback(
    (t: EnrichedCurrentTender, excludeDimension?: string) => {
      if (query && !t._searchBlob.includes(query)) return false;

      // Status / Due filter
      if (!includeClosed) {
        if (t.status === 'CLOSED' || t.status === 'AWARDED') return false;
        if (t.days_left !== undefined && t.days_left !== null) {
          if (t.days_left <= 0) return false;
        } else if (Boolean(t.closing_date) && t.closing_date < todayStr) {
          return false;
        }
      }

      if (excludeDimension !== 'source' && !isAll(selectedSource) && !selectedSource.includes(t.source_portal)) {
        return false;
      }
      if (excludeDimension !== 'org' && !isAll(selectedOrg) && !selectedOrg.includes(t.organization)) {
        return false;
      }
      if (excludeDimension !== 'state' && !isAll(selectedState) && !selectedState.includes(t.state)) {
        return false;
      }
      if (excludeDimension !== 'city' && !isAll(selectedCity) && !selectedCity.includes(t.city)) {
        return false;
      }
      if (excludeDimension !== 'category' && !isAll(selectedCategory) && !selectedCategory.includes(t.category)) {
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
          if (t.days_left > 15 || t.days_left <= 0) return false;
        }
      }
      return true;
    },
    [query, includeClosed, todayStr, selectedSource, selectedOrg, selectedState, selectedCity, selectedCategory, selectedValueRange]
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
    selectedSource.forEach((src) => {
      if (src !== 'ALL') set.add(src);
    });
    return Array.from(set).sort();
  }, [tenders, selectedSource, filterConstantsTick]);

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
    selectedOrg.forEach((org) => {
      if (org !== 'ALL') set.add(org);
    });
    return Array.from(set).sort();
  }, [tenders, selectedOrg, filterConstantsTick]);

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
    selectedState.forEach((st) => {
      if (st !== 'ALL') set.add(st);
    });
    return Array.from(set).sort();
  }, [tenders, selectedState, filterConstantsTick]);

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
    selectedCity.forEach((ct) => {
      if (ct !== 'ALL') set.add(ct);
    });
    return Array.from(set).sort();
  }, [tenders, selectedCity, filterConstantsTick]);

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
    selectedCategory.forEach((cat) => {
      if (cat !== 'ALL') set.add(cat);
    });
    return Array.from(set).sort();
  }, [tenders, selectedCategory, filterConstantsTick]);

  // Filtered tenders are streamed directly from the indexed SQLite database in 12-item batches
  const filteredTenders = tenders;

  // Whenever ANY filter is reset or changed, automatically select the first record in the refreshed list
  const currentFilterKey = `${selectedSource.slice().sort().join(',')}|${selectedOrg.slice().sort().join(',')}|${selectedState.slice().sort().join(',')}|${selectedCity.slice().sort().join(',')}|${selectedCategory.slice().sort().join(',')}|${selectedValueRange}|${sortBy}|${searchQuery.trim()}`;
  const [prevFilterKey, setPrevFilterKey] = useState<string>(currentFilterKey);

  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    const firstTender = filteredTenders[0];
    const targetId = firstTender ? firstTender.id : '';
    setSelectedTenderId(targetId);
  }

  const handleFilterChangeScrollTop = () => {
    scrollListContainerToTop();
  };

  useEffect(() => {
    handleFilterChangeScrollTop();
  }, [currentFilterKey]);

  const selectedTender = useMemo(() => {
    return filteredTenders.find((t) => t.id === selectedTenderId) || filteredTenders[0] || null;
  }, [filteredTenders, selectedTenderId]);

  useEffect(() => {
    if (selectedTender?.id) {
      setActiveSubTab('specs');
    }
  }, [selectedTender?.id]);

  const hasActiveFilters =
    !isAll(selectedSource) ||
    !isAll(selectedOrg) ||
    !isAll(selectedState) ||
    !isAll(selectedCity) ||
    !isAll(selectedCategory) ||
    selectedValueRange !== 'ALL' ||
    sortBy !== 'CLOSING_SOONEST' ||
    searchQuery.trim() !== '' ||
    includeClosed;

  const openCount = useMemo(() => {
    if (!hasActiveFilters && totalDbCount > 0) return totalDbCount;
    return filteredTenders.filter((t) => (t.days_left === undefined || t.days_left > 0) && (!t.closing_date || t.closing_date >= todayStr)).length;
  }, [filteredTenders, todayStr, hasActiveFilters, totalDbCount]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!isAll(selectedSource)) count += selectedSource.filter((v) => v !== 'ALL').length;
    if (!isAll(selectedOrg)) count += selectedOrg.filter((v) => v !== 'ALL').length;
    if (!isAll(selectedState)) count += selectedState.filter((v) => v !== 'ALL').length;
    if (!isAll(selectedCity)) count += selectedCity.filter((v) => v !== 'ALL').length;
    if (!isAll(selectedCategory)) count += selectedCategory.filter((v) => v !== 'ALL').length;
    if (selectedValueRange !== 'ALL') count++;
    if (sortBy !== 'CLOSING_SOONEST') count++;
    if (searchQuery.trim() !== '') count++;
    if (includeClosed) count++;
    return count;
  }, [selectedSource, selectedOrg, selectedState, selectedCity, selectedCategory, selectedValueRange, sortBy, searchQuery, includeClosed]);

  const selectFirstTenderRecord = (tenderList: EnrichedCurrentTender[]) => {
    const firstTender = tenderList[0];
    const targetId = firstTender ? firstTender.id : '';
    setSelectedTenderId(targetId);
  };

  const resetFilterStateValues = () => {
    setSelectedSource(['ALL']);
    setSelectedOrg(['ALL']);
    setSelectedState(['ALL']);
    setSelectedCity(['ALL']);
    setSelectedCategory(['ALL']);
    setSelectedValueRange('ALL');
    setSortBy('CLOSING_SOONEST');
    setSearchQuery('');
    setIncludeClosed(false);
  };

  const scrollListContainerToTop = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  const resetAllFilters = () => {
    resetFilterStateValues();
    selectFirstTenderRecord(tenders);
    scrollListContainerToTop();
  };

  const handleOpenFilterDrawer = () => {
    setIsFilterSidebarOpen(true);
  };

  const handleCloseFilterDrawer = () => {
    setIsFilterSidebarOpen(false);
  };

  const handleOpenWholeDocModal = () => {
    setIsWholeDocModalOpen(true);
  };

  const handleCloseWholeDocModal = () => {
    setIsWholeDocModalOpen(false);
  };

  const handleClosePortalModal = () => {
    setIsPortalModalOpen(false);
  };

  const handleSelectTenderCard = (tender: EnrichedCurrentTender) => {
    setSelectedTenderId(tender.id);
    setActiveSubTab('specs');
    if (window.innerWidth < 1024) {
      dossierRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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

  // Infinite scroll (server-paginated 12 tenders per batch based on offset)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const visibleTenders = tenders;
  const hasMore = tenders.length < totalDbCount;

  const loadMore = useCallback(() => {
    if (isLoadingMore || loading || !hasMore) return;
    setIsLoadingMore(true);

    const filters = buildApiFilters(tenders.length);
    listCurrentTenders(filters)
      .then(({ tenders: nextBatch }) => {
        if (nextBatch.length > 0) {
          const enrichedBatch = enrichTenderList(nextBatch);
          setTenders((prev) => [...prev, ...enrichedBatch]);
        }
        setIsLoadingMore(false);
      })
      .catch((err) => {
        console.error('Failed to stream next tenders batch:', err);
        setIsLoadingMore(false);
      });
  }, [isLoadingMore, loading, hasMore, buildApiFilters, tenders.length]);

  // Observe the 2nd-to-last card to trigger loading the next batch of 12
  const secondLastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            loadMore();
          }
        },
        {
          root: listContainerRef.current || null,
          rootMargin: '100px 0px',
          threshold: 0.05,
        }
      );

      observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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
        <p className="text-sm font-medium">
          {t('currentTenders.queryingDatabase')}
        </p>
        <span className="text-xs text-slate-400">
          {t('currentTenders.databaseBadge')}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <strong className="block font-bold mb-1">
          {t('currentTenders.failedToConnect')}
        </strong>
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
        sortBy={sortBy}
        setSortBy={setSortBy}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        onOpenFilterDrawer={handleOpenFilterDrawer}
        loadData={handleRunLiveScraper}
        loading={isScrapingLive}
        totalTendersCount={hasActiveFilters ? filteredTenders.length : totalDbCount}
      />

      {/* Overlapping Filter Drawer (Slides from Right) */}
      <CurrentTenderFilterDrawer
        isOpen={isFilterSidebarOpen}
        onClose={handleCloseFilterDrawer}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        totalFilteredCount={hasActiveFilters ? filteredTenders.length : totalDbCount}
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
        includeClosed={includeClosed}
        setIncludeClosed={setIncludeClosed}
        openCount={openCount}
        totalAvailableCount={hasActiveFilters ? filteredTenders.length : totalDbCount}
      />

      {/* Main Grid: Left Tender List (35%) | Right Deep-Dive Dossier (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[35fr_65fr] gap-5">
        {/* Left Column: Current Tenders Cards (35%) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>
                {includeClosed
                  ? t('currentTenders.allProcurementNotices')
                  : t('currentTenders.openInProgressNotices')}
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {visibleTenders.length < totalDbCount
                  ? `${visibleTenders.length} ${t('common.of')} ${totalDbCount.toLocaleString('en-IN')}`
                  : `${totalDbCount.toLocaleString('en-IN')}`}
              </span>
            </span>
          </div>

          <div
            ref={listContainerRef}
            onScroll={handleScroll}
            className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1 scroll-smooth"
          >
            {visibleTenders.map((tender, index) => {
              const isSelected = selectedTender ? tender.id === selectedTender.id : false;
              // Trigger next batch when the 2nd-to-last card comes into view
              const secondLastIndex = visibleTenders.length >= 2 ? visibleTenders.length - 2 : 0;
              const isSecondLast = hasMore && index === secondLastIndex;

              return (
                <div
                  key={tender.id}
                  ref={isSecondLast ? secondLastCardRef : undefined}
                >
                  <CurrentTenderCard
                    tender={tender}
                    isSelected={isSelected}
                    onSelect={() => handleSelectTenderCard(tender)}
                    onCopyNit={handleCopyNit}
                    copiedNit={copiedNit}
                  />
                </div>
              );
            })}

            {/* Infinite Scroll Loading Indicator */}
            {isLoadingMore && (
              <div
                className="py-3 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-600 dark:text-orange-400" />
                <span>{t('currentTenders.loadingNext12')}</span>
              </div>
            )}

            {!hasMore && (visibleTenders.length > 0 || totalDbCount > 0) && (
              <div className="py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {t('currentTenders.showingAllNotices',  {
                  count: totalDbCount,
                  statusDesc: includeClosed
                    ? t('currentTenders.allNoticesIncludingClosed')
                    : t('currentTenders.openNoticesDesc')
                })}
              </div>
            )}

            {visibleTenders.length === 0 && !loading && (
              <div className="text-center py-12 px-4 bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <Radio className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('currentTenders.noMatchingActiveFilters')}
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  {t('common.clearAll')}
                </button>
              </div>
            )}

            {filteredTenders.length === 0 && (
              <div className="text-center py-12 px-4 bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <Radio className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('currentTenders.noMatchingActiveFilters')}
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  {t('common.clearAll')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep-Dive Dossier (65%) */}
        <div ref={dossierRef} className="space-y-4">
          {!selectedTender || filteredTenders.length === 0 ? (
            <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-12 text-center shadow-xs">
              <Radio className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t('currentTenders.noMatchingTitle')}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4">
                {t('currentTenders.noMatchingDesc')}
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {t('common.resetAll')}
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
                onOpenWholeDoc={handleOpenWholeDocModal}
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
                  onOpenWholeDoc={handleOpenWholeDocModal}
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
        onClose={handleClosePortalModal}
        tender={selectedTender}
        copiedNit={copiedNit}
        onCopyNit={handleCopyNit}
      />

      {/* Whole Tender Document In-App Reader Modal (Downloadable) */}
      <WholeTenderDocModal
        isOpen={isWholeDocModalOpen}
        onClose={handleCloseWholeDocModal}
        tender={selectedTender}
        sbdUrl={sbdUrl}
      />
    </div>
  );
};
