import { fetchUiFilters } from '../services/api';

export interface ValueRangeOption {
  value: string;
  label: string;
}

export interface QuickSectorChip {
  label: string;
  val: string;
}

export interface QuickPortalPill {
  label: string;
  val: string;
  activeClass: string;
}

// In-memory cache populated dynamically from DB
export const VALUE_RANGE_OPTIONS: ValueRangeOption[] = [];
export const QUICK_SECTOR_CHIPS: QuickSectorChip[] = [];
export const QUICK_PORTAL_PILLS: QuickPortalPill[] = [];

type UiFiltersListener = () => void;
const listeners: Set<UiFiltersListener> = new Set();

export function subscribeUiFilters(listener: UiFiltersListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setUiFilters(data: {
  valueRangeOptions?: ValueRangeOption[];
  quickSectorChips?: QuickSectorChip[];
  quickPortalPills?: QuickPortalPill[];
}) {
  if (data.valueRangeOptions && data.valueRangeOptions.length > 0) {
    VALUE_RANGE_OPTIONS.length = 0;
    data.valueRangeOptions.forEach((o) => VALUE_RANGE_OPTIONS.push(o));
  }
  if (data.quickSectorChips && data.quickSectorChips.length > 0) {
    QUICK_SECTOR_CHIPS.length = 0;
    data.quickSectorChips.forEach((c) => QUICK_SECTOR_CHIPS.push(c));
  }
  if (data.quickPortalPills && data.quickPortalPills.length > 0) {
    QUICK_PORTAL_PILLS.length = 0;
    data.quickPortalPills.forEach((p) => QUICK_PORTAL_PILLS.push(p));
  }
  listeners.forEach((l) => l());
}

export function formatSectorChipLabel(cat: string): string {
  if (cat.includes('&')) {
    const parts = cat.split('&');
    const first = parts[0].split(',')[0].trim();
    const second = parts[1].trim().split(' ')[0].trim();
    return `${first} & ${second}`;
  }
  return cat.split(',')[0].trim();
}

/**
 * Returns dynamic quick sector chips derived from the DB categories,
 * falling back to loaded QUICK_SECTOR_CHIPS from DB app_constants.
 */
export function getQuickSectorChips(categories?: string[]): QuickSectorChip[] {
  if (categories && categories.length > 0) {
    return [
      { label: 'All Sectors', val: 'ALL' },
      ...categories.map((c) => ({
        label: formatSectorChipLabel(c),
        val: c
      }))
    ];
  }
  if (QUICK_SECTOR_CHIPS.length > 0) {
    return QUICK_SECTOR_CHIPS;
  }
  return [{ label: 'All Sectors', val: 'ALL' }];
}

let isLoading = false;
export async function loadUiFilters(): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  try {
    const data = await fetchUiFilters();
    setUiFilters(data);
  } catch (err) {
    console.warn('Failed to load UI filters from DB', err);
  } finally {
    isLoading = false;
  }
}

// Auto-trigger load from DB immediately
loadUiFilters();
