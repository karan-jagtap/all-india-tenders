/**
 * All India Tenders - API Client
 */

import {
  AcceptedTender,
  CurrentTender,
  PlatformStats,
  RegisteredBidder,
  ScrapeReport
} from '../types';

export * from '../types';

const API_BASE = '/api';

export interface CurrentTenderFilters {
  source_portal?: string;
  organization?: string;
  state?: string;
  city?: string;
  category?: string;
  search?: string;
  min_cost?: number;
  max_cost?: number;
}

export async function listAcceptedTenders(): Promise<AcceptedTender[]> {
  const res = await fetch(`${API_BASE}/accepted-tenders?_t=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) throw new Error('Failed to load accepted tenders');
  return res.json();
}

export function getAcceptedTenderPdfUrl(id: string): string {
  return `${API_BASE}/accepted-tenders/${id}/pdf`;
}

export async function listCurrentTenders(filters?: CurrentTenderFilters): Promise<CurrentTender[]> {
  const params = new URLSearchParams();
  if (filters?.source_portal && filters.source_portal !== 'ALL') params.append('source_portal', filters.source_portal);
  if (filters?.organization && filters.organization !== 'ALL') params.append('organization', filters.organization);
  if (filters?.state && filters.state !== 'ALL') params.append('state', filters.state);
  if (filters?.city && filters.city !== 'ALL') params.append('city', filters.city);
  if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.min_cost) params.append('min_cost', String(filters.min_cost));
  if (filters?.max_cost) params.append('max_cost', String(filters.max_cost));
  params.append('_t', String(Date.now()));

  const res = await fetch(`${API_BASE}/current-tenders?${params.toString()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) throw new Error('Failed to load current tenders');
  return res.json();
}

export function getCurrentTenderPdfUrl(id: string): string {
  return `${API_BASE}/current-tenders/${id}/pdf`;
}

export function getCurrentTenderSbdDocUrl(id: string): string {
  return `${API_BASE}/current-tenders/${id}/tender-document`;
}

export function getCurrentTenderBoqUrl(id: string): string {
  return `${API_BASE}/current-tenders/${id}/boq-pdf`;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const res = await fetch(`${API_BASE}/stats?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to load platform stats');
  return res.json();
}

export async function triggerLiveScrape(): Promise<ScrapeReport> {
  const res = await fetch(`${API_BASE}/scraper/scrape-live`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Live scraping execution failed');
  return res.json();
}

export async function listRegisteredBidders(params?: {
  search?: string;
  category?: string;
  state?: string;
  sort_by?: string;
}): Promise<RegisteredBidder[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category && params.category !== 'ALL') query.append('category', params.category);
  if (params?.state && params.state !== 'ALL') query.append('state', params.state);
  if (params?.sort_by) query.append('sort_by', params.sort_by);
  query.append('_t', String(Date.now()));

  const res = await fetch(`${API_BASE}/bidders?${query.toString()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) throw new Error('Failed to load registered bidders directory');
  return res.json();
}
