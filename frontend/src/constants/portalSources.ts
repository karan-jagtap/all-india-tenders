import { fetchPortalSourcesDirectory, fetchStatutoryPortalMap } from '../services/api';
import { PortalCategory, PortalRegion, PortalStatus } from '../types/enums';

export { PortalCategory, PortalRegion, PortalStatus };

export interface PortalCategoryFilterOption {
  id: 'ALL' | PortalCategory;
  label: string;
}

export interface PortalRegionOption {
  value: 'ALL' | PortalRegion;
  label: string;
}

export const PORTAL_CATEGORY_OPTIONS: readonly PortalCategoryFilterOption[] = [
  { id: 'ALL', label: 'All Portals' },
  { id: PortalCategory.CENTRAL, label: 'Central Government' },
  { id: PortalCategory.STATE, label: 'State Governments' },
  { id: PortalCategory.DEFENSE_PSU, label: 'Defense & Energy PSUs' },
  { id: PortalCategory.RAILWAYS, label: 'Railways (IREPS)' },
  { id: PortalCategory.OPEN_DATA, label: 'Open Data (data.gov.in)' },
] as const;

export const PORTAL_REGION_OPTIONS: readonly PortalRegionOption[] = [
  { value: 'ALL', label: 'All Regions (India)' },
  { value: PortalRegion.NATIONAL, label: 'National / Central' },
  { value: PortalRegion.NORTH, label: 'North India' },
  { value: PortalRegion.SOUTH, label: 'South India' },
  { value: PortalRegion.WEST, label: 'West India' },
  { value: PortalRegion.EAST_CENTRAL, label: 'East & Central' },
  { value: PortalRegion.NORTH_EAST, label: 'North East' },
] as const;

export interface PortalSourceInfo {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: PortalCategory;
  state: string;
  region: PortalRegion;
  description: string;
  keyAuthorities: string[];
  procurementTypes: string[];
  statutoryFramework: string;
  status: PortalStatus;
  activeCountEstimate: number;
}

// In-memory cache populated dynamically from DB
export const ALL_STATUTORY_PORTAL_SOURCES: string[] = [];
export const STATUTORY_PORTAL_TO_STATE_MAP: Record<string, string> = {};
export const REAL_PORTAL_SOURCES: PortalSourceInfo[] = [];

type PortalListener = () => void;
const listeners: Set<PortalListener> = new Set();

export function subscribePortalSources(listener: PortalListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setPortalSources(portals: PortalSourceInfo[], mappings?: Record<string, string>, portalList?: string[]) {
  if (portals && portals.length > 0) {
    REAL_PORTAL_SOURCES.length = 0;
    portals.forEach((p) => REAL_PORTAL_SOURCES.push(p));
  }
  if (mappings && Object.keys(mappings).length > 0) {
    for (const [k, v] of Object.entries(mappings)) {
      STATUTORY_PORTAL_TO_STATE_MAP[k] = v;
    }
  }
  if (portalList && portalList.length > 0) {
    ALL_STATUTORY_PORTAL_SOURCES.length = 0;
    portalList.forEach((p) => ALL_STATUTORY_PORTAL_SOURCES.push(p));
  } else if (portals && portals.length > 0) {
    ALL_STATUTORY_PORTAL_SOURCES.length = 0;
    portals.forEach((p) => ALL_STATUTORY_PORTAL_SOURCES.push(p.name));
  }
  listeners.forEach((l) => l());
}

export const canonicalizePortalSource = (portal?: string): string => {
  const p = (portal || '').toLowerCase();
  if (p.includes('andaman')) return 'Andaman & Nicobar e-Procure (eproc.andaman.gov.in)';
  if (p.includes('apeprocurement') || p.includes('andhra')) return 'Andhra Pradesh e-Procure (tender.apeprocurement.gov.in)';
  if (p.includes('assamtenders') || p.includes('assam')) return 'Assam Tenders (assamtenders.gov.in)';
  if (p.includes('bhel')) return 'BHEL e-Procurement (eprocure.bhel.co.in)';
  if (p.includes('bihar')) return 'Bihar e-Procure (eproc2.bihar.gov.in)';
  if (p.includes('chandigarh') || p.includes('etenders.chd')) return 'Chandigarh e-Procurement (etenders.chd.nic.in)';
  if (p.includes('coalindia') || p.includes('coal india') || p.includes('coalindiatenders')) return 'Coal India e-Procurement (coalindiatenders.nic.in)';
  if (p.includes('cpwd') || p.includes('tenderwizard')) return 'CPWD TenderWizard (tenderwizard.com/CPWD)';
  if (p.includes('defproc') || p.includes('defense') || p.includes('defence')) return 'Defense Procurement Portal (defproc.gov.in)';
  if (p.includes('delhi') || p.includes('dmrc')) return 'Delhi e-Procure (govtprocurement.delhi.gov.in)';
  if (p.includes('goa')) return 'Goa e-Procurement (eprocure.goa.gov.in)';
  if (p.includes('gem') || p.includes('marketplace')) return 'Government e-Marketplace (gem.gov.in)';
  if (p.includes('nprocure') || p.includes('gujarat')) return 'Gujarat (n)Procure (tender.nprocure.com)';
  if (p.includes('hpcl')) return 'HPCL e-Procurement (etender.hpcl.co.in)';
  if (p.includes('hry.nic.in') || p.includes('haryana')) return 'Haryana e-Procurement (etenders.hry.nic.in)';
  if (p.includes('ireps') || p.includes('railway')) return 'IREPS Railways (ireps.gov.in)';
  if (p.includes('jktenders') || p.includes('kashmir') || p.includes('j&k')) return 'J&K e-Procurement (jktenders.gov.in)';
  if (p.includes('jharkhand')) return 'Jharkhand e-Procure (jharkhandtenders.gov.in)';
  if (p.includes('kppp') || p.includes('karnataka')) return 'Karnataka KPPP (kppp.karnataka.gov.in)';
  if (p.includes('kerala')) return 'Kerala e-Tenders (etenders.kerala.gov.in)';
  if (p.includes('mptenders') || p.includes('madhya')) return 'MP Tenders (mptenders.gov.in)';
  if (p.includes('mahatenders') || p.includes('maharashtra')) return 'MahaTenders (mahatenders.gov.in)';
  if (p.includes('ntpc')) return 'NTPC e-Procurement (etender.ntpctender.co.in)';
  if (p.includes('odisha')) return 'Odisha Tenders (tendersodisha.gov.in)';
  if (p.includes('data.gov.in') || p.includes('ogd') || p.includes('open data')) return 'Open Government Data Platform India (data.gov.in)';
  if (p.includes('pmgsy') || p.includes('pmgsytenders')) return 'PMGSY e-Procurement (pmgsytenders.gov.in)';
  if (p.includes('powergrid')) return 'POWERGRID e-Procurement (etender.powergrid.in)';
  if (p.includes('pudu') || p.includes('puducherry') || p.includes('pudutenders')) return 'Puducherry e-Procurement (pudutenders.gov.in)';
  if (p.includes('punjab')) return 'Punjab e-Procurement (eproc.punjab.gov.in)';
  if (p.includes('rajasthan')) return 'Rajasthan e-Procure (eproc.rajasthan.gov.in)';
  if (p.includes('tntenders') || p.includes('tamil')) return 'Tamil Nadu Tenders (tntenders.gov.in)';
  if (p.includes('telangana')) return 'Telangana e-Procurement (tender.telangana.gov.in)';
  if (p.includes('tripura') || p.includes('tripuratenders')) return 'Tripura e-Procurement (tripuratenders.gov.in)';
  if (p.includes('etender.up') || p.includes('up e-procure') || p.includes('up e-procurement')) return 'UP e-Procure (etender.up.nic.in)';
  if (p.includes('uktenders') || p.includes('uttarakhand') || p.includes('hptenders') || p.includes('himachal')) return 'Uttarakhand e-Tenders (uktenders.gov.in)';
  if (p.includes('wbtenders') || p.includes('bengal')) return 'West Bengal Tenders (wbtenders.gov.in)';
  return 'Central Public Procurement Portal (eprocure.gov.in)';
};

export const getPortalBoundState = (portal?: string): string | null => {
  if (!portal) return null;
  const canonical = canonicalizePortalSource(portal);
  return STATUTORY_PORTAL_TO_STATE_MAP[canonical] || null;
};

let isLoading = false;
export async function loadPortalSources(): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  try {
    const [directory, mapData] = await Promise.all([
      fetchPortalSourcesDirectory(),
      fetchStatutoryPortalMap()
    ]);
    setPortalSources(directory, mapData.portalToStateMap, mapData.allPortals);
  } catch (err) {
    console.warn('Failed to load portal sources from DB', err);
  } finally {
    isLoading = false;
  }
}

// Auto-trigger dynamic loading from DB immediately
loadPortalSources();
