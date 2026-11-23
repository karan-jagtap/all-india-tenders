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
  UserQuotaInfo
} from './index';

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
  label: string;
  icon?: React.ReactNode;
  options: DropdownOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  accentColor?: FilterAccentColor;
  className?: string;
  disabled?: boolean;
}

export interface MultiSelectDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  accentColor?: FilterAccentColor;
  className?: string;
  disabled?: boolean;
  maxDisplayCount?: number;
}

export interface FilterSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  placeholder?: string;
  accentColor?: FilterAccentColor;
  isVoiceSearching?: boolean;
  toggleVoiceSearch?: () => void;
  className?: string;
  id?: string;
}

export interface TopFilterActionBarProps {
  onOpenFilters: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onReload: () => void;
  totalFilteredCount?: number;
  accentColor?: FilterAccentColor;
  className?: string;
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
  onRemove: () => void;
  color?: FilterAccentColor;
}

export interface ActiveFilterChipsBarProps {
  chips: FilterChipItem[];
  onClearAll?: () => void;
  accentColor?: FilterAccentColor;
  className?: string;
  totalResultsCount?: number;
}

export interface TenderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onResetAll: () => void;
  title: string;
  subtitle?: string;
  accentColor?: FilterAccentColor;
  children: React.ReactNode;
}

export interface SyncLiveButtonProps {
  onClick: () => void;
  isSyncing: boolean;
  cooldownRemaining?: number;
  variant?: 'header' | 'hero' | 'drawer' | 'compact';
  className?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  isLocked?: boolean;
  onLockedClick?: () => void;
  quotaInfo?: UserQuotaInfo | null;
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
  availableCategories: string[];
  categoryCounts: Map<string, number>;
  contextCategoryCount: number;
  selectedSource: string[] | string;
  setSelectedSource: (s: string[]) => void;
  availableSources: string[];
  sourceCounts: Map<string, number>;
  contextSourceCount: number;
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
  selectedSource: string[];
  setSelectedSource: (s: string[]) => void;
  allSources: string[];
  sourceCounts: Map<string, number>;
  selectedOrg: string[];
  setSelectedOrg: (o: string[]) => void;
  allOrgs: string[];
  orgCounts: Map<string, number>;
  selectedState: string[];
  setSelectedState: (s: string[]) => void;
  allStates: string[];
  stateCounts: Map<string, number>;
  selectedCity: string[];
  setSelectedCity: (c: string[]) => void;
  availableCities: string[];
  cityCounts: Map<string, number>;
  selectedCategory: string[];
  setSelectedCategory: (c: string[]) => void;
  allCategories: string[];
  categoryCounts: Map<string, number>;
  selectedValueRange: string;
  setSelectedValueRange: (v: string) => void;
  sortBy: CurrentTenderSortOption;
  setSortBy: (s: CurrentTenderSortOption) => void;
  includeClosed: boolean;
  setIncludeClosed: (c: boolean) => void;
}

export interface CurrentTenderCardProps {
  tender: EnrichedCurrentTender;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpenPortalBridge: (tender: EnrichedCurrentTender, e?: React.MouseEvent) => void;
}

export interface CurrentTenderHeaderProps {
  tender: EnrichedCurrentTender;
  activeSubTab: SubTabType;
  setActiveSubTab: (tab: SubTabType) => void;
  onOpenPortalBridge: (tender: EnrichedCurrentTender) => void;
  onOpenWholeDocModal: () => void;
  copiedNit: string | null;
  onCopyNit: (nit: string, e?: React.MouseEvent) => void;
}

export interface PortalBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender;
  copiedNit: string | null;
  onCopyNit: (nit: string, e?: React.MouseEvent) => void;
}

export interface WholeTenderDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender;
}

// Subtab Props
export interface ScopeAndSpecsSubTabProps {
  tender: EnrichedCurrentTender;
}

export interface PQCSubTabProps {
  tender: EnrichedCurrentTender;
}

export interface MSMESubTabProps {
  tender: EnrichedCurrentTender;
}

export interface TenderDocsSubTabProps {
  tender: EnrichedCurrentTender;
  onOpenWholeDocModal: () => void;
}

export interface ScrapingArchSubTabProps {
  tender: EnrichedCurrentTender;
  onRunLiveScraper?: () => void;
  isScrapingLive?: boolean;
}

export interface CompetitorPredictionSubTabProps {
  tender: EnrichedCurrentTender;
  predictionReport: PreBidSimulationReport;
}

export interface DeepRAGClauseSubTabProps {
  tender: EnrichedCurrentTender;
  ragReport: DeepDocumentRAGReport;
}

// ============================================================================
// 3. REGISTERED BIDDERS COMPONENTS
// ============================================================================

export interface BidderFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string[];
  setSelectedCategory: (cat: string[]) => void;
  selectedState: string[];
  setSelectedState: (st: string[]) => void;
  sortBy: BidderSortOption;
  setSortBy: (s: BidderSortOption) => void;
  onResetFilters: () => void;
  onOpenFilterDrawer: () => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  totalFilteredCount: number;
  totalBiddersCount: number;
  onReload: () => void;
  isVoiceSearching?: boolean;
  toggleVoiceSearch?: () => void;
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
  onSelect: (bidder: RegisteredBidder) => void;
}

export interface BidderBannerProps {
  bidder: RegisteredBidder;
}

export interface BidderDossierProps {
  bidder: RegisteredBidder;
}

export interface BidderContractsTableProps {
  bidder: RegisteredBidder;
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
  onNavigateTab: (tab: any) => void;
  onOpenSignIn: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  cooldownRemaining: number;
  stats: PlatformStats | null;
  userQuota?: UserQuotaInfo | null;
}

export interface HomeHeroSectionProps {
  onExploreCurrent: () => void;
  onExploreAccepted: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  cooldownRemaining: number;
  userQuota?: UserQuotaInfo | null;
}

export interface HomeMetricsBarProps {
  stats: PlatformStats | null;
}

export interface HomeCapabilitiesSectionProps {
  onExploreCurrent: () => void;
  onExploreAccepted: () => void;
  onExploreBidders: () => void;
}

export interface HomeSourcesDirectoryProps {
  onSelectPortal: (portalName: string) => void;
}

export interface HomeCtaBannerProps {
  onTriggerSync: () => void;
  isSyncing: boolean;
  cooldownRemaining: number;
  userQuota?: UserQuotaInfo | null;
}

export interface PortalSourceCardProps {
  portal: any;
  onSelect: (portalName: string) => void;
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
  onBackToOverview?: () => void;
}

export interface AuthHeaderControlsProps {
  className?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
