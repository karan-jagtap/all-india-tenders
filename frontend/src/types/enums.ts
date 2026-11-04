/**
 * Central TypeScript Enums and Datatypes
 * All India Tenders Platform
 */

// ============================================================================
// 1. STATUTORY PORTAL & JURISDICTION ENUMS
// ============================================================================

export enum PortalCategory {
  CENTRAL = 'Central',
  STATE = 'State',
  DEFENSE_PSU = 'Defense & PSU',
  RAILWAYS = 'Railways',
  OPEN_DATA = 'Open Data',
}

export enum PortalRegion {
  NATIONAL = 'National',
  NORTH = 'North',
  SOUTH = 'South',
  WEST = 'West',
  EAST_CENTRAL = 'East & Central',
  NORTH_EAST = 'North East',
}

export enum PortalStatus {
  LIVE = 'LIVE',
  ACTIVE = 'ACTIVE',
}

// ============================================================================
// 2. DOCUMENT RAG & RISK INTELLIGENCE ENUMS
// ============================================================================

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum AuthorityStrictness {
  STRICT_ENFORCEMENT = 'STRICT ENFORCEMENT',
  STANDARD_GFR_BENCHMARK = 'STANDARD GFR BENCHMARK',
  DISCRETIONARY = 'DISCRETIONARY',
}

export enum VolatilityRisk {
  HIGH_SENSITIVITY = 'HIGH SENSITIVITY',
  MEDIUM_SENSITIVITY = 'MEDIUM SENSITIVITY',
  LOW_SENSITIVITY = 'LOW SENSITIVITY',
}

export enum RiskVerdict {
  HIGHLY_BANKABLE = 'HIGHLY BANKABLE (LOW RISK)',
  MODERATE_COMMERCIAL_RISK = 'MODERATE COMMERCIAL RISK',
  HIGH_LEGAL_EXPOSURE = 'HIGH LEGAL EXPOSURE',
}

export enum StatutoryChecklistStatus {
  COMPLIANT = 'COMPLIANT',
  CRITICAL_ATTENTION = 'CRITICAL ATTENTION',
  VERIFIED_GFR = 'VERIFIED GFR',
}

// ============================================================================
// 3. PRE-BID SIMULATION & PREDICTION ENUMS
// ============================================================================

export enum PredictedBidRank {
  L1 = 'L1 (Predicted Winner)',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
}

export enum PricingPosture {
  AGGRESSIVE_DISCOUNTER = 'Aggressive DSR Discounter',
  BALANCED_EPC = 'Balanced EPC Contractor',
  CONSERVATIVE_MARGIN = 'Conservative Margin-First',
}

export enum BidCoverStatus {
  PASSED = 'COVER 1 & 2 PASSED',
  EVALUATED_RESPONSIVE = 'EVALUATED RESPONSIVE',
}

export enum MatchingConfidenceLevel {
  HIGH = 'HIGH (Level-1/2 Authority Benchmark)',
  MEDIUM = 'MEDIUM (Regional DSR Curve)',
  ESTIMATE = 'ESTIMATE (GFR PQC Capacity Model)',
}

// ============================================================================
// 4. AWARDED BIDS EVALUATION MATRIX ENUMS
// ============================================================================

export enum AwardBidRank {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
}

export enum EvaluationCover1Status {
  COMPLIANT_AND_VERIFIED = 'Compliant & Verified',
  VERIFIED = 'Verified',
}

export enum EvaluationCover2Status {
  QUALIFIED = 'Qualified (100% PQC Met)',
  DISQUALIFIED = 'Disqualified (Criteria Shortfall)',
}

// ============================================================================
// 5. APPLICATION NAVIGATION & TAB ROUTING ENUMS
// ============================================================================

export enum NavigationTab {
  HOME = 'home',
  CURRENT = 'current',
  ACCEPTED = 'accepted',
  BIDDERS = 'bidders',
}

export type AppNavTarget = NavigationTab | 'home' | 'current' | 'accepted' | 'bidders';
export type NavigableTab = NavigationTab.CURRENT | NavigationTab.ACCEPTED | NavigationTab.BIDDERS | 'current' | 'accepted' | 'bidders';

export enum CurrentTenderSubTab {
  SPECS = 'specs',
  PQC = 'pqc',
  MSME = 'msme',
  PDF = 'pdf',
  SCRAPING = 'scraping',
  PREDICTION = 'prediction',
  RAG_ANALYSIS = 'rag_analysis',
}

export type SubTabType =
  | CurrentTenderSubTab
  | 'specs'
  | 'pqc'
  | 'msme'
  | 'pdf'
  | 'scraping'
  | 'prediction'
  | 'rag_analysis';

export enum AcceptedTenderModalTab {
  COMPARISON = 'comparison',
  COMPANY = 'company',
  COVERS = 'covers',
  PQC = 'pqc',
  BOQ = 'boq',
  COMPLIANCE = 'compliance',
  MILESTONES = 'milestones',
  LOA = 'loa',
  PDF = 'pdf',
  ALL_BIDS = 'all_bids',
}

export type DetailModalTab =
  | AcceptedTenderModalTab
  | 'comparison'
  | 'company'
  | 'covers'
  | 'pqc'
  | 'boq'
  | 'compliance'
  | 'milestones'
  | 'loa'
  | 'pdf'
  | 'all_bids';

export enum TenderDocType {
  SBD = 'sbd',
  NIT = 'nit',
  BOQ = 'boq',
}

export enum FeedbackSubject {
  FEEDBACK = 'Feedback',
  CONTACT_US = 'Contact Us',
}

// ============================================================================
// 6. UI THEME & PRESENTATION ENUMS
// ============================================================================

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export type Theme = ThemeMode | 'light' | 'dark';

export enum UiAccentColor {
  ORANGE = 'orange',
  EMERALD = 'emerald',
  BLUE = 'blue',
  SLATE = 'slate',
  ROSE = 'rose',
  AMBER = 'amber',
  VIOLET = 'violet',
}

export type FilterAccentColor =
  | UiAccentColor
  | 'orange'
  | 'emerald'
  | 'blue'
  | 'slate'
  | 'rose'
  | 'amber'
  | 'violet';

export enum UiVariant {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ComponentVariant = UiVariant | 'light' | 'dark';
