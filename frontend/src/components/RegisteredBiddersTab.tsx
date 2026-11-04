import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Building2, AlertCircle, Tag, MapPin, TrendingUp } from 'lucide-react';
import { RegisteredBidder, BidderWonContract } from '../types';
import { listRegisteredBidders } from '../services/api';
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
  const [bidders, setBidders] = useState<RegisteredBidder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBidderId, setSelectedBidderId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  // Default sorting: Alphabetical (A to Z) as requested
  const [sortBy, setSortBy] = useState<BidderSortOption>('NAME_ASC');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [contractSearchQuery, setContractSearchQuery] = useState<string>('');
  const [rightColumnHeight, setRightColumnHeight] = useState<number | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState<boolean>(false);
  const voiceSearchRef = useRef<any>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    return () => {
      if (voiceSearchRef.current) {
        try {
          voiceSearchRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const loadData = () => {
    setLoading(true);
    listRegisteredBidders()
      .then((data) => {
        setBidders(data);
        if (data.length > 0 && !selectedBidderId) {
          setSelectedBidderId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load registered contractors directory');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText(null);
    }, 2500);
  };

  const allCategories = useMemo(() => {
    const s = new Set<string>();
    bidders.forEach((b) => b.categories.forEach((c) => s.add(c)));
    return Array.from(s).sort();
  }, [bidders]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    bidders.forEach((b) => {
      if (b.categories) {
        b.categories.forEach((c) => {
          map.set(c, (map.get(c) || 0) + 1);
        });
      }
    });
    return map;
  }, [bidders]);

  const allStates = useMemo(() => {
    const s = new Set<string>();
    bidders.forEach((b) => {
      if (b.states) b.states.forEach((st) => s.add(st));
    });
    return Array.from(s).sort();
  }, [bidders]);

  const stateCounts = useMemo(() => {
    const map = new Map<string, number>();
    bidders.forEach((b) => {
      if (b.states) {
        b.states.forEach((st) => {
          map.set(st, (map.get(st) || 0) + 1);
        });
      }
    });
    return map;
  }, [bidders]);

  const filteredBidders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return bidders
      .filter((b) => {
        if (q) {
          const matchName = b.name.toLowerCase().includes(q);
          const matchCin = b.cin.toLowerCase().includes(q);
          const matchGstin = b.gstin.toLowerCase().includes(q);
          const matchPan = b.pan.toLowerCase().includes(q);
          const matchOffice = b.registered_office.toLowerCase().includes(q);
          const matchStates = b.states ? b.states.some((st) => st.toLowerCase().includes(q)) : false;
          const matchCat = b.categories.some((c) => c.toLowerCase().includes(q));
          const matchPortals = b.portals ? b.portals.some((p) => p.toLowerCase().includes(q)) : false;
          if (!matchName && !matchCin && !matchGstin && !matchPan && !matchOffice && !matchStates && !matchCat && !matchPortals) {
            return false;
          }
        }

        if (selectedCategory !== 'ALL' && !b.categories.includes(selectedCategory)) {
          return false;
        }

        if (selectedState !== 'ALL' && (!b.states || !b.states.includes(selectedState))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NAME_ASC') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'NAME_DESC') {
          return b.name.localeCompare(a.name);
        } else if (sortBy === 'CONTRACTS_DESC') {
          return b.total_contracts_won - a.total_contracts_won;
        } else if (sortBy === 'VALUE_DESC') {
          return b.total_awarded_value_inr - a.total_awarded_value_inr;
        } else if (sortBy === 'TURNOVER_DESC') {
          return b.audited_turnover_inr - a.audited_turnover_inr;
        }
        return 0;
      });
  }, [bidders, searchQuery, selectedCategory, selectedState, sortBy]);

  // Whenever ANY filter is reset or changed, automatically select the first record in the refreshed list
  const currentFilterKey = `${selectedCategory}|${selectedState}|${sortBy}|${searchQuery.trim()}`;
  const [prevFilterKey, setPrevFilterKey] = useState<string>(currentFilterKey);

  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    const firstBidder = filteredBidders[0];
    const targetId = firstBidder ? firstBidder.id : '';
    setSelectedBidderId(targetId);
  }

  const selectedBidder = useMemo(() => {
    if (!filteredBidders.length) return null;
    return filteredBidders.find((b) => b.id === selectedBidderId) || filteredBidders[0];
  }, [filteredBidders, selectedBidderId]);

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

  const selectFirstBidderRecord = (bidderList: RegisteredBidder[]) => {
    const firstBidder = bidderList[0];
    const targetId = firstBidder ? firstBidder.id : '';
    setSelectedBidderId(targetId);
  };

  const resetFilterStateValues = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedState('ALL');
    setSortBy('NAME_ASC');
  };

  const scrollListContainerToTop = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  const handleFilterChangeScrollTop = () => {
    scrollListContainerToTop();
  };

  useEffect(() => {
    handleFilterChangeScrollTop();
  }, [currentFilterKey]);

  const resetFilters = () => {
    resetFilterStateValues();
    selectFirstBidderRecord(bidders);
    scrollListContainerToTop();
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

  const handleRemoveCategoryChip = () => {
    setSelectedCategory('ALL');
  };

  const handleRemoveStateChip = () => {
    setSelectedState('ALL');
  };

  const handleResetSortChip = () => {
    setSortBy('NAME_ASC');
  };

  const handleRemoveSearchChip = () => {
    setSearchQuery('');
  };

  const activeChips: FilterChipItem[] = useMemo(() => {
    const list: FilterChipItem[] = [];

    if (selectedCategory !== 'ALL') {
      list.push({
        id: 'category',
        label: 'Specialization',
        value: selectedCategory,
        color: 'blue',
        icon: <Tag className="w-3 h-3 text-blue-500" />,
        onRemove: handleRemoveCategoryChip
      });
    }

    if (selectedState !== 'ALL') {
      list.push({
        id: 'state',
        label: 'State',
        value: selectedState,
        color: 'rose',
        icon: <MapPin className="w-3 h-3 text-rose-500" />,
        onRemove: handleRemoveStateChip
      });
    }

    if (sortBy !== 'NAME_ASC') {
      const sortLabelMap: Record<BidderSortOption, string> = {
        NAME_ASC: 'Alphabetical (A → Z)',
        NAME_DESC: 'Alphabetical (Z → A)',
        CONTRACTS_DESC: 'Most Contracts',
        VALUE_DESC: 'Highest Value',
        TURNOVER_DESC: 'Highest Turnover'
      };
      list.push({
        id: 'sort',
        label: 'Sort',
        value: sortLabelMap[sortBy],
        color: 'emerald',
        icon: <TrendingUp className="w-3 h-3 text-emerald-500" />,
        onRemove: handleResetSortChip
      });
    }

    if (searchQuery.trim() !== '') {
      list.push({
        id: 'query',
        label: 'Query',
        value: `"${searchQuery.trim()}"`,
        color: 'slate',
        onRemove: handleRemoveSearchChip
      });
    }

    return list;
  }, [selectedCategory, selectedState, sortBy, searchQuery]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'ALL') count++;
    if (selectedState !== 'ALL') count++;
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
        onReload={loadData}
        isLoading={loading}
        totalBidders={bidders.length}
        chips={activeChips}
      />

      {/* Overlapping Filter Drawer (Slides from Right) */}
      <BidderFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetFilters}
        totalFilteredCount={filteredBidders.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
        categoryCounts={categoryCounts}
        totalBidders={bidders.length}
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
            <span>Registered Contractors ({filteredBidders.length})</span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading contractor directory in RAM...</p>
            </div>
          ) : filteredBidders.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800">
              <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Contractors Found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try broadening your search or resetting filters.</p>
              <button
                onClick={resetFilters}
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredBidders.map((b) => {
              const isSelected = selectedBidder ? b.id === selectedBidder.id : false;
              return (
                <BidderCard
                  key={b.id}
                  bidder={b}
                  isSelected={isSelected}
                  onSelect={() => handleSelectBidderCard(b)}
                />
              );
            })
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
              Select a contractor to view complete profile dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
