import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, AlertCircle, Tag, MapPin, TrendingUp, RefreshCw } from 'lucide-react';
import { RegisteredBidder, BidderWonContract } from '../types';
import {
  listRegisteredBidders,
  fetchBidderFilters,
  RegisteredBidderFilters
} from '../services/api';
import { FilterChipItem } from './common';
import {
  BidderFilterBar,
  BidderFilterDrawer,
  BidderSortOption,
  BidderCard,
  BidderDossier,
  BidderContractsTable
} from './RegisteredBidders';

export const RegisteredBiddersTab: React.FC = () => {
  const { t } = useTranslation();
  const PAGE_SIZE = 12;

  const [bidders, setBidders] = useState<RegisteredBidder[]>([]);
  const [totalDbCount, setTotalDbCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBidderId, setSelectedBidderId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['ALL']);
  const [selectedState, setSelectedState] = useState<string[]>(['ALL']);
  // Default sorting: Alphabetical (A to Z) as requested
  const [sortBy, setSortBy] = useState<BidderSortOption>('NAME_ASC');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Full filter metadata for the drawer
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Map<string, number>>(new Map());
  const [stateCounts, setStateCounts] = useState<Map<string, number>>(new Map());

  const [contractSearchQuery, setContractSearchQuery] = useState<string>('');
  const [rightColumnHeight, setRightColumnHeight] = useState<number | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState<boolean>(false);
  const voiceSearchRef = useRef<any>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isAll = (arr: string[]) => !arr || arr.length === 0 || arr.includes('ALL');

  // Load complete filter options metadata on mount
  useEffect(() => {
    fetchBidderFilters()
      .then((meta) => {
        if (meta.categories && meta.categories.length > 0) {
          setAllCategories(meta.categories);
        }
        if (meta.states && meta.states.length > 0) {
          setAllStates(meta.states);
        }
        if (meta.category_counts && Object.keys(meta.category_counts).length > 0) {
          setCategoryCounts(new Map(Object.entries(meta.category_counts)));
        }
        if (meta.state_counts && Object.keys(meta.state_counts).length > 0) {
          setStateCounts(new Map(Object.entries(meta.state_counts)));
        }
        if (meta.total_count && meta.total_count > 0) {
          setTotalDbCount(meta.total_count);
        }
      })
      .catch((err) => {
        console.warn('Failed to load bidder filter metadata:', err);
      });
  }, []);

  const toggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t('common.searchBar.voiceNotSupported'));
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

  useEffect(() => {
    return () => {
      if (voiceSearchRef.current) {
        try {
          voiceSearchRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  // Build payload for backend API request
  const buildApiFilters = useCallback(
    (customOffset: number = 0, customSearch?: string): RegisteredBidderFilters => {
      const q = customSearch !== undefined ? customSearch : (searchQuery.trim() || undefined);
      const filters: RegisteredBidderFilters = {
        sort_by: sortBy,
        limit: PAGE_SIZE,
        offset: customOffset
      };

      if (q) filters.search = q;
      if (!isAll(selectedCategory)) filters.category = selectedCategory.join(',');
      if (!isAll(selectedState)) filters.state = selectedState.join(',');

      return filters;
    },
    [searchQuery, sortBy, selectedCategory, selectedState]
  );

  // Fetch initial batch (page 1, offset 0) from API with payload
  const loadData = useCallback(
    (searchParam?: string) => {
      setLoading(true);
      const filters = buildApiFilters(0, searchParam);
      listRegisteredBidders(filters)
        .then(({ bidders: data, totalCount }) => {
          setTotalDbCount(totalCount);
          setBidders(data);
          if (data.length > 0) {
            setSelectedBidderId((prevId) => {
              if (!prevId || !data.some((b) => b.id === prevId)) {
                return data[0].id;
              }
              return prevId;
            });
          } else {
            setSelectedBidderId('');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load registered contractors directory');
          setLoading(false);
        });
    },
    [buildApiFilters]
  );

  // Reload data from offset 0 whenever any filter or search query changes
  useEffect(() => {
    loadData();
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [selectedCategory, selectedState, sortBy, searchQuery]);

  // Infinite scroll: fetch next page with offset payload from backend
  const hasMore = bidders.length < totalDbCount;

  const loadMore = useCallback(() => {
    if (isLoadingMore || loading || !hasMore) return;
    setIsLoadingMore(true);

    const filters = buildApiFilters(bidders.length);
    listRegisteredBidders(filters)
      .then(({ bidders: nextBatch }) => {
        if (nextBatch.length > 0) {
          setBidders((prev) => [...prev, ...nextBatch]);
        }
        setIsLoadingMore(false);
      })
      .catch((err) => {
        console.error('Failed to stream next registered contractors batch:', err);
        setIsLoadingMore(false);
      });
  }, [isLoadingMore, loading, hasMore, buildApiFilters, bidders.length]);

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

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText(null);
    }, 2500);
  };

  const selectedBidder = useMemo(() => {
    if (!bidders.length) return null;
    return bidders.find((b) => b.id === selectedBidderId) || bidders[0];
  }, [bidders, selectedBidderId]);

  const filteredContracts = useMemo(() => {
    if (!selectedBidder) return [];
    const cq = contractSearchQuery.toLowerCase().trim();
    if (!cq) return selectedBidder.contracts_won;

    return selectedBidder.contracts_won.filter((c: BidderWonContract) => {
      return (
        c.title.toLowerCase().includes(cq) ||
        c.authority.toLowerCase().includes(cq) ||
        c.portal.toLowerCase().includes(cq) ||
        c.category.toLowerCase().includes(cq) ||
        c.loa_number.toLowerCase().includes(cq) ||
        c.nit_number.toLowerCase().includes(cq)
      );
    });
  }, [selectedBidder, contractSearchQuery]);

  // Dynamically match the left list's max-height to the right dossier column
  useEffect(() => {
    const el = dossierRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024 && el.offsetHeight > 0) {
        setRightColumnHeight(el.offsetHeight);
      } else {
        setRightColumnHeight(null);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(el);

    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [selectedBidderId, contractSearchQuery, filteredContracts?.length]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(['ALL']);
    setSelectedState(['ALL']);
    setSortBy('NAME_ASC');
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  const handleSelectBidderCard = (bidder: RegisteredBidder) => {
    setSelectedBidderId(bidder.id);
    setContractSearchQuery('');
    if (window.innerWidth < 1024) {
      dossierRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenFilterDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseFilterDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  const handleRemoveCategory = (cat: string) => {
    const next = selectedCategory.filter((c) => c !== cat && c !== 'ALL');
    setSelectedCategory(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveState = (st: string) => {
    const next = selectedState.filter((s) => s !== st && s !== 'ALL');
    setSelectedState(next.length === 0 ? ['ALL'] : next);
  };

  const handleResetSortChip = () => {
    setSortBy('NAME_ASC');
  };

  const handleRemoveSearchChip = () => {
    setSearchQuery('');
  };

  const activeChips: FilterChipItem[] = useMemo(() => {
    const list: FilterChipItem[] = [];

    if (!selectedCategory.includes('ALL')) {
      selectedCategory.forEach((cat) => {
        list.push({
          id: `category-${cat}`,
          label: t('bidders.filterDrawer.workSpecialization'),
          value: cat,
          color: 'blue',
          icon: <Tag className="w-3 h-3 text-blue-500" />,
          onRemove: () => handleRemoveCategory(cat)
        });
      });
    }

    if (!selectedState.includes('ALL')) {
      selectedState.forEach((st) => {
        list.push({
          id: `state-${st}`,
          label: t('common.state'),
          value: st,
          color: 'rose',
          icon: <MapPin className="w-3 h-3 text-rose-500" />,
          onRemove: () => handleRemoveState(st)
        });
      });
    }

    if (sortBy !== 'NAME_ASC') {
      const sortLabelMap: Record<BidderSortOption, string> = {
        NAME_ASC: t('bidders.sort.nameAsc'),
        NAME_DESC: t('bidders.sort.nameDesc'),
        CONTRACTS_DESC: t('bidders.sort.contractsDesc'),
        VALUE_DESC: t('bidders.sort.valueDesc'),
        TURNOVER_DESC: t('bidders.sort.turnoverDesc')
      };
      list.push({
        id: 'sort',
        label: t('common.sort'),
        value: sortLabelMap[sortBy],
        color: 'emerald',
        icon: <TrendingUp className="w-3 h-3 text-emerald-500" />,
        onRemove: handleResetSortChip
      });
    }

    if (searchQuery.trim() !== '') {
      list.push({
        id: 'query',
        label: t('common.search'),
        value: `"${searchQuery.trim()}"`,
        color: 'slate',
        onRemove: handleRemoveSearchChip
      });
    }

    return list;
  }, [selectedCategory, selectedState, sortBy, searchQuery, t]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!isAll(selectedCategory)) count += selectedCategory.filter((c) => c !== 'ALL').length;
    if (!isAll(selectedState)) count += selectedState.filter((s) => s !== 'ALL').length;
    if (sortBy !== 'NAME_ASC') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedCategory, selectedState, sortBy, searchQuery]);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar: Search on LEFT, Filters on RIGHT */}
      <BidderFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isVoiceSearching={isVoiceSearching}
        toggleVoiceSearch={toggleVoiceSearch}
        onOpenFilterDrawer={handleOpenFilterDrawer}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
        onReload={() => loadData()}
        isLoading={loading}
        totalBidders={totalDbCount}
        chips={activeChips}
      />

      {/* Overlapping Filter Drawer (Slides from Right) */}
      <BidderFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetFilters}
        totalFilteredCount={totalDbCount}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
        categoryCounts={categoryCounts}
        totalBidders={totalDbCount}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        allStates={allStates}
        stateCounts={stateCounts}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Bidders Directory Cards (35% -> col-span-4) */}
        <div
          ref={listContainerRef}
          className="lg:col-span-4 xl:col-span-4 space-y-2.5 overflow-y-auto pr-1 transition-all duration-150 scroll-smooth custom-scrollbar"
          style={{
            maxHeight: rightColumnHeight
              ? `${Math.max(rightColumnHeight, 550)}px`
              : 'calc(100vh - 250px)',
          }}
        >
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-1 flex items-center justify-between">
            <span>
              {bidders.length < totalDbCount
                ? `Showing ${bidders.length} of ${totalDbCount} Registered Contractors`
                : t('bidders.registeredContractorsCount', { count: totalDbCount })}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('bidders.loadingInRam')}</p>
            </div>
          ) : bidders.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800">
              <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('bidders.noContractorsFound')}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('bidders.noContractorsDesc')}</p>
              <button
                onClick={resetFilters}
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 font-semibold cursor-pointer"
              >
                {t('common.resetAll')}
              </button>
            </div>
          ) : (
            <>
              {bidders.map((b, index) => {
                const isSelected = selectedBidder ? b.id === selectedBidder.id : false;
                const secondLastIndex = bidders.length >= 2 ? bidders.length - 2 : 0;
                const isSecondLast = hasMore && index === secondLastIndex;

                return (
                  <div key={b.id} ref={isSecondLast ? secondLastCardRef : undefined}>
                    <BidderCard
                      bidder={b}
                      isSelected={isSelected}
                      onSelect={() => handleSelectBidderCard(b)}
                    />
                  </div>
                );
              })}

              {/* Infinite Scroll / Batch Loading Indicator */}
              {isLoadingMore && (
                <div className="py-3 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                  <span>Loading next 12 contractors...</span>
                </div>
              )}

              {/* Load More Button for Direct Click Navigation */}
              {hasMore && !isLoadingMore && (
                <div className="pt-1 pb-1 text-center">
                  <button
                    onClick={loadMore}
                    className="w-full py-2 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/80 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Load more ({totalDbCount - bidders.length} remaining)</span>
                  </button>
                </div>
              )}

              {!hasMore && bidders.length > 0 && (
                <div className="py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Showing all {totalDbCount} registered contractors
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Complete Contractor Profile Dossier (65% -> col-span-8) */}
        <div ref={dossierRef} className="lg:col-span-8 xl:col-span-8">
          {selectedBidder ? (
            <div className="space-y-4">
              {/* Header Dossier Card */}
              <BidderDossier
                selectedBidder={selectedBidder}
                onCopy={handleCopy}
                copiedText={copiedText}
              />

              {/* Complete Contracts Executed Till Date Table */}
              <BidderContractsTable
                totalContractsCount={selectedBidder.total_contracts_won}
                contractSearchQuery={contractSearchQuery}
                setContractSearchQuery={setContractSearchQuery}
                filteredContracts={filteredContracts}
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-8 text-center text-slate-400 dark:text-slate-500">
              {t('bidders.selectContractorPrompt')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
