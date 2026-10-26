import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Search,
  ChevronRight,
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
  X
} from 'lucide-react';
import {
  FilterSearchBar,
  TopFilterActionBar,
  ActiveFilterChipsBar,
  TenderFilterDrawer,
  FilterChipItem
} from './common';
import {
  AcceptedTender,
  listAcceptedTenders,
  getAcceptedTenderPdfUrl
} from '../services/api';
import { AllBidsEvaluationSubTab } from './AcceptedTenders/AllBidsEvaluationSubTab';
import {
  ALL_CANONICAL_CATEGORIES,
  canonicalizeCategory,
  ALL_STATUTORY_PORTAL_SOURCES,
  canonicalizePortalSource
} from '../constants';

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

interface EnrichedAcceptedTender extends AcceptedTender {
  _source: string;
  _sourceLabel: string;
  _category: string;
  _org: string;
  _state: string;
  _city: string;
  _searchBlob: string;
}

export const PreviouslyAcceptedTendersTab: React.FC = () => {
  const [tenders, setTenders] = useState<EnrichedAcceptedTender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<
    'comparison' | 'company' | 'covers' | 'pqc' | 'boq' | 'compliance' | 'milestones' | 'loa' | 'pdf' | 'all_bids'
  >('comparison');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedOrg, setSelectedOrg] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [isVoiceSearching, setIsVoiceSearching] = useState<boolean>(false);
  const voiceSearchRef = useRef<any>(null);
  const dossierRef = useRef<HTMLDivElement>(null);

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
    listAcceptedTenders()
      .then((data) => {
        const enriched: EnrichedAcceptedTender[] = data.map((t) => {
          const source = getTenderSource(t);
          const sourceLabel = source.split('(')[0].trim();
          const category = canonicalizeCategory(t.category, t.title, t.og_tender?.scope_summary);
          const org = getTenderOrg(t);
          const state = getTenderState(t);
          const city = getTenderCity(t);
          const searchBlob = `${t.title} ${t.winning_company?.name || ''} ${t.og_tender?.authority || ''} ${t.og_tender?.nit_number || ''} ${source} ${category} ${org} ${state} ${city}`.toLowerCase();
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
        if (enriched.length > 0 && !selectedTenderId) {
          setSelectedTenderId(enriched[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load accepted tenders');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatINR = (val?: number) => {
    if (!val) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const query = searchQuery.toLowerCase().trim();

  // Faceted matcher for historical accepted bids
  const matchesFilter = useCallback(
    (t: EnrichedAcceptedTender, excludeDimension?: string) => {
      if (query && !t._searchBlob.includes(query)) return false;

      if (excludeDimension !== 'category' && selectedCategory !== 'ALL' && t._category !== selectedCategory) {
        return false;
      }
      if (excludeDimension !== 'source' && selectedSource !== 'ALL' && t._source !== selectedSource) {
        return false;
      }
      if (excludeDimension !== 'org' && selectedOrg !== 'ALL' && t._org !== selectedOrg) {
        return false;
      }
      if (excludeDimension !== 'state' && selectedState !== 'ALL' && t._state !== selectedState) {
        return false;
      }
      if (excludeDimension !== 'city' && selectedCity !== 'ALL' && t._city !== selectedCity) {
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
    if (selectedCategory !== 'ALL') {
      set.add(selectedCategory);
    }
    return Array.from(set).sort();
  }, [tenders, selectedCategory]);

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
    if (selectedSource !== 'ALL') {
      set.add(selectedSource);
    }
    return Array.from(set).sort();
  }, [tenders, selectedSource]);

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
    const list = Array.from(orgCounts.keys()).sort();
    if (selectedOrg !== 'ALL' && !list.includes(selectedOrg)) {
      list.push(selectedOrg);
      list.sort();
    }
    return list;
  }, [orgCounts, selectedOrg]);

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
    const list = Array.from(stateCounts.keys()).sort();
    if (selectedState !== 'ALL' && !list.includes(selectedState)) {
      list.push(selectedState);
      list.sort();
    }
    return list;
  }, [stateCounts, selectedState]);

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
    const list = Array.from(cityCounts.keys()).sort();
    if (selectedCity !== 'ALL' && !list.includes(selectedCity)) {
      list.push(selectedCity);
      list.sort();
    }
    return list;
  }, [cityCounts, selectedCity]);

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
    const list = Array.from(yearCounts.keys()).sort().reverse();
    if (selectedYear !== 'ALL' && !list.includes(selectedYear)) {
      list.push(selectedYear);
      list.sort().reverse();
    }
    return list;
  }, [yearCounts, selectedYear]);

  // Final filtered tenders intersection
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => matchesFilter(t));
  }, [tenders, matchesFilter]);

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
    selectedCategory !== 'ALL' ||
    selectedSource !== 'ALL' ||
    selectedOrg !== 'ALL' ||
    selectedState !== 'ALL' ||
    selectedCity !== 'ALL' ||
    selectedYear !== 'ALL' ||
    searchQuery.trim() !== '';

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'ALL') count++;
    if (selectedSource !== 'ALL') count++;
    if (selectedOrg !== 'ALL') count++;
    if (selectedState !== 'ALL') count++;
    if (selectedCity !== 'ALL') count++;
    if (selectedYear !== 'ALL') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedCategory, selectedSource, selectedOrg, selectedState, selectedCity, selectedYear, searchQuery]);

  const resetAllFilters = () => {
    setSelectedCategory('ALL');
    setSelectedSource('ALL');
    setSelectedOrg('ALL');
    setSelectedState('ALL');
    setSelectedCity('ALL');
    setSelectedYear('ALL');
    setSearchQuery('');
  };

  const totalContractValCr = useMemo(() => {
    return (
      filteredTenders.reduce((acc, t) => acc + (t.bid_submission?.quoted_amount_inr || 0), 0) / 10000000
    ).toFixed(1);
  }, [filteredTenders]);

  const pdfUrl = useMemo(() => {
    return selectedTender ? getAcceptedTenderPdfUrl(selectedTender.id) : '';
  }, [selectedTender?.id]);

  // Infinite scrolling state & handlers
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
  }, [selectedCategory, selectedSource, selectedOrg, selectedState, selectedCity, selectedYear, searchQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { root: listContainerRef.current, threshold: 0.1, rootMargin: '100px' }
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

  // Memoized chips for ActiveFilterChipsBar (MUST be before any early return)
  const activeChips: FilterChipItem[] = useMemo(() => {
    const list: FilterChipItem[] = [];

    if (selectedCategory !== 'ALL') {
      list.push({
        id: 'category',
        label: 'Category',
        value: selectedCategory,
        icon: <Tag className="w-3 h-3 text-emerald-600" />,
        color: 'emerald',
        onRemove: () => setSelectedCategory('ALL')
      });
    }

    if (selectedSource !== 'ALL') {
      list.push({
        id: 'source',
        label: 'Source',
        value: selectedSource,
        icon: <Globe className="w-3 h-3 text-orange-600" />,
        color: 'orange',
        onRemove: () => setSelectedSource('ALL')
      });
    }

    if (selectedOrg !== 'ALL') {
      list.push({
        id: 'org',
        label: 'Org',
        value: selectedOrg,
        icon: <Building2 className="w-3 h-3 text-blue-600" />,
        color: 'blue',
        onRemove: () => setSelectedOrg('ALL')
      });
    }

    if (selectedState !== 'ALL') {
      list.push({
        id: 'state',
        label: 'State',
        value: selectedState,
        icon: <MapPin className="w-3 h-3 text-rose-600" />,
        color: 'rose',
        onRemove: () => {
          setSelectedState('ALL');
          setSelectedCity('ALL');
        }
      });
    }

    if (selectedCity !== 'ALL') {
      list.push({
        id: 'city',
        label: 'City',
        value: selectedCity,
        icon: <MapPin className="w-3 h-3 text-amber-600" />,
        color: 'amber',
        onRemove: () => setSelectedCity('ALL')
      });
    }

    if (selectedYear !== 'ALL') {
      list.push({
        id: 'year',
        label: 'Year',
        value: `FY ${selectedYear}`,
        icon: <Calendar className="w-3 h-3 text-amber-600" />,
        color: 'amber',
        onRemove: () => setSelectedYear('ALL')
      });
    }

    if (searchQuery.trim() !== '') {
      list.push({
        id: 'query',
        label: 'Query',
        value: `"${searchQuery}"`,
        color: 'slate',
        onRemove: () => setSearchQuery('')
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
    searchQuery
  ]);

  if (loading && tenders.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 shadow-xs flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-semibold text-slate-800">Loading Historical Accepted Bids Archive...</span>
        <span className="text-xs text-slate-400 mt-1">Retrieving 843 awarded Indian public procurement tenders, submissions & LOA orders</span>
      </div>
    );
  }

  if (error && tenders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center text-red-600 shadow-xs">
        <Award className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <h3 className="text-sm font-bold">Could not load accepted tenders archive</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <button
          onClick={loadData}
          className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Archive Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-xl p-5 shadow-sm border border-emerald-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-xs">
                <Award className="w-3.5 h-3.5" />
                Winning Bids & Awarded Proposals
              </span>
              <span className="text-xs text-emerald-400 font-mono">
                Indian Public Procurement Records
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Previously Filled & Accepted Tenders Archive (17-Year Historical Records: 2010 – 2026)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Explore how winning contractors (L&T, Tata Projects, Afcons, Navayuga, Shapoorji Pallonji, Dilip Buildcon, Ashoka Buildcon, J. Kumar, B.G. Shirke, T&T Infra, NCC, GR Infra) structured their 3-cover submissions, satisfied turnover & 3-2-1 work formulas, and secured official Letters of Acceptance (LOA).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-lg text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Sourced Portals</span>
              <span className="text-base font-bold text-sky-400">
                {availableSources.length} Sources
              </span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-lg text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                {hasActiveFilters ? 'Matching Bids' : 'Total Awarded Bids'}
              </span>
              <span className="text-base font-bold text-emerald-400">
                {filteredTenders.length} {hasActiveFilters ? 'Found' : 'Records'}
              </span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-lg text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Awarded Value</span>
              <span className="text-base font-bold text-orange-400">₹ {totalContractValCr} Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Filter and Search Bar: Search on LEFT, Filters on RIGHT */}
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <FilterSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search awarded tenders, contractor, authority, city..."
            isVoiceSearching={isVoiceSearching}
            toggleVoiceSearch={toggleVoiceSearch}
            accentColor="emerald"
            className="max-w-xl"
          />

          <TopFilterActionBar
            onOpenFilters={() => setIsFilterSidebarOpen(true)}
            activeFiltersCount={activeFiltersCount}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetAllFilters}
            onReload={loadData}
            isLoading={loading}
            totalCount={tenders.length}
            reloadLabel="Reload"
            accentColor="emerald"
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
        onClose={() => setIsFilterSidebarOpen(false)}
        title="Awarded Tender Filters"
        subtitle="Refine historical government awarded contracts"
        accentColor="emerald"
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        totalFilteredCount={filteredTenders.length}
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
                  <span>Award Year (Fiscal Period)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {availableYears.length} Years
                </span>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium">
                  All Award Years ({contextForYear.length})
                </option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white">
                    Financial Year {yr} ({yearCounts.get(yr) || 0} awards)
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword / Award ID Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>Keyword or Award ID</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by contractor, NIT, authority..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    title="Clear keyword"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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
              <span>Awarded Contracts</span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {visibleTenders.length < filteredTenders.length
                  ? `${visibleTenders.length} of ${filteredTenders.length}`
                  : `${filteredTenders.length}`}
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Click tender to inspect proposal</span>
          </div>

          <div
            ref={listContainerRef}
            onScroll={handleScroll}
            className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1 scroll-smooth"
          >
            {visibleTenders.map((tender) => {
              const isSelected = selectedTender ? tender.id === selectedTender.id : false;
              const sourceLabel = tender._sourceLabel;
              return (
                <div
                  key={tender.id}
                  onClick={() => {
                    setSelectedTenderId(tender.id);
                    setActiveSubTab('comparison');
                    if (window.innerWidth < 1024) {
                      dossierRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`cursor-pointer rounded-xl p-4 border transition-all text-xs relative ${
                    isSelected
                      ? 'bg-white dark:bg-[#131A2B] border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-white dark:bg-[#0E1422] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        AWARDED (L1)
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
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {tender.award_date}
                    </span>
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
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Winning Contractor</div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 break-words text-[11px]">
                      {tender.winning_company?.name}
                    </div>
                  </div>

                  {/* Financial Metrics Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Award Value</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                        {formatINR(tender.bid_submission?.quoted_amount_inr)}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Estimated</span>
                      <span className="text-slate-600 dark:text-slate-400 line-through font-mono">
                        {formatINR(tender.og_tender?.estimated_cost_inr)}
                      </span>
                      <span className="ml-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        (-{tender.bid_submission?.quoted_discount_pct}%)
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Infinite Scroll Sentinel */}
            {visibleCount < filteredTenders.length && (
              <div
                ref={sentinelRef}
                className="py-3 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 my-1"
              >
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {isLoadingMore ? 'Loading more awarded contracts...' : 'Scroll down for more contracts...'}
                </span>
              </div>
            )}

            {visibleCount >= filteredTenders.length && filteredTenders.length > 0 && (
              <div className="py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium border-t border-slate-100 dark:border-slate-800">
                ✓ Showing all {filteredTenders.length} contracts
              </div>
            )}

            {filteredTenders.length === 0 && (
              <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
                <p>No accepted tenders matching your selected criteria.</p>
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                >
                  Reset All Filters
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
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">No matching accepted tenders found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4">
                No tenders match your current filter combination. Try adjusting the Source, Organisation, State, City, or Year filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Reset All Filters
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
                        🏆 L1 WINNING PROPOSAL
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                        LOA: {selectedTender.acceptance_and_loa?.loa_number}
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
                      <span>Download Dossier PDF</span>
                    </a>
                  </div>
                </div>

                {/* Quick Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-1 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Awarded To</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 break-words block" title={selectedTender.winning_company?.name}>
                      {selectedTender.winning_company?.name}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quoted L1 Bid</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block font-mono">
                      {formatINR(selectedTender.bid_submission?.quoted_amount_inr)}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">L1 Discount</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block flex items-center gap-1 font-mono">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {selectedTender.bid_submission?.quoted_discount_pct}% below estimate
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">EMD Instrument</span>
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
                    <span>1. OG Tender vs Winning Bid</span>
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
                    <span>2. Contractor Profile</span>
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
                    <span>3. Filled 3-Cover Exhibits</span>
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
                    <span>4. Technical PQC & Machinery</span>
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
                    <span>5. Financial BOQ Analysis</span>
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
                    <span>6. Make in India & Legal</span>
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
                    <span>7. Milestones & Payment Terms</span>
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
                    <span>8. Letter of Acceptance (LOA)</span>
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
                    <span>9. Official Dossier PDF</span>
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
                    <span>10. All Evaluated Bids (L1, L2, L3...)</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: OG Tender vs Winning Bid Comparison */}
              {activeSubTab === 'comparison' && (
                <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Comparative Audit: Tender Requirement vs Contractor Submission
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Side-by-side compliance mapping showing how this bidder satisfied every qualification threshold.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-[#131A2B] text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Evaluation Parameter</th>
                          <th className="py-2.5 px-3 w-1/3">Original Tender (NIT) Condition</th>
                          <th className="py-2.5 px-3 w-1/3">Submitted by Winning Contractor</th>
                          <th className="py-2.5 px-3 text-center">Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Total Price / Financial Bid</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            Estimated: {formatINR(selectedTender.og_tender?.estimated_cost_inr)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {formatINR(selectedTender.bid_submission?.quoted_amount_inr)} (-{selectedTender.bid_submission?.quoted_discount_pct}%)
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              L1 LOWEST
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Earnest Money Deposit (EMD)</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            ₹ {(selectedTender.og_tender?.emd_amount_inr || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedTender.bid_submission?.emd_mode}:</span>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedTender.bid_submission?.emd_reference}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              ACCEPTED
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Annual Financial Turnover</td>
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
                              SURPASSES
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Bank Solvency Certificate</td>
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
                              QUALIFIED
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Similar Work 3-2-1 Experience</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            {selectedTender.og_tender?.similar_work_criteria}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            Satisfied via completed central/state PSU projects with verified completion certificates.
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              VERIFIED
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Make in India Local Content</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            Class-I Local Supplier (Minimum 50% Domestic Value Addition)
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTender.winning_company?.local_content_class}</span>
                            <div>Declared: <strong>{selectedTender.winning_company?.local_content_pct}%</strong> Local Content</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                              COMPLIANT
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
                      Corporate Credentials of the Awarded Contractor
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Official incorporation, tax filings, statutory licenses, and key management personnel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Company Legal Name</span>
                      <strong className="text-slate-900 dark:text-slate-100 text-xs">{selectedTender.winning_company?.name}</strong>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">{selectedTender.winning_company?.business_type}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Corporate Identification (CIN)</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{selectedTender.winning_company?.cin}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 md:col-span-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Registered Corporate Office</span>
                      <span className="text-slate-700 dark:text-slate-300">{selectedTender.winning_company?.registered_office}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tax Identifiers</span>
                      <div className="font-mono text-slate-800 dark:text-slate-200">GSTIN: {selectedTender.winning_company?.gstin}</div>
                      <div className="font-mono text-slate-800 dark:text-slate-200">PAN: {selectedTender.winning_company?.pan}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">MSME & Enterprise Category</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTender.winning_company?.msme_status}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Audited 3-Year Turnover</span>
                      <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                        {formatINR(selectedTender.winning_company?.audited_turnover_inr)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">CA UDIN: {selectedTender.winning_company?.ca_udin}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Bank Solvency Backing</span>
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {formatINR(selectedTender.winning_company?.solvency_certificate_inr)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedTender.winning_company?.solvency_bank}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 md:col-span-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Key Project In-Charge</span>
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
                      What the Winning Bidder Submitted in the 3 Packets
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Inspection of actual exhibits, certificates, affidavits, and price BOQ schedule filed on the portal.
                    </p>

                    <div className="space-y-3.5">
                      {/* Cover 1 */}
                      <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 overflow-hidden">
                        <div className="bg-amber-100/80 dark:bg-amber-950/50 px-4 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
                          <span>{selectedTender.bid_submission?.cover_1?.name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Fee & EMD</span>
                        </div>
                        <div className="p-3.5">
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {selectedTender.bid_submission?.cover_1?.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cover 2 */}
                      <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/40 overflow-hidden">
                        <div className="bg-blue-100/80 dark:bg-blue-950/50 px-4 py-2 text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                          <span>{selectedTender.bid_submission?.cover_2?.name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Technical & PQ</span>
                        </div>
                        <div className="p-3.5">
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {selectedTender.bid_submission?.cover_2?.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cover 3 */}
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40 overflow-hidden">
                        <div className="bg-emerald-100/80 dark:bg-emerald-950/50 px-4 py-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                          <span>{selectedTender.bid_submission?.cover_3?.name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Financial BOQ</span>
                        </div>
                        <div className="p-3.5">
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {selectedTender.bid_submission?.cover_3?.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
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
                      Technical Pre-Qualification Criteria (PQC) & Machinery Deployment
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Verification of GFR Rule 173 technical experience thresholds, specialized plant deployment, and certified engineering manpower.
                    </p>
                  </div>

                  {/* 3-2-1 Experience Formula Grid */}
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 p-4">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider block mb-2">
                      GFR Rule 173 Similar Work Formula Verification
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white dark:bg-[#141C2E] p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block">Condition A (3 Works)</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                          ≥ {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) * 0.4)}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">3 completed similar works of 40% cost in last 7 years</span>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded">
                          ✓ VERIFIED & APPROVED
                        </span>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block">Condition B (2 Works)</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                          ≥ {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) * 0.5)}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">2 completed similar works of 50% cost in last 7 years</span>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded">
                          ✓ VERIFIED & APPROVED
                        </span>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block">Condition C (1 Work)</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                          ≥ {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) * 0.8)}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">1 single completed mega work of 80% contract value</span>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded">
                          ✓ EXCEEDS CRITERIA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plant & Machinery Deployment Undertaking */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      Mandatory Heavy Plant & Equipment Mobilized on Site
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
                      Statutory Key Engineering Manpower Committed by Bidder
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
                      Itemized Bill of Quantities (BOQ) & Quoted Financial Schedule
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Financial rate schedule showing bill line items, component percentages, and competitive tender evaluation against L2 and L3 bids.
                    </p>
                  </div>

                  {/* Summary Comparison vs Estimate */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Department Estimate</span>
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {formatINR(selectedTender.og_tender?.estimated_cost_inr)}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Based on Official DSR Rates</span>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      <span className="text-[10px] uppercase font-semibold text-emerald-700 dark:text-emerald-300">Contractor Quoted L1 Bid</span>
                      <div className="font-mono font-bold text-emerald-800 dark:text-emerald-200 text-sm mt-0.5">
                        {formatINR(selectedTender.bid_submission?.quoted_amount_inr)}
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                        -{selectedTender.bid_submission?.quoted_discount_pct}% Below Department Estimate
                      </span>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <span className="text-[10px] uppercase font-semibold text-blue-700 dark:text-blue-300">Net Exchequer Savings</span>
                      <div className="font-mono font-bold text-blue-900 dark:text-blue-200 text-sm mt-0.5">
                        {formatINR((selectedTender.og_tender?.estimated_cost_inr || 0) - (selectedTender.bid_submission?.quoted_amount_inr || 0))}
                      </div>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400">Saved to Government Treasury</span>
                    </div>
                  </div>

                  {/* Itemized BOQ Schedule Table */}
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-[#131A2B] text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Item #</th>
                          <th className="py-2.5 px-3">BOQ Component Description</th>
                          <th className="py-2.5 px-3 text-right">Est. Share (%)</th>
                          <th className="py-2.5 px-3 text-right">Contractor Quoted Share</th>
                          <th className="py-2.5 px-3 text-center">Pricing Strategy</th>
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
                      Competitive Price Comparison Matrix (Tender Evaluation Committee)
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">L1 WINNER</span>
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
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">L2 BIDDER</span>
                          <span>Afcons Infrastructure / Larsen & Toubro Consortium</span>
                        </div>
                        <div className="text-right font-mono">
                          <span>{formatINR((selectedTender.bid_submission?.quoted_amount_inr || 0) * 1.026)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">(+2.6% over L1)</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">L3 BIDDER</span>
                          <span>NCC Limited / Dilip Buildcon JV</span>
                        </div>
                        <div className="text-right font-mono">
                          <span>{formatINR((selectedTender.bid_submission?.quoted_amount_inr || 0) * 1.054)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">(+5.4% over L1)</span>
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
                      Statutory, Tax & Make in India Order (DPIIT) Legal Exhibits
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Mandatory government public procurement regulatory filings, anti-corruption integrity accords, and tax standing certificates.
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
                      Contract Execution Milestones & Running Account (RA) Billing Schedule
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Detailed stage-by-stage construction timeline, milestone financial triggers, defect liability period, and liquidated damages provisions.
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
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Performance Bank Guarantee</span>
                      <strong className="text-slate-900 dark:text-slate-100 block mt-0.5">5% of Contract Value</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Submitted within 14 days of LOA, valid up to DLP completion + 60 days.</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Defect Liability Period (DLP)</span>
                      <strong className="text-slate-900 dark:text-slate-100 block mt-0.5">36 to 60 Months Guarantee</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Free maintenance of riding quality, culvert settlement, and road safety furniture.</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Liquidated Damages (LD)</span>
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
                      Official Letter of Acceptance (LOA) & Tender Committee Minutes
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Official endorsement and justification for selecting this contractor as the lowest responsive L1 bidder.
                    </p>
                  </div>

                  {/* LOA Certificate Frame */}
                  <div className="bg-slate-50 dark:bg-[#080C14] border-2 border-slate-300 dark:border-slate-700 rounded-xl p-5 relative">
                    {/* Official Stamp Watermark */}
                    <div className="absolute right-6 top-6 border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 rounded text-xs uppercase tracking-widest rotate-6 bg-white/90 dark:bg-slate-900/90 shadow-2xs">
                      AWARDED & ACCEPTED
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Letter of Acceptance (LOA) Number</span>
                          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                            {selectedTender.acceptance_and_loa?.loa_number}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Date of Issuance</span>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedTender.acceptance_and_loa?.loa_date}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Awarding Authority</span>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{selectedTender.acceptance_and_loa?.awarding_authority}</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Contract Agreement Execution</span>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{selectedTender.acceptance_and_loa?.contract_agreement_date}</div>
                      </div>

                      <div className="bg-white dark:bg-[#141C2E] p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/60 mt-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                          Tender Evaluation Committee Findings & Recommendation
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
                        Official Generated Bid Dossier (PDF Document)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Compiled dynamically via ReportLab in memory with zero local disk footprint.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={pdfUrl}
                        download={`${selectedTender.id}_awarded_dossier.pdf`}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in New Window</span>
                      </a>
                    </div>
                  </div>

                  {/* PDF Preview Frame */}
                  <div className="w-full h-[620px] rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-inner">
                    <iframe
                      src={pdfUrl}
                      title="Accepted Tender Dossier PDF Preview"
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
