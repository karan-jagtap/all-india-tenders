import { fetchContractorPools } from '../services/api';

export interface PoolContractor {
  name: string;
  hq: string;
  cls: string;
  turnoverCr: number;
}

// In-memory cache of contractor pools populated dynamically from DB
export const CONTRACTOR_POOLS: Record<string, PoolContractor[]> = {};

type PoolListener = (pools: Record<string, PoolContractor[]>) => void;
const poolListeners: Set<PoolListener> = new Set();

export function subscribeContractorPools(listener: PoolListener): () => void {
  poolListeners.add(listener);
  return () => poolListeners.delete(listener);
}

export function setContractorPools(newPools: Record<string, PoolContractor[]>) {
  if (!newPools || Object.keys(newPools).length === 0) return;
  // Mutate in-place so all consumers of CONTRACTOR_POOLS instantly see updated DB pools
  for (const [key, val] of Object.entries(newPools)) {
    CONTRACTOR_POOLS[key] = val;
  }
  poolListeners.forEach((l) => l(CONTRACTOR_POOLS));
}

export function getContractorPools(): Record<string, PoolContractor[]> {
  return CONTRACTOR_POOLS;
}

export function getContractorPool(category: string): PoolContractor[] {
  if (!category) {
    const firstKey = Object.keys(CONTRACTOR_POOLS)[0];
    return firstKey ? CONTRACTOR_POOLS[firstKey] || [] : [];
  }

  // 1. Direct exact match in DB-loaded pools
  if (CONTRACTOR_POOLS[category] && CONTRACTOR_POOLS[category].length > 0) {
    return CONTRACTOR_POOLS[category];
  }

  // 2. Case-insensitive match against DB categories
  const target = category.toLowerCase().trim();
  for (const [dbCat, contractors] of Object.entries(CONTRACTOR_POOLS)) {
    if (dbCat.toLowerCase() === target && contractors.length > 0) {
      return contractors;
    }
  }

  // 3. Dynamic token overlap / substring matching against loaded DB categories
  const targetTokens = target.split(/[\s,&/]+/).filter((w) => w.length >= 3);
  let bestMatch: PoolContractor[] = [];
  let maxScore = 0;

  for (const [dbCat, contractors] of Object.entries(CONTRACTOR_POOLS)) {
    if (!contractors || contractors.length === 0) continue;
    const dbLower = dbCat.toLowerCase();
    if (dbLower.includes(target) || target.includes(dbLower)) {
      return contractors;
    }
    let score = 0;
    for (const token of targetTokens) {
      if (dbLower.includes(token)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = contractors;
    }
  }

  if (bestMatch.length > 0) {
    return bestMatch;
  }

  // 4. Dynamically fallback to the largest available pool in DB
  const allPools = Object.values(CONTRACTOR_POOLS);
  if (allPools.length > 0) {
    return allPools.reduce((max, pool) => (pool.length > max.length ? pool : max), allPools[0]) || [];
  }

  return [];
}

let isPoolLoading = false;
export async function loadContractorPools(): Promise<Record<string, PoolContractor[]>> {
  if (isPoolLoading) return CONTRACTOR_POOLS;
  isPoolLoading = true;
  try {
    const data = await fetchContractorPools();
    if (data && Object.keys(data).length > 0) {
      setContractorPools(data);
    }
  } catch (err) {
    console.warn('Failed to load contractor pools from DB', err);
  } finally {
    isPoolLoading = false;
  }
  return CONTRACTOR_POOLS;
}

// Auto-trigger dynamic loading from DB as soon as this module is evaluated
loadContractorPools();
