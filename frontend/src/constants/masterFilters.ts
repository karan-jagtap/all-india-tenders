/**
 * Master Filter Constants and Normalizers across In-Progress & Previously Accepted Tenders
 * Dynamically populated from SQLite Database
 */

import { getPortalBoundState } from './portalSources';
import { fetchMasterFilters } from '../services/api';

// In-memory caches populated dynamically from DB
export const ALL_CANONICAL_CATEGORIES: string[] = [];
export const ALL_CANONICAL_STATES: string[] = [];
export const ALL_MASTER_ORGANIZATIONS: string[] = [];
export const ALL_MASTER_CITIES: string[] = [];
export const STATE_CANONICAL_CITIES: Record<string, { cities: string[]; defaultCity: string }> = {};

export const ALL_CATEGORY_KEYWORDS: Record<string, string[]> = {};
export const ALL_STATE_KEYWORDS: Record<string, string[]> = {};
export const ALL_AUTHORITY_CITY_MAP: Record<string, Record<string, string>> = {};

type MasterFilterListener = () => void;
const listeners: Set<MasterFilterListener> = new Set();

export function subscribeMasterFilters(listener: MasterFilterListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setMasterFilters(data: {
  categories?: string[];
  states?: string[];
  organizations?: string[];
  stateCities?: Record<string, { cities: string[]; defaultCity: string }>;
  categoryKeywords?: Record<string, string[]>;
  stateKeywords?: Record<string, string[]>;
  authorityCityMap?: Record<string, Record<string, string>>;
}) {
  if (data.categories && data.categories.length > 0) {
    ALL_CANONICAL_CATEGORIES.length = 0;
    data.categories.forEach((c) => ALL_CANONICAL_CATEGORIES.push(c));
  }
  if (data.states && data.states.length > 0) {
    ALL_CANONICAL_STATES.length = 0;
    data.states.forEach((s) => ALL_CANONICAL_STATES.push(s));
  }
  if (data.organizations && data.organizations.length > 0) {
    ALL_MASTER_ORGANIZATIONS.length = 0;
    data.organizations.forEach((o) => ALL_MASTER_ORGANIZATIONS.push(o));
  }
  if (data.stateCities && Object.keys(data.stateCities).length > 0) {
    for (const [k, v] of Object.entries(data.stateCities)) {
      STATE_CANONICAL_CITIES[k] = v;
    }
    const allCitiesSet = new Set<string>();
    Object.values(STATE_CANONICAL_CITIES).forEach((sc) => {
      sc.cities.forEach((c) => allCitiesSet.add(c));
    });
    ALL_MASTER_CITIES.length = 0;
    Array.from(allCitiesSet).sort().forEach((c) => ALL_MASTER_CITIES.push(c));
  }
  if (data.categoryKeywords && Object.keys(data.categoryKeywords).length > 0) {
    for (const [k, v] of Object.entries(data.categoryKeywords)) {
      ALL_CATEGORY_KEYWORDS[k] = v;
    }
  }
  if (data.stateKeywords && Object.keys(data.stateKeywords).length > 0) {
    for (const [k, v] of Object.entries(data.stateKeywords)) {
      ALL_STATE_KEYWORDS[k] = v;
    }
  }
  if (data.authorityCityMap && Object.keys(data.authorityCityMap).length > 0) {
    for (const [k, v] of Object.entries(data.authorityCityMap)) {
      ALL_AUTHORITY_CITY_MAP[k] = v;
    }
  }
  listeners.forEach((l) => l());
}

/**
 * Normalizes any category string or tender text dynamically
 * against the database-backed canonical category keywords.
 */
export const canonicalizeCategory = (cat?: string, title?: string, scope?: string): string => {
  const c = (cat || '').toLowerCase().trim();
  const full = `${c} ${(title || '').toLowerCase()} ${(scope || '').toLowerCase()}`;

  // 1. Direct match with any loaded DB category name
  for (const canonical of ALL_CANONICAL_CATEGORIES) {
    if (canonical.toLowerCase() === c) {
      return canonical;
    }
  }

  // 2. Keyword match against dynamic category rules from DB
  for (const [categoryName, keywords] of Object.entries(ALL_CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => full.includes(k))) {
      return categoryName;
    }
  }

  // 3. Fallback to default canonical category or first DB category
  return (
    ALL_CANONICAL_CATEGORIES.find((c) => c.toLowerCase().includes('central')) ||
    ALL_CANONICAL_CATEGORIES[0] ||
    'Central Government Procurement'
  );
};

/**
 * Normalizes any state string or tender text dynamically
 * against the database-backed canonical state keywords and portal bindings.
 */
export const canonicalizeState = (
  state?: string,
  title?: string,
  scope?: string,
  auth?: string,
  portal?: string
): string => {
  // 1. Strict Statutory State Portal binding
  const boundState = getPortalBoundState(portal);
  if (boundState) {
    return boundState;
  }

  // 2. Direct match with loaded DB states
  const s = (state || '').toLowerCase().trim();
  if (s) {
    for (const canonical of ALL_CANONICAL_STATES) {
      if (canonical.toLowerCase() === s || s.includes(canonical.toLowerCase())) {
        return canonical;
      }
    }
  }

  // 3. Keyword match against dynamic state rules from DB
  const full = `${s} ${(title || '').toLowerCase()} ${(scope || '').toLowerCase()} ${(auth || '').toLowerCase()}`;
  for (const [stateName, keywords] of Object.entries(ALL_STATE_KEYWORDS)) {
    if (keywords.some((k) => full.includes(k))) {
      return stateName;
    }
  }

  return (
    ALL_CANONICAL_STATES.find((st) => st.toLowerCase().includes('pan-india') || st.toLowerCase().includes('central')) ||
    'Pan-India / Central'
  );
};

/**
 * Normalizes and validates tender City against the canonical State
 * using DB-backed stateCities and authorityCityMap hierarchies.
 */
export const canonicalizeCity = (
  city?: string,
  state?: string,
  title?: string,
  scope?: string,
  auth?: string,
  portal?: string
): string => {
  const normState = state || canonicalizeState(undefined, title, scope, auth, portal);
  const stateConfig = STATE_CANONICAL_CITIES[normState];

  if (!stateConfig) {
    return city?.trim() || 'All India';
  }

  const cityMatches = (candidate: string, text: string): boolean => {
    const parts = [candidate.toLowerCase()];
    if (candidate.includes('/')) candidate.split('/').forEach((p) => parts.push(p.trim().toLowerCase()));
    if (candidate.includes('(')) parts.push(candidate.split('(')[0].trim().toLowerCase());
    if (candidate.includes('-')) candidate.split('-').forEach((p) => parts.push(p.trim().toLowerCase()));
    return parts.some((p) => p.length >= 3 && text.toLowerCase().includes(p));
  };

  // 1. If incoming city matches a known DB city in this state
  if (city) {
    const trimmed = city.trim().toLowerCase();
    for (const validCity of stateConfig.cities) {
      if (validCity.toLowerCase() === trimmed || cityMatches(validCity, trimmed) || cityMatches(trimmed, validCity)) {
        return validCity;
      }
    }
  }

  // 2. Scan title, scope, authority for known DB cities in this state
  const full = `${(title || '').toLowerCase()} ${(scope || '').toLowerCase()} ${(auth || '').toLowerCase()}`;
  for (const validCity of stateConfig.cities) {
    if (cityMatches(validCity, full)) {
      return validCity;
    }
  }

  // 3. Organization / authority to city lookup sourced dynamically from DB
  const authMap = ALL_AUTHORITY_CITY_MAP[normState];
  if (authMap) {
    for (const [keyword, mappedCity] of Object.entries(authMap)) {
      if (full.includes(keyword)) {
        return mappedCity;
      }
    }
  }

  // 4. Fallback to state's default city from DB
  return stateConfig.defaultCity;
};

let isLoading = false;
export async function loadMasterFilters(): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  try {
    const data = await fetchMasterFilters();
    setMasterFilters(data);
  } catch (err) {
    console.warn('Failed to load master filters taxonomy from DB', err);
  } finally {
    isLoading = false;
  }
}

// Auto-trigger dynamic loading from DB immediately
loadMasterFilters();
