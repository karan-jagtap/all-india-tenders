/**
 * Centralized Component Props & UI Interfaces
 * All India Tenders Platform
 */

import React from 'react';
import type {
  EnrichedCurrentTender,
  AcceptedTender,
  RegisteredBidder,
  PreBidSimulationReport,
  DeepDocumentRAGReport,
  CurrentTenderSortOption,
  BidderSortOption,
  SubTabType,
  FilterAccentColor,
  PlatformStats,
  UserQuotaInfo,
  ComponentVariant,
  NavigableTab,
  BidderWonContract
} from './index';
import type { PortalSourceInfo } from '../constants/portalSources';

// ============================================================================
// 1. COMMON UI CONTROLS & DROPDOWNS
// ============================================================================

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
  countSuffix?: string;
  badge?: string;
  badgeColor?: string;
}

export interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  allOptionLabel: string;
  allOptionCount?: number;
  placeholder?: string;
  icon?: React.ReactNode;
  accentColor?: FilterAccentColor;
  emptyMessage?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export interface MultiSelectDropdownProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: DropdownOption[];
  allOptionLabel: string;
  allOptionCount?: number;
  placeholder?: string;
  icon?: React.ReactNode;
  accentColor?: FilterAccentColor;
  emptyMessage?: string;
  className?: string;
  maxPreviewCount?: number;
  label?: string;
  disabled?: boolean;
}

export interface FilterSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  isVoiceSearching?: boolean;
  toggleVoiceSearch?: () => void;
  accentColor?: FilterAccentColor;
  className?: string;
  variant?: ComponentVariant;
  id?: string;
}

export interface TopFilterActionBarProps {
  onOpenFilters: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onReload?: () => void;
  isLoading?: boolean;
  totalCount?: number;
  totalFilteredCount?: number;
  reloadLabel?: string;
  accentColor?: FilterAccentColor;
  className?: string;
  sortControl?: React.ReactNode;
  showReload?: boolean;
  reloadTooltip?: string;
}

export interface ToolbarSortOption<T extends string = string> {
  value: T;
  label: string;
  shortLabel?: string;
  desc?: string;
}

export interface ToolbarSortDropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: ToolbarSortOption<T>[];
  defaultValue?: T;
  accentColor?: FilterAccentColor;
  className?: string;
}

export interface FilterChipItem {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: FilterAccentColor;
  onRemove: () => void;
}

export interface ActiveFilterChipsBarProps {
  chips: FilterChipItem[];
  onClearAll: () => void;
  hasActiveFilters?: boolean;
  className?: string;
  accentColor?: FilterAccentColor;
  totalResultsCount?: number;
}

export interface TenderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  accentColor?: FilterAccentColor;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  totalFilteredCount: number;

  // 1. Work Category / Sector
  selectedCategory: string | string[];
  setSelectedCategory: (cat: string[]) => void;
  availableCategories: string[];
  categoryCounts: Map<string, number>;
  contextCategoryCount: number;

  // 2. Procurement Portal / Source
  selectedSource: string | string[];
  setSelectedSource: (src: string[]) => void;
  availableSources: string[];
  sourceCounts: Map<string, number>;
  contextSourceCount: number;

  // 3. Procuring Organization
  selectedOrg: string | string[];
  setSelectedOrg: (org: string[]) => void;
  availableOrgs: string[];
  orgCounts: Map<string, number>;
  contextOrgCount: number;

  // 4. State
  selectedState: string | string[];
  setSelectedState: (st: string[]) => void;
  availableStates: string[];
  stateCounts: Map<string, number>;
  contextStateCount: number;

  // 5. City
  selectedCity: string | string[];
  setSelectedCity: (ct: string[]) => void;
  availableCities: string[];
  cityCounts: Map<string, number>;
  contextCityCount: number;

  // Custom Extra Filters Slot
  extraFilters?: React.ReactNode;
  children?: React.ReactNode;
}

export interface SyncLiveButtonProps {
  onClick: () => void;
  isSyncing: boolean;
  cooldownRemaining?: number;
  variant?: 'header' | 'hero' | 'drawer' | 'compact' | 'section';
  className?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-right' | 'bottom-left';
  isLocked?: boolean;
  onLockedClick?: () => void;
  quotaInfo?: UserQuotaInfo | null;
  isQuotaLoading?: boolean;
  userEmail?: string | null;
  userName?: string | null;
}

export interface SyncHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LanguageSelectorProps {
  variant?: 'header' | 'drawer' | 'compact';
  className?: string;
}

// ============================================================================
// 2. IN-PROGRESS TENDERS COMPONENTS
// ============================================================================

export interface CurrentTendersTopBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isVoiceSearching: boolean;
  toggleVoiceSearch: () => void;
  selectedCategory: string[] | string;
  setSelectedCategory: (c: string[]) => void;
  availableCategories?: string[];
  categoryCounts?: Map<string, number>;
  contextCategoryCount?: number;
  selectedSource: string[] | string;
  setSelectedSource: (s: string[]) => void;
  availableSources?: string[];
  sourceCounts?: Map<string, number>;
  contextSourceCount?: number;
  selectedOrg: string[] | string;
  setSelectedOrg: (o: string[]) => void;
  selectedState: string[] | string;
  setSelectedState: (s: string[]) => void;
  selectedCity: string[] | string;
  setSelectedCity: (c: string[]) => void;
  selectedValueRange: string;
  setSelectedValueRange: (v: string) => void;
  sortBy: CurrentTenderSortOption;
  setSortBy: (s: CurrentTenderSortOption) => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  onOpenFilterDrawer: () => void;
  loadData: () => void;
  loading: boolean;
  totalTendersCount: number;
}

export interface CurrentTenderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  totalFilteredCount: number;

  // Source
  selectedSource: string[] | string;
  setSelectedSource: (s: string[]) => void;
  availableSources: string[];
  sourceCounts: Map<string, number>;
  contextSourceCount: number;

  // Org
  selectedOrg: string[] | string;
  setSelectedOrg: (o: string[]) => void;
  availableOrgs: string[];
  orgCounts: Map<string, number>;
  contextOrgCount: number;

  // State
  selectedState: string[] | string;
  setSelectedState: (s: string[]) => void;
  availableStates: string[];
  stateCounts: Map<string, number>;
  contextStateCount: number;

  // City
  selectedCity: string[] | string;
  setSelectedCity: (c: string[]) => void;
  availableCities: string[];
  cityCounts: Map<string, number>;
  contextCityCount: number;

  // Category
  selectedCategory: string[] | string;
  setSelectedCategory: (c: string[]) => void;
  availableCategories: string[];
  categoryCounts: Map<string, number>;
  contextCategoryCount: number;

  // Value Range
  selectedValueRange: string;
  setSelectedValueRange: (v: string) => void;

  // Closed / Expired Toggle
  includeClosed: boolean;
  setIncludeClosed: (inc: boolean) => void;
  openCount: number;
  totalAvailableCount: number;

  sortBy?: CurrentTenderSortOption;
  setSortBy?: (s: CurrentTenderSortOption) => void;
}

export interface CurrentTenderCardProps {
  tender: EnrichedCurrentTender;
  isSelected: boolean;
  onSelect: () => void;
  onCopyNit: (nit: string, e: React.MouseEvent) => void;
  copiedNit: string | null;
}

export interface CurrentTenderHeaderProps {
  selectedTender: EnrichedCurrentTender;
  onCopyNit: (nit: string, e?: React.MouseEvent) => void;
  copiedNit: string | null;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
  onOpenWholeDoc: () => void;
  activeSubTab: SubTabType;
  setActiveSubTab: (tab: SubTabType) => void;
  sbdUrl: string;
  nitPdfUrl: string;
  boqUrl: string;
}

export interface PortalBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender | null;
  copiedNit: string | null;
  onCopyNit: (nit: string) => void;
}

export interface WholeTenderDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender | null;
  sbdUrl: string;
}

// Subtab Props
export interface ScopeAndSpecsSubTabProps {
  selectedTender: EnrichedCurrentTender;
}

export interface PQCSubTabProps {
  selectedTender: EnrichedCurrentTender;
  onOpenPortalBridge?: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
}

export interface MSMESubTabProps {
  selectedTender?: EnrichedCurrentTender;
}

export interface TenderDocsSubTabProps {
  selectedTender: EnrichedCurrentTender;
  sbdUrl: string;
  pdfUrl: string;
  boqUrl: string;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
  onOpenWholeDoc?: () => void;
}

export interface ScrapingArchSubTabProps {
  selectedTender: EnrichedCurrentTender;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
}

export interface CompetitorPredictionSubTabProps {
  preBidPrediction: PreBidSimulationReport;
}

export interface DeepRAGClauseSubTabProps {
  deepRAGReport: DeepDocumentRAGReport;
  selectedTender: EnrichedCurrentTender;
  sbdUrl: string;
  boqUrl: string;
}

// ============================================================================
// 3. REGISTERED BIDDERS COMPONENTS
// ============================================================================

export interface BidderFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isVoiceSearching: boolean;
  toggleVoiceSearch: () => void;
  onOpenFilterDrawer: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetFilters: () => void;
  onReload: () => void;
  isLoading: boolean;
  totalBidders: number;
  chips: FilterChipItem[];
  totalResultsCount?: number;
}

export interface BidderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  totalFilteredCount: number;
  selectedCategory: string[] | string;
  setSelectedCategory: (cat: string[]) => void;
  allCategories: string[];
  categoryCounts?: Map<string, number>;
  totalBidders: number;
  selectedState: string[] | string;
  setSelectedState: (st: string[]) => void;
  allStates: string[];
  stateCounts?: Map<string, number>;
  sortBy: BidderSortOption;
  setSortBy: (s: BidderSortOption) => void;
}

export interface BidderCardProps {
  bidder: RegisteredBidder;
  isSelected: boolean;
  onSelect: () => void;
}

export interface BidderBannerProps {
  totalBidders: number;
  totalContractsSum: number;
  totalValueSumCr: string;
  onSyncLive?: () => void;
}

export interface BidderDossierProps {
  selectedBidder: RegisteredBidder;
  onCopy: (text: string, e: React.MouseEvent) => void;
  copiedText: string | null;
  onClose?: () => void;
  onOpenAcceptedTenderModal?: (tenderId: string) => void;
}

export interface BidderContractsTableProps {
  totalContractsCount: number;
  contractSearchQuery: string;
  setContractSearchQuery: (q: string) => void;
  filteredContracts: BidderWonContract[];
  onOpenAcceptedTenderModal?: (tenderId: string) => void;
}

export interface BidderSortOptionItem {
  value: BidderSortOption;
  label: string;
  desc: string;
}

export interface BidderSortOptionCardProps {
  option: BidderSortOptionItem;
  isSelected: boolean;
  onSelect: (val: BidderSortOption) => void;
}

// ============================================================================
// 4. PREVIOUSLY ACCEPTED TENDERS
// ============================================================================

export interface AllBidsEvaluationSubTabProps {
  tender: AcceptedTender;
}

export interface OrgDirectoryItem {
  authority: string;
  portal: string;
  category: string;
  accepted_count: number;
  current_count: number;
  sector: string;
  state: string;
}

export interface OrganizationsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrg?: (orgName: string) => void;
  initialSector?: string;
}

// ============================================================================
// 5. HOME SCREEN & AUTH
// ============================================================================

export interface HomeScreenProps {
  stats: PlatformStats | null;
  onNavigate: (tab: NavigableTab) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  cooldownRemaining?: number;
  quotaInfo?: UserQuotaInfo | null;
  userEmail?: string | null;
  userName?: string | null;
}

export interface HomeHeroSectionProps {
  activeTenders: number;
  acceptedTenders: number;
  biddersCount: number;
  onNavigate: (tab: NavigableTab) => void;
  onScrollToSources: () => void;
}

export interface HomeMetricsBarProps {
  activeTenders: number;
  totalValueCr: string;
  acceptedTenders: number;
  biddersCount: number;
  onNavigate: (tab: NavigableTab) => void;
  onScrollToSources: () => void;
  stats?: PlatformStats | null;
}

export interface HomeCapabilitiesSectionProps {
  onNavigate: (tab: NavigableTab) => void;
}

export interface HomeSourcesDirectoryProps {
  onNavigate: (tab: NavigableTab) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  cooldownRemaining?: number;
  quotaInfo?: UserQuotaInfo | null;
  userEmail?: string | null;
  userName?: string | null;
}

export interface HomeCtaBannerProps {
  onNavigate: (tab: NavigableTab) => void;
}

export interface PortalSourceCardProps {
  portal: PortalSourceInfo;
  onNavigate: (tab: NavigableTab) => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackTab?: any;
  title?: string;
  description?: string;
}

export interface ClerkSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SignInViewProps {
  onNavigateHome: () => void;
  onSuccess?: () => void;
  onBackToOverview?: () => void;
}

export interface AuthHeaderControlsProps {
  onNavigateToSignIn?: () => void;
  className?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
