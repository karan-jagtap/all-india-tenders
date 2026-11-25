import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Award,
  FileText,
  Building2,
  Calendar,
  ShieldCheck,
  Download,
  ExternalLink,
  CheckCircle2,
  FolderLock,
  Stamp,
  Users,
  TrendingDown,
  Layers,
  MapPin,
  Globe,
  Wrench,
  Scale,
  Clock,
  DollarSign,
  Truck,
  FileSpreadsheet,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import {
  FilterSearchBar,
  TopFilterActionBar,
  ActiveFilterChipsBar,
  TenderFilterDrawer,
  FilterChipItem,
  ToolbarSortDropdown,
  ToolbarSortOption
} from './common';
import {
  AcceptedTender,
  listAcceptedTenders,
  getAcceptedTenderPdfUrl,
  AcceptedTenderFilters
} from '../services/api';
import { DetailModalTab, AcceptedTenderModalTab, AcceptedTenderSortOption, EnrichedAcceptedTender } from '../types';
import { formatDate, renderBulletPoint } from '../utils';
import { AllBidsEvaluationSubTab } from './AcceptedTenders/AllBidsEvaluationSubTab';
import {
  ALL_CANONICAL_CATEGORIES,
  ALL_STATUTORY_PORTAL_SOURCES,
  ALL_MASTER_ORGANIZATIONS,
  ALL_CANONICAL_STATES,
  ALL_MASTER_CITIES,
  canonicalizeCategory,
  canonicalizePortalSource,
  subscribeMasterFilters,
  subscribePortalSources,
  ACCEPTED_TENDER_SORT_OPTIONS
} from '../constants';

export { ACCEPTED_TENDER_SORT_OPTIONS };

const getTenderSource = (tender: AcceptedTender): string => {
  return canonicalizePortalSource(tender.og_tender?.portal);
};

const getTenderOrg = (tender: AcceptedTender): string => {
  return tender.og_tender?.authority?.trim() || 'Other Government Bodies';
};

const getTenderState = (tender: AcceptedTender): string => {
  const title = (tender.title || '').toLowerCase();
  const scope = (tender.og_tender?.scope_summary || '').toLowerCase();
  const auth = (tender.og_tender?.authority || '').toLowerCase();
  const portal = (tender.og_tender?.portal || '').toLowerCase();
  const full = `${title} ${scope} ${auth} ${portal}`;

  if (full.includes('tamil nadu') || full.includes('chennai') || full.includes('tntenders') || full.includes('coimbatore') || full.includes('madurai') || full.includes('cmrl') || full.includes('twad')) {
    return 'Tamil Nadu';
  }
  if (full.includes('kerala') || full.includes('kochi') || full.includes('thiruvananthapuram') || full.includes('kmrl') || full.includes('etenders.kerala')) {
    return 'Kerala';
  }
  if (full.includes('telangana') || full.includes('hyderabad') || full.includes('ghmc') || full.includes('hmda') || full.includes('tender.telangana')) {
    return 'Telangana';
  }
  if (full.includes('andhra') || full.includes('visakhapatnam') || full.includes('amaravati') || full.includes('crda') || full.includes('apeprocurement')) {
    return 'Andhra Pradesh';
  }
  if (full.includes('karnataka') || full.includes('bengaluru') || full.includes('bangalore') || full.includes('kppp') || full.includes('bbmp') || full.includes('bmrcl') || full.includes('mysuru')) {
    return 'Karnataka';
  }
  if (full.includes('maharashtra') || full.includes('pune') || full.includes('mumbai') || full.includes('thane') || full.includes('nagpur') || full.includes('pcmc') || full.includes('pmc') || full.includes('msrdc') || full.includes('mmrda') || full.includes('mahatenders')) {
    return 'Maharashtra';
  }
  if (full.includes('gujarat') || full.includes('ahmedabad') || full.includes('surat') || full.includes('vadodara') || full.includes('gift city') || full.includes('nprocure')) {
    return 'Gujarat';
  }
  if (full.includes('rajasthan') || full.includes('jaipur') || full.includes('jodhpur') || full.includes('udaipur') || full.includes('riico') || full.includes('eproc.rajasthan')) {
    return 'Rajasthan';
  }
  if (full.includes('west bengal') || full.includes('kolkata') || full.includes('howrah') || full.includes('siliguri') || full.includes('wbtenders') || full.includes('kmda')) {
    return 'West Bengal';
  }
  if (full.includes('odisha') || full.includes('bhubaneswar') || full.includes('cuttack') || full.includes('puri') || full.includes('tendersodisha') || full.includes('watco')) {
    return 'Odisha';
  }
  if (full.includes('bihar') || full.includes('patna') || full.includes('gaya') || full.includes('buidco') || full.includes('eproc2.bihar')) {
    return 'Bihar';
  }
  if (full.includes('madhya pradesh') || full.includes('bhopal') || full.includes('indore') || full.includes('jabalpur') || full.includes('mptenders')) {
    return 'Madhya Pradesh';
  }
  if (full.includes('haryana') || full.includes('gurugram') || full.includes('faridabad') || full.includes('panipat') || full.includes('hry.nic.in') || full.includes('hsvp') || full.includes('gmda')) {
    return 'Haryana';
  }
  if (full.includes('punjab') || full.includes('amritsar') || full.includes('ludhiana') || full.includes('mohali') || full.includes('eproc.punjab')) {
    return 'Punjab';
  }
  if (full.includes('uttar pradesh') || full.includes('lucknow') || full.includes('noida') || full.includes('varanasi') || full.includes('kanpur') || full.includes('etender.up') || full.includes('upeida')) {
    return 'Uttar Pradesh';
  }
  if (full.includes('delhi') || full.includes('dmrc') || full.includes('dda') || full.includes('dwarka') || full.includes('nct of delhi')) {
    return 'Delhi NCR';
  }
  if (full.includes('assam') || full.includes('guwahati') || full.includes('silchar') || full.includes('brahmaputra') || full.includes('assamtenders')) {
    return 'Assam & North East';
  }
  if (full.includes('jammu') || full.includes('kashmir') || full.includes('srinagar') || full.includes('ladakh') || full.includes('leh') || full.includes('jktenders')) {
    return 'Jammu & Kashmir / Ladakh';
  }
  if (full.includes('uttarakhand') || full.includes('dehradun') || full.includes('rishikesh') || full.includes('uktenders')) {
    return 'Uttarakhand';
  }
  if (full.includes('himachal') || full.includes('shimla') || full.includes('kullu') || full.includes('hptenders')) {
    return 'Himachal Pradesh';
  }
  return 'Pan-India / Central';
};

const getTenderCity = (tender: AcceptedTender): string => {
  const title = (tender.title || '').toLowerCase();
  const scope = (tender.og_tender?.scope_summary || '').toLowerCase();
  const auth = (tender.og_tender?.authority || '').toLowerCase();
  const full = `${title} ${scope} ${auth}`;

  const state = getTenderState(tender);

  if (state === 'Tamil Nadu') {
    for (const c of ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Chennai (HQ)';
  }
  if (state === 'Karnataka') {
    for (const c of ['Bengaluru', 'Mysuru', 'Hubli-Dharwad', 'Mangalore', 'Belagavi', 'Kalaburagi', 'Ballari', 'Hassan']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Kerala') {
    for (const c of ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Palakkad']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Telangana') {
    for (const c of ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Secunderabad']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Hyderabad (HQ)';
  }
  if (state === 'Andhra Pradesh') {
    for (const c of ['Visakhapatnam', 'Vijayawada', 'Amaravati', 'Guntur', 'Tirupati', 'Nellore', 'Kakinada']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Maharashtra') {
    for (const c of ['Pune', 'Mumbai', 'Thane', 'Navi Mumbai', 'Chakan', 'Baramati', 'Nagpur', 'Nashik', 'Pimpri-Chinchwad']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Gujarat') {
    for (const c of ['Ahmedabad', 'Surat', 'Vadodara', 'Gandhinagar', 'Rajkot', 'Bhavnagar', 'GIFT City']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Rajasthan') {
    for (const c of ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'West Bengal') {
    for (const c of ['Kolkata', 'Siliguri', 'Howrah', 'Asansol', 'Durgapur', 'Haldia', 'Kharagpur']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Kolkata (HQ)';
  }
  if (state === 'Odisha') {
    for (const c of ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Berhampur', 'Balasore']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Bihar') {
    for (const c of ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Madhya Pradesh') {
    for (const c of ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Haryana') {
    for (const c of ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Panchkula', 'Rohtak']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Punjab') {
    for (const c of ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 'Ropar']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Delhi NCR') {
    for (const c of ['Dwarka', 'Narela', 'Rohini', 'Jasola', 'Pitampura', 'Central Delhi', 'South Delhi', 'Siri Fort']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'New Delhi (HQ)';
  }
  if (state === 'Assam & North East') {
    for (const c of ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Agartala', 'Shillong', 'Imphal', 'Aizawl', 'Kohima']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Regional / Border';
  }
  if (state === 'Jammu & Kashmir / Ladakh') {
    for (const c of ['Srinagar', 'Jammu', 'Leh-Ladakh', 'Baramulla', 'Anantnag', 'Kupwara', 'Udhampur']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Border Sectors';
  }
  if (state === 'Uttar Pradesh') {
    for (const c of ['Noida / NCR', 'Lucknow', 'Varanasi', 'Kanpur', 'Prayagraj', 'Ayodhya', 'Agra', 'Ghaziabad']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Statewide / Other';
  }
  if (state === 'Uttarakhand' || state === 'Himachal Pradesh') {
    for (const c of ['Dehradun', 'Rishikesh', 'Haridwar', 'Shimla', 'Bilaspur', 'Kullu', 'Dharamshala']) {
      if (full.includes(c.toLowerCase())) return c;
    }
    return 'Hill Regions';
  }
  return 'Pan-India';
};

export const PreviouslyAcceptedTendersTab: React.FC = () => {
  const { t } = useTranslation();
  const [tenders, setTenders] = useState<EnrichedAcceptedTender[]>([]);
  const [totalDbCount, setTotalDbCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<DetailModalTab>(AcceptedTenderModalTab.COMPARISON);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['ALL']);
  const [selectedSource, setSelectedSource] = useState<string[]>(['ALL']);
  const [selectedOrg, setSelectedOrg] = useState<string[]>(['ALL']);
  const [selectedState, setSelectedState] = useState<string[]>(['ALL']);
  const [selectedCity, setSelectedCity] = useState<string[]>(['ALL']);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<AcceptedTenderSortOption>('AWARD_DATE_DESC');
  const [isVoiceSearching, setIsVoiceSearching] = useState<boolean>(false);
  const voiceSearchRef = useRef<any>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const searchQueryRef = useRef<string>(searchQuery);

  // Overlapping Filter Sidebar Drawer State
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState<boolean>(false);
  const [filterConstantsTick, setFilterConstantsTick] = useState<number>(0);

  useEffect(() => {
    const unsub1 = subscribeMasterFilters(() => setFilterConstantsTick((tick) => tick + 1));
    const unsub2 = subscribePortalSources(() => setFilterConstantsTick((tick) => tick + 1));
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  useEffect(() => {
    if (!isFilterSidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterSidebarOpen]);

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
    (customOffset: number = 0, customSearch?: string): AcceptedTenderFilters => {
      const q = customSearch !== undefined ? customSearch : (searchQuery.trim() || undefined);
      const filters: AcceptedTenderFilters = {
        sort_by: sortBy,
        limit: PAGE_SIZE,
        offset: customOffset
      };

      if (q) filters.search = q;
      if (!isAll(selectedCategory)) filters.category = selectedCategory.join(',');
      if (selectedYear !== 'ALL') filters.year = selectedYear;
      if (!isAll(selectedSource)) filters.source_portal = selectedSource.join(',');
      if (!isAll(selectedOrg)) filters.organization = selectedOrg.join(',');
      if (!isAll(selectedState)) filters.state = selectedState.join(',');
      if (!isAll(selectedCity)) filters.city = selectedCity.join(',');

      return filters;
    },
    [searchQuery, sortBy, selectedCategory, selectedYear, selectedSource, selectedOrg, selectedState, selectedCity]
  );

  const loadData = useCallback(
    (searchParam?: string) => {
      setLoading(true);
      const filters = buildApiFilters(0, searchParam);
      listAcceptedTenders(filters)
        .then(({ tenders: data, totalCount }) => {
          setTotalDbCount(totalCount);
          const enriched: EnrichedAcceptedTender[] = data.map((t) => {
            const source = getTenderSource(t);
            const sourceLabel = source.split('(')[0].trim();
            const category = canonicalizeCategory(t.category, t.title, t.og_tender?.scope_summary);
            const org = getTenderOrg(t);
            const state = getTenderState(t);
            const city = getTenderCity(t);
            const searchBlob = `${t.id} ${t.title} ${t.winning_company?.name || ''} ${t.og_tender?.authority || ''} ${t.og_tender?.nit_number || ''} ${source} ${category} ${org} ${state} ${city}`.toLowerCase();
            return {
              ...t,
              _source: source,
              _sourceLabel: sourceLabel,
              _category: category,
              _org: org,
              _state: state,
              _city: city,
              _searchBlob: searchBlob
            };
          });
          setTenders(enriched);
          if (enriched.length > 0) {
            setSelectedTenderId((prevId) => {
              if (!prevId || !enriched.some((t) => t.id === prevId)) {
                return enriched[0].id;
              }
              return prevId;
            });
          } else {
            setSelectedTenderId('');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load accepted tenders');
          setLoading(false);
        });
    },
    [buildApiFilters]
  );

  // When filters change (category, source, org, state, city, year, sortBy), reload first 12 items and reset scroll
  useEffect(() => {
    loadData();
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [
    selectedCategory,
    selectedSource,
    selectedOrg,
    selectedState,
    selectedCity,
    selectedYear,
    sortBy
  ]);

  // Debounced server search
  useEffect(() => {
    // Prevent duplicate load on initial mount when searchQuery hasn't changed from empty string
    if (searchQuery === searchQueryRef.current) {
      return;
    }
    const prevQ = searchQueryRef.current.trim();
    searchQueryRef.current = searchQuery;
    const q = searchQuery.trim();

    if (q.length >= 3) {
      const timer = setTimeout(() => {
        loadData(q);
        if (listContainerRef.current) {
          listContainerRef.current.scrollTop = 0;
        }
      }, 350);
      return () => clearTimeout(timer);
    } else if (q.length === 0 && prevQ.length > 0) {
      loadData('');
      if (listContainerRef.current) {
        listContainerRef.current.scrollTop = 0;
      }
    }
  }, [searchQuery, loadData]);

  const formatINR = (val?: number) => {
    if (!val) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const query = searchQuery.toLowerCase().trim();
  const isAll = (arr: string[]) => !arr || arr.length === 0 || arr.includes('ALL');

  // Faceted matcher for historical accepted bids in current batch
  const matchesFilter = useCallback(
    (t: EnrichedAcceptedTender, excludeDimension?: string) => {
      if (query && !t._searchBlob.includes(query)) return false;

      if (excludeDimension !== 'category' && !isAll(selectedCategory) && !selectedCategory.includes(t._category)) {
        return false;
      }
      if (excludeDimension !== 'source' && !isAll(selectedSource) && !selectedSource.includes(t._source)) {
        return false;
      }
      if (excludeDimension !== 'org' && !isAll(selectedOrg) && !selectedOrg.includes(t._org)) {
        return false;
      }
      if (excludeDimension !== 'state' && !isAll(selectedState) && !selectedState.includes(t._state)) {
        return false;
      }
      if (excludeDimension !== 'city' && !isAll(selectedCity) && !selectedCity.includes(t._city)) {
        return false;
      }
      if (excludeDimension !== 'year' && selectedYear !== 'ALL' && String(t.year) !== selectedYear) {
        return false;
      }
      return true;
    },
    [query, selectedCategory, selectedSource, selectedOrg, selectedState, selectedCity, selectedYear]
  );

  // 0. Faceted context & counts for Categories
  const contextForCategory = useMemo(() => {
    return tenders.filter((t) => matchesFilter(t, 'category'));
  }, [tenders, matchesFilter]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForCategory) {
      if (t._category) {
        map.set(t._category, (map.get(t._category) || 0) + 1);
      }
    }
    return map;
  }, [contextForCategory]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>(ALL_CANONICAL_CATEGORIES);
    for (const t of tenders) {
      if (t._category) set.add(t._category);
    }
    selectedCategory.forEach((cat) => {
      if (cat !== 'ALL') set.add(cat);
    });
    return Array.from(set).sort();
  }, [tenders, selectedCategory, filterConstantsTick]);

  // 1. Faceted context & counts for Sources
  const contextForSource = useMemo(() => {
    return tenders.filter((t) => matchesFilter(t, 'source'));
  }, [tenders, matchesFilter]);

  const sourceCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForSource) {
      map.set(t._source, (map.get(t._source) || 0) + 1);
    }
    return map;
  }, [contextForSource]);

  const availableSources = useMemo(() => {
    const set = new Set<string>(ALL_STATUTORY_PORTAL_SOURCES);
    for (const t of tenders) {
      if (t._source) set.add(t._source);
    }
    selectedSource.forEach((src) => {
      if (src !== 'ALL') set.add(src);
    });
    return Array.from(set).sort();
  }, [tenders, selectedSource, filterConstantsTick]);

  // 2. Faceted context & counts for Organisations
  const contextForOrg = useMemo(() => {
    return tenders.filter((t) => matchesFilter(t, 'org'));
  }, [tenders, matchesFilter]);

  const orgCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForOrg) {
      map.set(t._org, (map.get(t._org) || 0) + 1);
    }
    return map;
  }, [contextForOrg]);

  const availableOrgs = useMemo(() => {
    const set = new Set<string>(ALL_MASTER_ORGANIZATIONS);
    for (const t of tenders) {
      if (t._org) set.add(t._org);
    }
    selectedOrg.forEach((org) => {
      if (org !== 'ALL') set.add(org);
    });
    return Array.from(set).sort();
  }, [tenders, selectedOrg, filterConstantsTick]);

  // 3. Faceted context & counts for States
  const contextForState = useMemo(() => {
    return tenders.filter((t) => matchesFilter(t, 'state'));
  }, [tenders, matchesFilter]);

  const stateCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForState) {
      if (t._state) {
        map.set(t._state, (map.get(t._state) || 0) + 1);
      }
    }
    return map;
  }, [contextForState]);

  const availableStates = useMemo(() => {
    const set = new Set<string>(ALL_CANONICAL_STATES);
    for (const t of tenders) {
      if (t._state) set.add(t._state);
    }
    selectedState.forEach((st) => {
      if (st !== 'ALL') set.add(st);
    });
    return Array.from(set).sort();
  }, [tenders, selectedState, filterConstantsTick]);

  // 4. Faceted context & counts for Cities
  const contextForCity = useMemo(() => {
    return tenders.filter((t) => matchesFilter(t, 'city'));
  }, [tenders, matchesFilter]);

  const cityCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForCity) {
      if (t._city) {
        map.set(t._city, (map.get(t._city) || 0) + 1);
      }
    }
    return map;
  }, [contextForCity]);

  const availableCities = useMemo(() => {
    const set = new Set<string>(ALL_MASTER_CITIES);
    for (const t of tenders) {
      if (t._city) set.add(t._city);
    }
    selectedCity.forEach((ct) => {
      if (ct !== 'ALL') set.add(ct);
    });
    return Array.from(set).sort();
  }, [tenders, selectedCity, filterConstantsTick]);

  // 5. Faceted context & counts for Years
  const contextForYear = useMemo(() => {
    return tenders.filter((t) => matchesFilter(t, 'year'));
  }, [tenders, matchesFilter]);

  const yearCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contextForYear) {
      const yr = String(t.year);
      map.set(yr, (map.get(yr) || 0) + 1);
    }
    return map;
  }, [contextForYear]);

  const availableYears = useMemo(() => {
    const set = new Set<string>(['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017']);
    for (const t of tenders) {
      if (t.year) set.add(String(t.year));
    }
    if (selectedYear !== 'ALL') set.add(selectedYear);
    return Array.from(set).sort().reverse();
  }, [tenders, selectedYear]);

  // Filtered tenders are streamed directly from backend in 12-item batches
  const filteredTenders = tenders;

  // Whenever ANY filter is reset or changed, automatically select the first record in the refreshed list
  const currentFilterKey = `${selectedCategory.slice().sort().join(',')}|${selectedSource.slice().sort().join(',')}|${selectedOrg.slice().sort().join(',')}|${selectedState.slice().sort().join(',')}|${selectedCity.slice().sort().join(',')}|${selectedYear}|${sortBy}|${searchQuery.trim()}`;
  const [prevFilterKey, setPrevFilterKey] = useState<string>(currentFilterKey);

  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    const firstTender = filteredTenders[0];
    const targetId = firstTender ? firstTender.id : '';
    setSelectedTenderId(targetId);
  }

  const selectedTender = useMemo(() => {
    return (
      filteredTenders.find((t) => t.id === selectedTenderId) ||
      filteredTenders[0] ||
      null
    );
  }, [filteredTenders, selectedTenderId]);

  // Reset active sub-tab to first tab (1. OG Tender vs Winning Bid) when a new tender is selected
  useEffect(() => {
    if (selectedTender?.id) {
      setActiveSubTab('comparison');
    }
  }, [selectedTender?.id]);

  const hasActiveFilters =
    !isAll(selectedCategory) ||
    !isAll(selectedSource) ||
    !isAll(selectedOrg) ||
    !isAll(selectedState) ||
    !isAll(selectedCity) ||
    selectedYear !== 'ALL' ||
    sortBy !== 'AWARD_DATE_DESC' ||
    searchQuery.trim() !== '';

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!isAll(selectedCategory)) count += selectedCategory.filter((c) => c !== 'ALL').length;
    if (!isAll(selectedSource)) count += selectedSource.filter((s) => s !== 'ALL').length;
    if (!isAll(selectedOrg)) count += selectedOrg.filter((o) => o !== 'ALL').length;
    if (!isAll(selectedState)) count += selectedState.filter((st) => st !== 'ALL').length;
    if (!isAll(selectedCity)) count += selectedCity.filter((ct) => ct !== 'ALL').length;
    if (selectedYear !== 'ALL') count++;
    if (sortBy !== 'AWARD_DATE_DESC') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedCategory, selectedSource, selectedOrg, selectedState, selectedCity, selectedYear, sortBy, searchQuery]);

  const selectFirstAcceptedTenderRecord = (tenderList: EnrichedAcceptedTender[]) => {
    const firstTender = tenderList[0];
    const targetId = firstTender ? firstTender.id : '';
    setSelectedTenderId(targetId);
  };

  const resetFilterStateValues = () => {
    setSelectedCategory(['ALL']);
    setSelectedSource(['ALL']);
    setSelectedOrg(['ALL']);
    setSelectedState(['ALL']);
    setSelectedCity(['ALL']);
    setSelectedYear('ALL');
    setSortBy('AWARD_DATE_DESC');
    setSearchQuery('');
  };

  const scrollListContainerToTop = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  const resetAllFilters = () => {
    resetFilterStateValues();
    selectFirstAcceptedTenderRecord(tenders);
    scrollListContainerToTop();
  };

  const handleOpenFilterDrawer = () => {
    setIsFilterSidebarOpen(true);
  };

  const handleCloseFilterDrawer = () => {
    setIsFilterSidebarOpen(false);
  };

  const handleReload = () => {
    loadData();
  };

  const handleSelectTenderCard = (tender: EnrichedAcceptedTender) => {
    setSelectedTenderId(tender.id);
    setActiveSubTab(AcceptedTenderModalTab.COMPARISON);
    if (window.innerWidth < 1024) {
      dossierRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRemoveCategory = (cat: string) => {
    const next = selectedCategory.filter((c) => c !== cat && c !== 'ALL');
    setSelectedCategory(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveSource = (src: string) => {
    const next = selectedSource.filter((s) => s !== src && s !== 'ALL');
    setSelectedSource(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveOrg = (org: string) => {
    const next = selectedOrg.filter((o) => o !== org && o !== 'ALL');
    setSelectedOrg(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveState = (st: string) => {
    const next = selectedState.filter((s) => s !== st && s !== 'ALL');
    setSelectedState(next.length === 0 ? ['ALL'] : next);
    if (next.length === 0) {
      setSelectedCity(['ALL']);
    }
  };

  const handleRemoveCity = (ct: string) => {
    const next = selectedCity.filter((c) => c !== ct && c !== 'ALL');
    setSelectedCity(next.length === 0 ? ['ALL'] : next);
  };

  const handleRemoveYearChip = () => {
    setSelectedYear('ALL');
  };

  const handleRemoveQueryChip = () => {
    setSearchQuery('');
  };

  const pdfUrl = useMemo(() => {
    return selectedTender ? getAcceptedTenderPdfUrl(selectedTender.id) : '';
  }, [selectedTender?.id]);

  // Infinite scroll (server-paginated 12 tenders per batch based on offset)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const visibleTenders = tenders;
  const hasMoreToRender = tenders.length < totalDbCount;

  const loadMore = useCallback(() => {
    if (isLoadingMore || loading || !hasMoreToRender) return;
    setIsLoadingMore(true);

    const filters = buildApiFilters(tenders.length);
    listAcceptedTenders(filters)
      .then(({ tenders: nextBatch }) => {
        if (nextBatch.length > 0) {
          const enrichedBatch: EnrichedAcceptedTender[] = nextBatch.map((t) => {
            const source = getTenderSource(t);
            const sourceLabel = source.split('(')[0].trim();
            const category = canonicalizeCategory(t.category, t.title, t.og_tender?.scope_summary);
            const org = getTenderOrg(t);
            const state = getTenderState(t);
            const city = getTenderCity(t);
            const searchBlob = `${t.id} ${t.title} ${t.winning_company?.name || ''} ${t.og_tender?.authority || ''} ${t.og_tender?.nit_number || ''} ${source} ${category} ${org} ${state} ${city}`.toLowerCase();
            return {
              ...t,
              _source: source,
              _sourceLabel: sourceLabel,
              _category: category,
              _org: org,
              _state: state,
              _city: city,
              _searchBlob: searchBlob
            };
          });
          setTenders((prev) => [...prev, ...enrichedBatch]);
        }
        setIsLoadingMore(false);
      })
      .catch((err) => {
        console.error('Failed to stream next accepted tenders batch:', err);
        setIsLoadingMore(false);
      });
  }, [isLoadingMore, loading, hasMoreToRender, buildApiFilters, tenders.length]);

  const handleFilterChangeResetScroll = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    handleFilterChangeResetScroll();
  }, [currentFilterKey]);

  // Observe the 2nd-to-last card to trigger loading the next batch of 12
  const secondLastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (!node || !hasMoreToRender) return;

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
    [hasMoreToRender, loadMore]
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

  const localizedSortOptions = useMemo<ToolbarSortOption<AcceptedTenderSortOption>[]>(() => [
    {
      value: 'AWARD_DATE_DESC',
      label: t('acceptedTenders.sort.awardDateDesc'),
      shortLabel: t('acceptedTenders.sort.awardDateDescShort'),
      desc: t('acceptedTenders.sort.awardDateDescDescription')
    },
    {
      value: 'AWARD_DATE_ASC',
      label: t('acceptedTenders.sort.awardDateAsc'),
      shortLabel: t('acceptedTenders.sort.awardDateAscShort'),
      desc: t('acceptedTenders.sort.awardDateAscDescription')
    },
    {
      value: 'VALUE_DESC',
      label: t('acceptedTenders.sort.valueDesc'),
      shortLabel: t('acceptedTenders.sort.valueDescShort'),
      desc: t('acceptedTenders.sort.valueDescDescription')
    },
    {
      value: 'VALUE_ASC',
      label: t('acceptedTenders.sort.valueAsc'),
      shortLabel: t('acceptedTenders.sort.valueAscShort'),
      desc: t('acceptedTenders.sort.valueAscDescription')
    },
    {
      value: 'DISCOUNT_DESC',
      label: t('acceptedTenders.sort.discountDesc'),
      shortLabel: t('acceptedTenders.sort.discountDescShort'),
      desc: t('acceptedTenders.sort.discountDescDescription')
    },
    {
      value: 'CONTRACTOR_ASC',
      label: t('acceptedTenders.sort.contractorAsc'),
      shortLabel: t('acceptedTenders.sort.contractorAscShort'),
      desc: t('acceptedTenders.sort.contractorAscDescription')
    },
    {
      value: 'TITLE_ASC',
      label: t('acceptedTenders.sort.titleAsc'),
      shortLabel: t('acceptedTenders.sort.titleAscShort'),
      desc: t('acceptedTenders.sort.titleAscDescription')
    }
  ], [t]);

  // Memoized chips for ActiveFilterChipsBar (MUST be before any early return)
  const activeChips: FilterChipItem[] = useMemo(() => {
    const list: FilterChipItem[] = [];

    if (!selectedCategory.includes('ALL')) {
      selectedCategory.forEach((cat) => {
        list.push({
          id: `category-${cat}`,
          label: t('common.category'),
          value: cat,
          icon: <Tag className="w-3 h-3 text-emerald-600" />,
          color: 'emerald',
          onRemove: () => handleRemoveCategory(cat)
        });
      });
    }

    if (!selectedSource.includes('ALL')) {
      selectedSource.forEach((src) => {
        list.push({
          id: `source-${src}`,
          label: t('common.source'),
          value: src,
          icon: <Globe className="w-3 h-3 text-orange-600" />,
          color: 'orange',
          onRemove: () => handleRemoveSource(src)
        });
      });
    }

    if (!selectedOrg.includes('ALL')) {
      selectedOrg.forEach((org) => {
        list.push({
          id: `org-${org}`,
          label: t('common.organization'),
          value: org,
          icon: <Building2 className="w-3 h-3 text-blue-600" />,
          color: 'blue',
          onRemove: () => handleRemoveOrg(org)
        });
      });
    }

    if (!selectedState.includes('ALL')) {
      selectedState.forEach((st) => {
        list.push({
          id: `state-${st}`,
          label: t('common.state'),
          value: st,
          icon: <MapPin className="w-3 h-3 text-rose-600" />,
          color: 'rose',
          onRemove: () => handleRemoveState(st)
        });
      });
    }

    if (!selectedCity.includes('ALL')) {
      selectedCity.forEach((ct) => {
        list.push({
          id: `city-${ct}`,
          label: t('common.city'),
          value: ct,
          icon: <MapPin className="w-3 h-3 text-amber-600" />,
          color: 'amber',
          onRemove: () => handleRemoveCity(ct)
        });
      });
    }

    if (selectedYear !== 'ALL') {
      list.push({
        id: 'year',
        label: t('common.year'),
        value: `FY ${selectedYear}`,
        icon: <Calendar className="w-3 h-3 text-amber-600" />,
        color: 'amber',
        onRemove: handleRemoveYearChip
      });
    }

    if (sortBy !== 'AWARD_DATE_DESC') {
      const activeOpt = localizedSortOptions.find((o) => o.value === sortBy);
      list.push({
        id: 'sort',
        label: t('common.sort'),
        value: activeOpt?.shortLabel || activeOpt?.label || sortBy,
        icon: <ArrowUpDown className="w-3 h-3 text-emerald-600" />,
        color: 'emerald',
        onRemove: () => setSortBy('AWARD_DATE_DESC')
      });
    }

    if (searchQuery.trim() !== '') {
      list.push({
        id: 'query',
        label: t('common.query'),
        value: `"${searchQuery}"`,
        color: 'slate',
        onRemove: handleRemoveQueryChip
      });
    }

    return list;
  }, [
    selectedCategory,
    selectedSource,
    selectedOrg,
    selectedState,
    selectedCity,
    selectedYear,
    sortBy,
    searchQuery,
    localizedSortOptions,
    t
  ]);

  if (loading && tenders.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 shadow-xs flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t('acceptedTenders.loadingArchive')}</span>
        <span className="text-xs text-slate-400 mt-1">{t('acceptedTenders.retrievingAwarded')}</span>
      </div>
    );
  }

  if (error && tenders.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-red-200 dark:border-red-900/60 p-8 text-center text-red-600 dark:text-red-400 shadow-xs">
        <Award className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <h3 className="text-sm font-bold">{t('acceptedTenders.couldNotLoad')}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{error}</p>
        <button
          onClick={() => loadData()}
          className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          {t('acceptedTenders.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar: Search on LEFT, Filters on RIGHT */}
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <FilterSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t('acceptedTenders.searchPlaceholder')}
            isVoiceSearching={isVoiceSearching}
            toggleVoiceSearch={toggleVoiceSearch}
            accentColor="emerald"
            className="max-w-xl"
          />

          <TopFilterActionBar
            onOpenFilters={handleOpenFilterDrawer}
            activeFiltersCount={activeFiltersCount}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetAllFilters}
            onReload={handleReload}
            isLoading={loading}
            totalCount={totalDbCount || tenders.length}
            reloadLabel={t('common.reload')}
            accentColor="emerald"
            sortControl={
              <ToolbarSortDropdown<AcceptedTenderSortOption>
                value={sortBy}
                onChange={setSortBy}
                options={localizedSortOptions}
                defaultValue="AWARD_DATE_DESC"
                accentColor="emerald"
              />
            }
          />
        </div>

        <ActiveFilterChipsBar
          chips={activeChips}
          onClearAll={resetAllFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Overlapping Filter Drawer (Slides from Right) */}
      <TenderFilterDrawer
        isOpen={isFilterSidebarOpen}
        onClose={handleCloseFilterDrawer}
        title={t('acceptedTenders.filterDrawerTitle')}
        subtitle={t('acceptedTenders.filterDrawerSubtitle')}
        accentColor="emerald"
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        totalFilteredCount={totalDbCount || filteredTenders.length}
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
        extraFilters={
          <>
            {/* Award Financial Year */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t('acceptedTenders.awardYearFiscal')}</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {t('common.yearsCount', { count: availableYears.length })}
                </span>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium">
                  {t('acceptedTenders.allAwardYears', { count: contextForYear.length })}
                </option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white">
                    {t('acceptedTenders.financialYearFormat', { year: yr, count: yearCounts.get(yr) || 0 })}
                  </option>
                ))}
              </select>
            </div>
          </>
        }
      />

      {/* Main Grid: Left Tender List (35%) | Right Deep-Dive Dossier (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[35fr_65fr] gap-5">
        {/* Left Column: Accepted Tenders Catalog (35%) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>{t('acceptedTenders.awardedContracts')}</span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {visibleTenders.length < totalDbCount
                  ? `${visibleTenders.length} ${t('common.of')} ${totalDbCount.toLocaleString('en-IN')}`
                  : `${(totalDbCount || visibleTenders.length).toLocaleString('en-IN')}`}
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
              const sourceLabel = tender._sourceLabel;
              // Trigger next batch when the 2nd-to-last card comes into view
              const secondLastIndex = visibleTenders.length >= 2 ? visibleTenders.length - 2 : 0;
              const isSecondLast = hasMoreToRender && index === secondLastIndex;

              return (
                <div
                  key={tender.id}
                  ref={isSecondLast ? secondLastCardRef : undefined}
                  onClick={() => handleSelectTenderCard(tender)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all text-xs relative hover:z-20 ${
                    isSelected
                      ? 'bg-white dark:bg-[#131A2B] border-emerald-500 shadow-md ring-1 ring-emerald-500 z-10'
                      : 'bg-white dark:bg-[#0E1422] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {t('acceptedTenders.awardedL1')}
                      </span>
                      {tender.year && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                          {tender.year}
                        </span>
                      )}
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 break-words"
                        title={tender._source}
                      >
                        {sourceLabel}
                      </span>
                    </div>

                    {/* Award Date with Explanatory Tooltip */}
                    <div className="relative group/date shrink-0">
                      <div
                        className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 cursor-help hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-0.5 px-1 rounded hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40"
                      >
                        <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover/date:text-emerald-500" />
                        <span className="border-b border-dotted border-slate-300 dark:border-slate-700 group-hover/date:border-emerald-500">
                          {formatDate(tender.award_date)}
                        </span>
                      </div>

                      {/* Floating Tooltip Card */}
                      <div
                        role="tooltip"
                        className="absolute right-0 top-full mt-1.5 w-64 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-slate-700/90 backdrop-blur-md opacity-0 invisible group-hover/date:opacity-100 group-hover/date:visible transition-all duration-200 pointer-events-none z-50 text-[10px]"
                      >
                        {/* Header */}
                        <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-bold text-xs text-white">
                            {t('acceptedTenders.contractAwardDate')}
                          </span>
                        </div>

                        {/* Explanation of what the date is for */}
                        <p className="text-slate-300 leading-relaxed">
                          {t('acceptedTenders.contractAwardDateDesc')}
                        </p>

                        {/* Key Timestamps / Info */}
                        <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 font-mono text-[10px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">{t('acceptedTenders.loaAwardDate')}</span>
                            <span className="text-emerald-300 font-bold">{formatDate(tender.award_date)}</span>
                          </div>
                          {tender.year && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">{t('acceptedTenders.fiscalPeriod')}</span>
                              <span className="text-slate-200 font-semibold">FY {tender.year}</span>
                            </div>
                          )}
                          {tender.winning_company?.name && (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-400 shrink-0">{t('acceptedTenders.awardeeL1')}</span>
                              <span className="text-slate-200 truncate font-semibold" title={tender.winning_company.name}>
                                {tender.winning_company.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Little top arrow */}
                        <div className="absolute right-4 -top-1 w-2 h-2 bg-slate-900/95 dark:bg-slate-950/95 border-l border-t border-slate-700/90 transform rotate-45" />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug break-words mb-1.5">
                    {tender.title}
                  </h3>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="break-words">{tender.og_tender?.authority}</span>
                  </div>

                  {/* Location badge (State & City) */}
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/40 px-2 py-0.5 rounded-md text-[10px]">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{tender._state}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-rose-700 dark:text-rose-400 font-medium">{tender._city}</span>
                    </span>
                  </div>

                  {/* Winning Bidder Pill */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2 border border-slate-100 dark:border-slate-700/60 mb-2.5">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">{t('acceptedTenders.winningContractor')}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 break-words text-[11px]">
                      {tender.winning_company?.name}
                    </div>
                  </div>

                  {/* Financial Metrics Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('acceptedTenders.awardValue')}</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                        {formatINR(tender.bid_submission?.quoted_amount_inr)}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">{t('acceptedTenders.estimated')}</span>
                      <span className="text-slate-600 dark:text-slate-400 line-through font-mono">
                        {formatINR(tender.og_tender?.estimated_cost_inr)}
                      </span>
                      <span className="ml-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        (-{tender.bid_submission?.quoted_discount_pct}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Infinite Scroll Loading Indicator */}
            {isLoadingMore && (
              <div
                className="py-3 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 my-1"
              >
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {t('acceptedTenders.loadingNext12')}
                </span>
              </div>
            )}

            {!hasMoreToRender && filteredTenders.length > 0 && (
              <div className="py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium border-t border-slate-100 dark:border-slate-800">
                {t('acceptedTenders.showingAllContracts', { count: filteredTenders.length.toLocaleString('en-IN') })}
              </div>
            )}

            {filteredTenders.length === 0 && (
              <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
                <p>{t('acceptedTenders.noAcceptedTendersMatching')}</p>
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                >
                  {t('common.resetAll')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep-Dive Dossier for Selected Tender (65%) */}
        <div ref={dossierRef} className="space-y-4">
          {!selectedTender || filteredTenders.length === 0 ? (
            <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 shadow-xs">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('acceptedTenders.noMatchingAcceptedFound')}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4">
                {t('acceptedTenders.noMatchingAcceptedDesc')}
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {t('common.resetAll')}
              </button>
            </div>
          ) : (
            <>
              {/* Active Dossier Header */}
              <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {t('acceptedTenders.l1WinningProposal')}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                        {t('acceptedTenders.loa')} {selectedTender.acceptance_and_loa?.loa_number}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {selectedTender.title}
                    </h3>
                  </div>

                  {/* View/Download Official ReportLab Dossier PDF */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={pdfUrl}
                      download={`${selectedTender.id}_awarded_dossier.pdf`}
                      className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all"
                      title="Download Official In-Memory Generated PDF Dossier"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{t('acceptedTenders.downloadDossierPdf')}</span>
                    </a>
                  </div>
                </div>

                {/* Quick Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-1 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('acceptedTenders.awardedTo')}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 break-words block" title={selectedTender.winning_company?.name}>
                      {selectedTender.winning_company?.name}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('acceptedTenders.quotedL1Bid')}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block font-mono">
                      {formatINR(selectedTender.bid_submission?.quoted_amount_inr)}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('acceptedTenders.l1Discount')}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block flex items-center gap-1 font-mono">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {t('acceptedTenders.belowEstimate', { pct: selectedTender.bid_submission?.quoted_discount_pct })}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('acceptedTenders.emdInstrument')}</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400 block break-words" title={selectedTender.bid_submission?.emd_mode}>
                      {selectedTender.bid_submission?.emd_mode}
                    </span>
                  </div>
                </div>

                {/* Dossier Sub-Tab Navigation */}
                <div className="flex overflow-x-auto pb-1 no-scrollbar sm:flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setActiveSubTab('comparison')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'comparison'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('acceptedTenders.subtabs.tab1')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('company')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'company'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{t('acceptedTenders.subtabs.tab2')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('covers')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'covers'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <FolderLock className="w-3.5 h-3.5" />
                    <span>{t('acceptedTenders.subtabs.tab3')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('pqc')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'pqc'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t('acceptedTenders.subtabs.tab4')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('boq')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'boq'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('acceptedTenders.subtabs.tab5')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('compliance')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'compliance'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t('acceptedTenders.subtabs.tab6')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('milestones')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'milestones'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span>{t('acceptedTenders.subtabs.tab7')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('loa')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'loa'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Stamp className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t('acceptedTenders.subtabs.tab8')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('pdf')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'pdf'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{t('acceptedTenders.subtabs.tab9')}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('all_bids')}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'all_bids'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t('acceptedTenders.subtabs.tab10')}</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: OG Tender vs Winning Bid Comparison */}
              {activeSubTab === 'comparison' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t('acceptedTenders.dossier.comparativeAuditTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('acceptedTenders.dossier.comparativeAuditDesc')}
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-[#131A2B] text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">{t('acceptedTenders.dossier.evalParam')}</th>
                          <th className="py-2.5 px-3 w-1/3">{t('acceptedTenders.dossier.nitCondition')}</th>
                          <th className="py-2.5 px-3 w-1/3">{t('acceptedTenders.dossier.submittedByWinner')}</th>
                          <th className="py-2.5 px-3 text-center">{t('acceptedTenders.dossier.verdict')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{t('acceptedTenders.dossier.totalPrice')}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {t('acceptedTenders.estimated')}: {formatINR(selectedTender.og_tender?.estimated_cost_inr)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {formatINR(selectedTender.bid_submission?.quoted_amount_inr)} (-{selectedTender.bid_submission?.quoted_discount_pct}%)
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              {t('acceptedTenders.dossier.l1Lowest')}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{t('acceptedTenders.dossier.emd')}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            ₹ {(selectedTender.og_tender?.emd_amount_inr || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedTender.bid_submission?.emd_mode}:</span>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedTender.bid_submission?.emd_reference}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              {t('acceptedTenders.dossier.accepted')}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{t('acceptedTenders.dossier.annualTurnover')}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            Min 40%: {formatINR(selectedTender.og_tender?.min_turnover_inr)}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                              {formatINR(selectedTender.winning_company?.audited_turnover_inr)}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              CA UDIN: {selectedTender.winning_company?.ca_udin}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              {t('acceptedTenders.dossier.surpasses')}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{t('acceptedTenders.dossier.bankSolvency')}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            Min 40%: {formatINR(selectedTender.og_tender?.min_solvency_inr)}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                              {formatINR(selectedTender.winning_company?.solvency_certificate_inr)}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {selectedTender.winning_company?.solvency_bank}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              {t('acceptedTenders.dossier.qualified')}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{t('acceptedTenders.dossier.similarWork')}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            {selectedTender.og_tender?.similar_work_criteria}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            {t('acceptedTenders.dossier.similarWorkDesc')}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              {t('acceptedTenders.dossier.verified')}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{t('acceptedTenders.dossier.makeInIndiaLocal')}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            Class-I Local Supplier (Minimum 50% Domestic Value Addition)
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTender.winning_company?.local_content_class}</span>
                            <div>Declared: <strong>{selectedTender.winning_company?.local_content_pct}%</strong> Local Content</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              {t('acceptedTenders.dossier.compliant')}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Winning Company Profile */}
              {activeSubTab === 'company' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t('acceptedTenders.dossier.companyProfileTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('acceptedTenders.dossier.companyProfileDesc')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.legalName')}</span>
                      <strong className="text-slate-900 dark:text-slate-100 text-xs">{selectedTender.winning_company?.name}</strong>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">{selectedTender.winning_company?.business_type}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.cin')}</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{selectedTender.winning_company?.cin}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 md:col-span-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.registeredOffice')}</span>
                      <span className="text-slate-700 dark:text-slate-300">{selectedTender.winning_company?.registered_office}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.taxIdentifiers')}</span>
                      <div className="font-mono text-slate-800 dark:text-slate-200">GSTIN: {selectedTender.winning_company?.gstin}</div>
                      <div className="font-mono text-slate-800 dark:text-slate-200">PAN: {selectedTender.winning_company?.pan}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.msmeCategory')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTender.winning_company?.msme_status}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.threeYrTurnover')}</span>
                      <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                        {formatINR(selectedTender.winning_company?.audited_turnover_inr)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">CA UDIN: {selectedTender.winning_company?.ca_udin}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.solvencyBacking')}</span>
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {formatINR(selectedTender.winning_company?.solvency_certificate_inr)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedTender.winning_company?.solvency_bank}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 md:col-span-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('acceptedTenders.dossier.keyProjectLead')}</span>
                      <div className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>{selectedTender.winning_company?.project_lead}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Filled 3-Cover Bid Dossier */}
              {activeSubTab === 'covers' && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs transition-colors">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <FolderLock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t('acceptedTenders.dossier.coversTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      {t('acceptedTenders.dossier.coversDesc')}
                    </p>

                    <div className="space-y-3.5">
                      {/* Cover 1 */}
                      <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 overflow-hidden">
                        <div className="bg-amber-100/80 dark:bg-amber-950/50 px-4 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
                          <span>{selectedTender.bid_submission?.cover_1?.name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">{t('acceptedTenders.dossier.feeEmd')}</span>
                        </div>
                        <div className="p-3.5">
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {selectedTender.bid_submission?.cover_1?.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{renderBulletPoint(item)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cover 2 */}
                      <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/40 overflow-hidden">
                        <div className="bg-blue-100/80 dark:bg-blue-950/50 px-4 py-2 text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                          <span>{selectedTender.bid_submission?.cover_2?.name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">{t('acceptedTenders.dossier.techPq')}</span>
                        </div>
                        <div className="p-3.5">
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {selectedTender.bid_submission?.cover_2?.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{renderBulletPoint(item)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cover 3 */}
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40 overflow-hidden">
                        <div className="bg-emerald-100/80 dark:bg-emerald-950/50 px-4 py-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                          <span>{selectedTender.bid_submission?.cover_3?.name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">{t('acceptedTenders.dossier.finBoq')}</span>
                        </div>
                        <div className="p-3.5">
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {selectedTender.bid_submission?.cover_3?.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{renderBulletPoint(item)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Technical PQC & Machinery */}
              {activeSubTab === 'pqc' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      {t('acceptedTenders.dossier.pqcTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('acceptedTenders.dossier.pqcDesc')}
                    </p>
                  </div>

                  {/* 3-2-1 Experience Formula Grid */}
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 p-4">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider block mb-2">
                      {t('acceptedTenders.dossier.formulaVerification')}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white dark:bg-[#141C2E] p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block">{t('acceptedTenders.dossier.conditionA')}</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                          ≥ {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) * 0.4)}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">{t('acceptedTenders.dossier.conditionADesc')}</span>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded">
                          {t('acceptedTenders.dossier.verifiedApproved')}
                        </span>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block">{t('acceptedTenders.dossier.conditionB')}</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                          ≥ {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) * 0.5)}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">{t('acceptedTenders.dossier.conditionBDesc')}</span>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded">
                          {t('acceptedTenders.dossier.verifiedApproved')}
                        </span>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block">{t('acceptedTenders.dossier.conditionC')}</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                          ≥ {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) * 0.8)}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">{t('acceptedTenders.dossier.conditionCDesc')}</span>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded">
                          {t('acceptedTenders.dossier.exceedsCriteria')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plant & Machinery Deployment Undertaking */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      {t('acceptedTenders.dossier.machineryTitle')}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { name: "Electronic Hydrostatic Sensor Pavers (9.0m screed)", qty: "2 Nos. Minimum", status: "Owned & Mobilized", cap: "600 TPH" },
                        { name: "Fully Automated Wet Mix Concrete Batching Plant", qty: "1 Unit On-Site", status: "Dedicated Setup", cap: "60 m³/hr" },
                        { name: "Heavy Vibratory Soil Compactors & Tandem Rollers", qty: "4 Nos. Fleet", status: "Owned Fleet", cap: "12 Ton Class" },
                        { name: "Mobile Primary & Secondary Aggregate Crushing Plant", qty: "1 Complex", status: "Leased / Pledged", cap: "200 TPH" },
                        { name: "Heavy Hydraulic Excavators & Front-End Loaders", qty: "6 Units", status: "Owned Fleet", cap: "1.2 m³ Bucket" },
                        { name: "NABL-Accredited Field Material Testing Laboratory", qty: "1 Site Lab", status: "Established at KM 0", cap: "IS / MORTH Standard" }
                      ].map((mach, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 block leading-tight">{mach.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Specs: {mach.cap} • Min Req: {mach.qty}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                            {mach.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Personnel & Technical Staff */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      {t('acceptedTenders.dossier.manpowerTitle')}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white dark:bg-[#141C2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Project Director / Head</span>
                        <strong className="text-slate-900 dark:text-slate-100">{selectedTender.winning_company?.project_lead}</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">25+ Years Experience • B.Tech Civil (NICMAR)</span>
                      </div>
                      <div className="bg-white dark:bg-[#141C2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Chief Quality & Materials Lead</span>
                        <strong className="text-slate-900 dark:text-slate-100">Er. Rameshwar Patil (Senior Materials Engr)</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">18 Years Highway Quality Audit • Certified NABL Auditor</span>
                      </div>
                      <div className="bg-white dark:bg-[#141C2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Structural Bridge / RCC Specialist</span>
                        <strong className="text-slate-900 dark:text-slate-100">Er. S. N. Bannerjee (Chief Structural Lead)</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">20 Years Major Flyovers & Box Culvert Construction</span>
                      </div>
                      <div className="bg-white dark:bg-[#141C2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">HSE & Environmental Officer</span>
                        <strong className="text-slate-900 dark:text-slate-100">Er. Ajay Deshmukh (Safety Lead)</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Certified NEBOSH & ISO 45001 Compliance Officer</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 5: Financial BOQ Analysis */}
              {activeSubTab === 'boq' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t('acceptedTenders.dossier.boqTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('acceptedTenders.dossier.boqDesc')}
                    </p>
                  </div>

                  {/* Summary Comparison vs Estimate */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('acceptedTenders.dossier.deptEstimate')}</span>
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {formatINR(selectedTender.og_tender?.estimated_cost_inr)}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{t('acceptedTenders.dossier.basedOnDsr')}</span>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      <span className="text-[10px] uppercase font-semibold text-emerald-700 dark:text-emerald-300">{t('acceptedTenders.dossier.contractorL1Bid')}</span>
                      <div className="font-mono font-bold text-emerald-800 dark:text-emerald-200 text-sm mt-0.5">
                        {formatINR(selectedTender.bid_submission?.quoted_amount_inr)}
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                        {t('acceptedTenders.dossier.belowDeptEstimate', { pct: selectedTender.bid_submission?.quoted_discount_pct })}
                      </span>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <span className="text-[10px] uppercase font-semibold text-blue-700 dark:text-blue-300">{t('acceptedTenders.dossier.netSavings')}</span>
                      <div className="font-mono font-bold text-blue-900 dark:text-blue-200 text-sm mt-0.5">
                        {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) - (selectedTender.bid_submission?.quoted_amount_inr || 0))}
                      </div>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400">{t('acceptedTenders.dossier.savedToTreasury')}</span>
                    </div>
                  </div>

                  {/* Itemized BOQ Schedule Table */}
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-[#131A2B] text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">{t('acceptedTenders.dossier.itemNo')}</th>
                          <th className="py-2.5 px-3">{t('acceptedTenders.dossier.itemDesc')}</th>
                          <th className="py-2.5 px-3 text-right">{t('acceptedTenders.dossier.estShare')}</th>
                          <th className="py-2.5 px-3 text-right">{t('acceptedTenders.dossier.quotedShare')}</th>
                          <th className="py-2.5 px-3 text-center">{t('acceptedTenders.dossier.pricingStrategy')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {[
                          { no: "1.0", desc: "Site Clearance, Earthwork in Excavation, Embankment & Subgrade", est: "9.5%", quot: "9.1%", note: "Competitive local borrowing" },
                          { no: "2.0", desc: "Granular Sub-Base (GSB) & Wet Mix Macadam (WMM) Base Course", est: "21.0%", quot: "20.2%", note: "Dedicated captive quarry tie-up" },
                          { no: "3.0", desc: "Dense Bituminous Macadam (DBM) & Bituminous Concrete (BC) Paving", est: "38.5%", quot: "36.8%", note: "High-capacity automated paver efficiency" },
                          { no: "4.0", desc: "RCC Box Culverts, Retaining Walls, Longitudinal Drainage & Structures", est: "19.0%", quot: "18.5%", note: "Precast segmental element adoption" },
                          { no: "5.0", desc: "Traffic Safety, Signboards, Thermoplastic Markings & Crash Barriers", est: "6.5%", quot: "6.2%", note: "Compliant IRC standards" },
                          { no: "6.0", desc: "Quality Control, Lab Testing, Environmental Mitigation & Demobilization", est: "5.5%", quot: "5.4%", note: "Full safety & environmental compliance" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">{row.no}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{row.desc}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{row.est}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">{row.quot}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {row.note}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Competitive Bid Matrix (L1 vs L2 vs L3) */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2">
                      {t('acceptedTenders.dossier.competitiveMatrix')}
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">{t('acceptedTenders.dossier.l1Winner')}</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTender.winning_company?.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
                            {formatINR(selectedTender.bid_submission?.quoted_amount_inr)}
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold ml-1.5">
                            (-{selectedTender.bid_submission?.quoted_discount_pct}%)
                          </span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{t('acceptedTenders.dossier.l2Bidder')}</span>
                          <span>Afcons Infrastructure / Larsen & Toubro Consortium</span>
                        </div>
                        <div className="text-right font-mono">
                          <span>{formatINR((selectedTender.bid_submission?.quoted_amount_inr || 0) * 1.026)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">{t('acceptedTenders.dossier.overL1', { pct: 2.6 })}</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{t('acceptedTenders.dossier.l3Bidder')}</span>
                          <span>NCC Limited / Dilip Buildcon JV</span>
                        </div>
                        <div className="text-right font-mono">
                          <span>{formatINR((selectedTender.bid_submission?.quoted_amount_inr || 0) * 1.054)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">{t('acceptedTenders.dossier.overL1', { pct: 5.4 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 6: Make in India & Legal Affidavits */}
              {activeSubTab === 'compliance' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      {t('acceptedTenders.dossier.legalTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('acceptedTenders.dossier.legalDesc')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Make in India PPO Card */}
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Make in India Order 2017</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">CLASS-I SUPPLIER</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        Declared Local Domestic Content: <strong>{selectedTender.winning_company?.local_content_pct}%</strong>
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Conforms to Ministry of Commerce & Industry (DPIIT) Public Procurement Order. All cement, steel, bituminous mixes, and structural assemblies sourced from domestic producers.
                      </p>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-emerald-200 dark:border-emerald-800/50">
                        Statutory Auditor Certification: Verified & Signed
                      </div>
                    </div>

                    {/* CVC Integrity Pact Card */}
                    <div className="bg-blue-50/70 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">CVC Integrity Pact</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">SIGNED & RATIFIED</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        Central Vigilance Commission Anti-Corruption Accord
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Pre-contract Integrity Pact signed between {selectedTender.winning_company?.name} and {selectedTender.og_tender?.authority}. Monitored by Independent External Monitor (IEM).
                      </p>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-blue-200 dark:border-blue-800/50">
                        IEM Sign-off: Zero complaints or bid irregularities noted.
                      </div>
                    </div>

                    {/* Tax & GST Standing Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Tax Authorities & Filings</span>
                      <div className="font-mono text-slate-900 dark:text-slate-100 font-bold">
                        GSTIN: {selectedTender.winning_company?.gstin}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Up-to-date monthly GSTR-1 and GSTR-3B filings verified on GST Portal. No pending tax recoveries or attachment notices from Central Board of Indirect Taxes (CBIC).
                      </p>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-slate-200 dark:border-slate-700/60">
                        PAN: {selectedTender.winning_company?.pan} (Income Tax Dept Cleared)
                      </div>
                    </div>

                    {/* Sworn Non-Blacklisting Affidavit Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Judicial Non-Blacklisting Affidavit</span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        Non-Debarment Oath on ₹ 100 Stamp Paper
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Sworn affidavit affirming that {selectedTender.winning_company?.name} has never been blacklisted, debarred or disqualified by CPWD, NHAI, Railways, State PWDs or any multilateral donor agency (World Bank/ADB).
                      </p>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-slate-200 dark:border-slate-700/60">
                        Attested by: Notary Public & Commissioner of Oaths
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 7: Milestones & Payment Terms */}
              {activeSubTab === 'milestones' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      {t('acceptedTenders.dossier.milestonesTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('acceptedTenders.dossier.milestonesDesc')}
                    </p>
                  </div>

                  {/* Stage-by-Stage Construction Milestones */}
                  <div className="space-y-3">
                    {[
                      {
                        stage: "Milestone 1",
                        time: "Months 1–4",
                        progress: "15% Cumulative",
                        title: "Mobilization, Site Surveys & Geo-Investigation",
                        desc: "Establishment of site office, QA lab setup, initial topographical survey, tree transplantation permits, utility shifting, and joint approval of concrete & bituminous mix designs.",
                        financial_release: "Mobilization Advance Recovery starts (10% max)"
                      },
                      {
                        stage: "Milestone 2",
                        time: "Months 5–9",
                        progress: "35% Cumulative",
                        title: "Subgrade, Drainage Culverts & Granular Sub-Base",
                        desc: "Completion of all earthwork in embankment, subgrade compaction to 98% MDD, construction of RCC pipe culverts and slab culverts, and laying of 200mm Granular Sub-Base (GSB).",
                        financial_release: "Interim Running Account Bill clearance against measurement"
                      },
                      {
                        stage: "Milestone 3",
                        time: "Months 10–14",
                        progress: "70% Cumulative",
                        title: "Base Courses & Bituminous / Concrete Pavement",
                        desc: "Laying of 250mm Wet Mix Macadam (WMM), prime coat application, and paving of Dense Bituminous Macadam (DBM) / Pavement Quality Concrete (PQC) using automatic sensor pavers.",
                        financial_release: "Release of 70% cumulative verified bill value"
                      },
                      {
                        stage: "Milestone 4",
                        time: `Months 15–${selectedTender.og_tender?.completion_months || 18}`,
                        progress: "100% Substantial Completion",
                        title: "Wearing Surface, Road Safety & Statutory Handover",
                        desc: "Bituminous Concrete (BC) wearing course, thermoplastic lane markings, retro-reflective signages, metal beam crash barriers, street lighting, snag checklist rectification, and joint commissioning.",
                        financial_release: "Final Bill preparation & 50% retention money refund"
                      }
                    ].map((m, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                              {m.stage}
                            </span>
                            <strong className="text-slate-900 dark:text-slate-100 text-xs">{m.title}</strong>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-mono">{m.time}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                              {m.progress}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{m.desc}</p>
                        <div className="text-[10px] text-purple-800 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded border border-purple-100 dark:border-purple-800/40 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>Financial Milestone Trigger: {m.financial_release}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contract Protection & Security Clauses */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('acceptedTenders.dossier.pbg')}</span>
                      <strong className="text-slate-900 dark:text-slate-100 block mt-0.5">5% of Contract Value</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Submitted within 14 days of LOA, valid up to DLP completion + 60 days.</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('acceptedTenders.dossier.dlp')}</span>
                      <strong className="text-slate-900 dark:text-slate-100 block mt-0.5">36 to 60 Months Guarantee</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Free maintenance of riding quality, culvert settlement, and road safety furniture.</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('acceptedTenders.dossier.ld')}</span>
                      <strong className="text-slate-900 dark:text-slate-100 block mt-0.5">0.5% per Week (Max 10%)</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Statutory delay compensation levied for unauthorized extension of time.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 8: LOA & Committee Verdict */}
              {activeSubTab === 'loa' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Stamp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t('acceptedTenders.dossier.loaMinutesTitle')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('acceptedTenders.dossier.loaMinutesDesc')}
                    </p>
                  </div>

                  {/* LOA Certificate Frame */}
                  <div className="bg-slate-50 dark:bg-[#080C14] border-2 border-slate-300 dark:border-slate-700 rounded-xl p-5 relative">
                    {/* Official Stamp Watermark */}
                    <div className="absolute right-6 top-6 border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 rounded text-xs uppercase tracking-widest rotate-6 bg-white/90 dark:bg-slate-900/90 shadow-2xs">
                      {t('acceptedTenders.dossier.awardedAccepted')}
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('acceptedTenders.dossier.loaNumber')}</span>
                          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                            {selectedTender.acceptance_and_loa?.loa_number}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('acceptedTenders.dossier.issuanceDate')}</span>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(selectedTender.acceptance_and_loa?.loa_date)}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('acceptedTenders.dossier.awardingAuthority')}</span>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{selectedTender.acceptance_and_loa?.awarding_authority}</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('acceptedTenders.dossier.contractAgreementExecution')}</span>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{formatDate(selectedTender.acceptance_and_loa?.contract_agreement_date)}</div>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/60 mt-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                          {t('acceptedTenders.dossier.committeeFindingsRec')}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                          "{selectedTender.acceptance_and_loa?.committee_verdict}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 5: Live PDF Document Preview */}
              {activeSubTab === 'pdf' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        {t('acceptedTenders.dossier.officialPdfTitle')}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {t('acceptedTenders.dossier.officialPdfDesc')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={pdfUrl}
                        download={`${selectedTender.id}_awarded_dossier.pdf`}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('acceptedTenders.dossier.downloadPdf')}</span>
                      </a>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('acceptedTenders.dossier.openNewWindow')}</span>
                      </a>
                    </div>
                  </div>

                  {/* PDF Preview Frame */}
                  <div className="w-full h-[620px] rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-inner">
                    <iframe
                      src={pdfUrl}
                      title={t('acceptedTenders.dossier.pdfPreviewTitle')}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Sub-tab 10: Form 49 Comparative Bid Evaluation Statement (L1, L2, L3, L4, L5) */}
              {activeSubTab === 'all_bids' && (
                <AllBidsEvaluationSubTab tender={selectedTender} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
