export interface PortalSourceInfo {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: 'Central' | 'State' | 'Defense & PSU' | 'Railways' | 'Open Data';
  state: string;
  region: 'National' | 'North' | 'South' | 'West' | 'East & Central' | 'North East';
  description: string;
  keyAuthorities: string[];
  procurementTypes: string[];
  statutoryFramework: string;
  status: 'LIVE' | 'ACTIVE';
  activeCountEstimate: number;
}

/**
 * Standard Canonical 28 Statutory Portals across all tabs (In-Progress & Previously Accepted)
 */
export const ALL_STATUTORY_PORTAL_SOURCES: string[] = [
  'Andaman & Nicobar e-Procure (eproc.andaman.gov.in)',
  'Andhra Pradesh e-Procure (tender.apeprocurement.gov.in)',
  'Assam Tenders (assamtenders.gov.in)',
  'Bihar e-Procure (eproc2.bihar.gov.in)',
  'CPWD TenderWizard (tenderwizard.com/CPWD)',
  'Central Public Procurement Portal (eprocure.gov.in)',
  'Defense Procurement Portal (defproc.gov.in)',
  'Delhi e-Procure (govtprocurement.delhi.gov.in)',
  'Goa e-Procurement (eprocure.goa.gov.in)',
  'Government e-Marketplace (gem.gov.in)',
  'Gujarat (n)Procure (tender.nprocure.com)',
  'Haryana e-Procurement (etenders.hry.nic.in)',
  'IREPS Railways (ireps.gov.in)',
  'J&K e-Procurement (jktenders.gov.in)',
  'Jharkhand e-Procure (jharkhandtenders.gov.in)',
  'Karnataka KPPP (kppp.karnataka.gov.in)',
  'Kerala e-Tenders (etenders.kerala.gov.in)',
  'MP Tenders (mptenders.gov.in)',
  'MahaTenders (mahatenders.gov.in)',
  'Odisha Tenders (tendersodisha.gov.in)',
  'Open Government Data Platform India (data.gov.in)',
  'Punjab e-Procurement (eproc.punjab.gov.in)',
  'Rajasthan e-Procure (eproc.rajasthan.gov.in)',
  'Tamil Nadu Tenders (tntenders.gov.in)',
  'Telangana e-Procurement (tender.telangana.gov.in)',
  'UP e-Procure (etender.up.nic.in)',
  'Uttarakhand e-Tenders (uktenders.gov.in)',
  'West Bengal Tenders (wbtenders.gov.in)'
];

/**
 * Helper to normalize any incoming portal string into the canonical 28 statutory portals
 */
export const canonicalizePortalSource = (portal?: string): string => {
  const p = (portal || '').toLowerCase();
  if (p.includes('andaman')) return 'Andaman & Nicobar e-Procure (eproc.andaman.gov.in)';
  if (p.includes('apeprocurement') || p.includes('andhra')) return 'Andhra Pradesh e-Procure (tender.apeprocurement.gov.in)';
  if (p.includes('assamtenders') || p.includes('assam')) return 'Assam Tenders (assamtenders.gov.in)';
  if (p.includes('bihar')) return 'Bihar e-Procure (eproc2.bihar.gov.in)';
  if (p.includes('cpwd') || p.includes('tenderwizard')) return 'CPWD TenderWizard (tenderwizard.com/CPWD)';
  if (p.includes('defproc') || p.includes('defense') || p.includes('defence')) return 'Defense Procurement Portal (defproc.gov.in)';
  if (p.includes('delhi') || p.includes('dmrc')) return 'Delhi e-Procure (govtprocurement.delhi.gov.in)';
  if (p.includes('goa')) return 'Goa e-Procurement (eprocure.goa.gov.in)';
  if (p.includes('gem') || p.includes('marketplace')) return 'Government e-Marketplace (gem.gov.in)';
  if (p.includes('nprocure') || p.includes('gujarat')) return 'Gujarat (n)Procure (tender.nprocure.com)';
  if (p.includes('hry.nic.in') || p.includes('haryana')) return 'Haryana e-Procurement (etenders.hry.nic.in)';
  if (p.includes('ireps') || p.includes('railway')) return 'IREPS Railways (ireps.gov.in)';
  if (p.includes('jktenders') || p.includes('kashmir') || p.includes('j&k')) return 'J&K e-Procurement (jktenders.gov.in)';
  if (p.includes('jharkhand')) return 'Jharkhand e-Procure (jharkhandtenders.gov.in)';
  if (p.includes('kppp') || p.includes('karnataka')) return 'Karnataka KPPP (kppp.karnataka.gov.in)';
  if (p.includes('kerala')) return 'Kerala e-Tenders (etenders.kerala.gov.in)';
  if (p.includes('mptenders') || p.includes('madhya')) return 'MP Tenders (mptenders.gov.in)';
  if (p.includes('mahatenders') || p.includes('maharashtra')) return 'MahaTenders (mahatenders.gov.in)';
  if (p.includes('odisha')) return 'Odisha Tenders (tendersodisha.gov.in)';
  if (p.includes('data.gov.in') || p.includes('ogd') || p.includes('open data')) return 'Open Government Data Platform India (data.gov.in)';
  if (p.includes('punjab')) return 'Punjab e-Procurement (eproc.punjab.gov.in)';
  if (p.includes('rajasthan')) return 'Rajasthan e-Procure (eproc.rajasthan.gov.in)';
  if (p.includes('tntenders') || p.includes('tamil')) return 'Tamil Nadu Tenders (tntenders.gov.in)';
  if (p.includes('telangana')) return 'Telangana e-Procurement (tender.telangana.gov.in)';
  if (p.includes('etender.up') || p.includes('up e-procure') || p.includes('up e-procurement')) return 'UP e-Procure (etender.up.nic.in)';
  if (p.includes('uktenders') || p.includes('uttarakhand') || p.includes('hptenders') || p.includes('himachal')) return 'Uttarakhand e-Tenders (uktenders.gov.in)';
  if (p.includes('wbtenders') || p.includes('bengal')) return 'West Bengal Tenders (wbtenders.gov.in)';
  return 'Central Public Procurement Portal (eprocure.gov.in)';
};

/**
 * Strict statutory mapping from State Portals to their sovereign State.
 * Statutory state procurement portals are legally bound to their respective State.
 */
export const STATUTORY_PORTAL_TO_STATE_MAP: Record<string, string> = {
  'Andaman & Nicobar e-Procure (eproc.andaman.gov.in)': 'Andaman & Nicobar',
  'Andhra Pradesh e-Procure (tender.apeprocurement.gov.in)': 'Andhra Pradesh',
  'Assam Tenders (assamtenders.gov.in)': 'Assam',
  'Bihar e-Procure (eproc2.bihar.gov.in)': 'Bihar',
  'Delhi e-Procure (govtprocurement.delhi.gov.in)': 'Delhi',
  'Goa e-Procurement (eprocure.goa.gov.in)': 'Goa',
  'Gujarat (n)Procure (tender.nprocure.com)': 'Gujarat',
  'Haryana e-Procurement (etenders.hry.nic.in)': 'Haryana',
  'J&K e-Procurement (jktenders.gov.in)': 'Jammu & Kashmir',
  'Jharkhand e-Procure (jharkhandtenders.gov.in)': 'Jharkhand',
  'Karnataka KPPP (kppp.karnataka.gov.in)': 'Karnataka',
  'Kerala e-Tenders (etenders.kerala.gov.in)': 'Kerala',
  'MP Tenders (mptenders.gov.in)': 'Madhya Pradesh',
  'MahaTenders (mahatenders.gov.in)': 'Maharashtra',
  'Odisha Tenders (tendersodisha.gov.in)': 'Odisha',
  'Punjab e-Procurement (eproc.punjab.gov.in)': 'Punjab',
  'Rajasthan e-Procure (eproc.rajasthan.gov.in)': 'Rajasthan',
  'Tamil Nadu Tenders (tntenders.gov.in)': 'Tamil Nadu',
  'Telangana e-Procurement (tender.telangana.gov.in)': 'Telangana',
  'UP e-Procure (etender.up.nic.in)': 'Uttar Pradesh',
  'Uttarakhand e-Tenders (uktenders.gov.in)': 'Uttarakhand',
  'West Bengal Tenders (wbtenders.gov.in)': 'West Bengal'
};

/**
 * Returns the strictly bound State for state-specific statutory portals.
 * Returns null for Central/Pan-India portals (CPPP, GeM, CPWD, IREPS, defproc, data.gov.in).
 */
export const getPortalBoundState = (portal?: string): string | null => {
  if (!portal) return null;
  const canonical = canonicalizePortalSource(portal);
  return STATUTORY_PORTAL_TO_STATE_MAP[canonical] || null;
};

export const REAL_PORTAL_SOURCES: PortalSourceInfo[] = [
  // 1. Central CPPP
  {
    id: 'cppp',
    name: 'Central Public Procurement Portal (CPPP)',
    domain: 'eprocure.gov.in',
    url: 'https://eprocure.gov.in/eprocure/app',
    category: 'Central',
    state: 'Pan-India / Central',
    region: 'National',
    description: 'India\'s nodal statutory public procurement portal administered by the National Informatics Centre (NIC) under Ministry of Finance guidelines, covering all Union Ministries, Central PSUs, and national highway authorities.',
    keyAuthorities: ['NHAI', 'MoRTH', 'NHIDCL', 'DDA', 'Engineers India (EIL)', 'BSF / ITBP', 'ASI'],
    procurementTypes: ['National Expressways', 'Strategic Himalayan Tunnels', 'Petrochemical EPC', 'Central Infrastructure'],
    statutoryFramework: 'NIC-GEP • GFR 2017 Rule 144 • CVC Guidelines',
    status: 'LIVE',
    activeCountEstimate: 512
  },

  // 2. MahaTenders
  {
    id: 'mahatenders',
    name: 'MahaTenders (Govt of Maharashtra e-Procurement)',
    domain: 'mahatenders.gov.in',
    url: 'https://mahatenders.gov.in/nicgep/app',
    category: 'State',
    state: 'Maharashtra',
    region: 'West',
    description: 'Official statutory e-procurement portal for Maharashtra state departments, urban development authorities, municipal corporations, and mega arterial expressway corporations.',
    keyAuthorities: ['MahaPWD', 'MSRDC', 'MMRDA', 'PMC Projects', 'PCMC', 'PMRDA', 'CIDCO', 'MahaMetro'],
    procurementTypes: ['Expressways & Sea Links', 'Metro Rail Lines', 'Urban Flyovers', 'Jal Jeevan Bulk Water', 'Smart Cities'],
    statutoryFramework: 'Maha Govt e-Tendering Act • NIC-GEP • PWD Manual',
    status: 'LIVE',
    activeCountEstimate: 420
  },

  // 3. GeM (Government e-Marketplace)
  {
    id: 'gem',
    name: 'Government e-Marketplace (GeM)',
    domain: 'gem.gov.in',
    url: 'https://gem.gov.in',
    category: 'Central',
    state: 'Pan-India / Central',
    region: 'National',
    description: 'National public procurement portal for common-use goods and services created under the Ministry of Commerce & Industry, mandating transparent statutory digital bidding.',
    keyAuthorities: ['NTPC Limited', 'PowerGrid (PGCIL)', 'BHEL', 'ONGC', 'IOCL', 'SAIL', 'GAIL', 'Coal India'],
    procurementTypes: ['Renewable Energy (Solar/Wind)', '765kV GIS Substations', 'Thermal BOP Civil', 'Cross-Country Pipelines'],
    statutoryFramework: 'GeM SPV Guidelines • GFR Rule 149 • Public Procurement Policy',
    status: 'LIVE',
    activeCountEstimate: 380
  },

  // 4. IREPS (Indian Railways)
  {
    id: 'ireps',
    name: 'IREPS (Indian Railways e-Procurement System)',
    domain: 'ireps.gov.in',
    url: 'https://www.ireps.gov.in',
    category: 'Railways',
    state: 'Pan-India / Central',
    region: 'National',
    description: 'Statutory unified procurement platform of Indian Railways, Dedicated Freight Corridor (DFCCIL), and Railway PSUs for track works, rolling stock, KAVACH safety systems, and station redevelopment.',
    keyAuthorities: ['Northern Railway', 'Central Railway', 'Western Railway', 'DFCCIL', 'RVNL', 'RailTel', 'IRCON'],
    procurementTypes: ['KAVACH Train Protection', 'Track Doubling & Quadrupling', 'Rail Viaducts & Bridges', 'PEB Workshop Sheds'],
    statutoryFramework: 'Ministry of Railways Engineering Code • CRIS Managed',
    status: 'LIVE',
    activeCountEstimate: 295
  },

  // 5. CPWD TenderWizard
  {
    id: 'cpwd',
    name: 'CPWD TenderWizard / CPPP',
    domain: 'tenderwizard.com/CPWD',
    url: 'https://tenderwizard.com/CPWD/',
    category: 'Central',
    state: 'Pan-India / Central',
    region: 'National',
    description: 'Statutory procurement portal of the Central Public Works Department (MoHUA), executing Central Vista redevelopment, AIIMS hospitals, IIT/IIM educational institutions, and high-security civil complexes.',
    keyAuthorities: ['CPWD Northern Zone', 'CPWD Western Zone', 'CPWD Southern Zone', 'CPWD Eastern Zone', 'NBCC India Ltd'],
    procurementTypes: ['AIIMS Super-Specialty Hospitals', 'IIT/IIM Institutional Campuses', 'Central Vista Projects', 'High-Rise Administrative Towers'],
    statutoryFramework: 'CPWD Works Manual 2019 • GFR 2017 • MES Standards',
    status: 'LIVE',
    activeCountEstimate: 185
  },

  // 6. Delhi e-Procure / DMRC
  {
    id: 'delhi',
    name: 'Delhi e-Procure / DMRC Portal',
    domain: 'govtprocurement.delhi.gov.in',
    url: 'https://govtprocurement.delhi.gov.in/nicgep/app',
    category: 'State',
    state: 'Delhi',
    region: 'North',
    description: 'Official statutory portal of the Government of NCT of Delhi and Delhi Metro Rail Corporation for underground tunneling, water treatment plants, and multi-modal transport hubs.',
    keyAuthorities: ['Delhi Metro Rail Corp (DMRC)', 'Delhi Jal Board (DJB)', 'Delhi PWD', 'Delhi Transport Corp (DTC)'],
    procurementTypes: ['Metro Phase-IV Tunnels & Stations', 'Water Treatment & Interceptor Sewers', 'Elevated Arterials', 'EV Bus Depots'],
    statutoryFramework: 'Delhi Procurement Rules • NIC-GEP System',
    status: 'LIVE',
    activeCountEstimate: 140
  },

  // 7. UP e-Procure
  {
    id: 'up',
    name: 'Uttar Pradesh e-Procure (etender.up.nic.in)',
    domain: 'etender.up.nic.in',
    url: 'https://etender.up.nic.in/nicgep/app',
    category: 'State',
    state: 'Uttar Pradesh',
    region: 'North',
    description: 'Statutory procurement engine for India\'s most populous state, driving mega expressways (Ganga, Bundelkhand, Purvanchal), Har Ghar Jal schemes, and Noida Industrial Authority packages.',
    keyAuthorities: ['UP PWD', 'UPEIDA Expressways', 'UP Jal Nigam', 'Noida Authority', 'Ayodhya Development Authority (ADA)'],
    procurementTypes: ['Ganga Expressway Packages', 'Har Ghar Jal Water Networks', 'Grade Separators & Flyovers', 'Heritage Corridors'],
    statutoryFramework: 'UP Procurement Guidelines • NIC-GEP • PWD Code',
    status: 'LIVE',
    activeCountEstimate: 210
  },

  // 8. Tamil Nadu Tenders
  {
    id: 'tamilnadu',
    name: 'Tamil Nadu State Tenders (tntenders.gov.in)',
    domain: 'tntenders.gov.in',
    url: 'https://tntenders.gov.in/nicgep/app',
    category: 'State',
    state: 'Tamil Nadu',
    region: 'South',
    description: 'Statutory procurement system for the Government of Tamil Nadu, Chennai Metro Rail (CMRL), Tamil Nadu Water Supply & Drainage (TWAD), and TANGEDCO power infrastructure.',
    keyAuthorities: ['TN Highways & Minor Ports', 'CMRL Chennai Metro', 'TWAD Board', 'TANGEDCO', 'Greater Chennai Corporation'],
    procurementTypes: ['Metro Underground Packages', 'Coastal Desalination Plants', 'Multi-Lane Ring Roads', 'Thermal & Solar Power'],
    statutoryFramework: 'Tamil Nadu Transparency in Tenders Act 1998 • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 165
  },

  // 9. Karnataka KPPP
  {
    id: 'karnataka',
    name: 'Karnataka KPPP (Karnataka Public Procurement Portal)',
    domain: 'kppp.karnataka.gov.in',
    url: 'https://kppp.karnataka.gov.in',
    category: 'State',
    state: 'Karnataka',
    region: 'South',
    description: 'Statutory unified state procurement platform governed by the Karnataka Transparency in Public Procurements (KTPP) Act, serving BBMP Bengaluru, BMRCL Namma Metro, and KPCL.',
    keyAuthorities: ['Karnataka PWD', 'BBMP Bengaluru', 'BMRCL Namma Metro', 'BWSSB Water Board', 'KPCL Power'],
    procurementTypes: ['Elevated Metro Viaducts', 'Bengaluru Peripheral Ring Road', 'Cauvery Water Supply Phase V', 'Substation Civil Packages'],
    statutoryFramework: 'KTPP Act 1999 & Rules 2000 • Centre for e-Governance',
    status: 'LIVE',
    activeCountEstimate: 175
  },

  // 10. Gujarat (n)Procure
  {
    id: 'gujarat',
    name: 'Gujarat (n)Procure e-Tendering System',
    domain: 'tender.nprocure.com',
    url: 'https://tender.nprocure.com',
    category: 'State',
    state: 'Gujarat',
    region: 'West',
    description: 'Dedicated statutory e-procurement portal for the Government of Gujarat, Gujarat Metro Rail (GMRC), Sardar Sarovar Narmada Nigam, and GWSSB.',
    keyAuthorities: ['Gujarat Roads & Buildings (R&B)', 'GMRC Metro', 'Sardar Sarovar Nigam (SSNNL)', 'GWSSB Water Supply', 'GIDC'],
    procurementTypes: ['Metro Phase II Ahmedabad-Gandhinagar', 'Canal Distribution Networks', 'Industrial Estate Roads', 'Coastal Ports'],
    statutoryFramework: '(n)Code Solutions PKI • Gujarat Public Works Code',
    status: 'LIVE',
    activeCountEstimate: 145
  },

  // 11. West Bengal Tenders
  {
    id: 'westbengal',
    name: 'West Bengal e-Tenders (wbtenders.gov.in)',
    domain: 'wbtenders.gov.in',
    url: 'https://wbtenders.gov.in/nicgep/app',
    category: 'State',
    state: 'West Bengal',
    region: 'East & Central',
    description: 'Statutory e-tendering portal of the Government of West Bengal, Kolkata Metropolitan Development Authority (KMDA), and West Bengal State Electricity (WBSEDCL).',
    keyAuthorities: ['WB PWD', 'KMDA Kolkata', 'HIDCO New Town', 'WBSEDCL Power', 'Irrigation & Waterways Dept'],
    procurementTypes: ['Urban Flyovers & Elevated Corridors', 'River Embankments & Flood Control', 'Smart Township Roads', 'Bridge Rehabilitation'],
    statutoryFramework: 'WB Financial Rules • NIC-GEP System',
    status: 'LIVE',
    activeCountEstimate: 130
  },

  // 12. Rajasthan e-Procure
  {
    id: 'rajasthan',
    name: 'Rajasthan e-Procure (eproc.rajasthan.gov.in)',
    domain: 'eproc.rajasthan.gov.in',
    url: 'https://eproc.rajasthan.gov.in/nicgep/app',
    category: 'State',
    state: 'Rajasthan',
    region: 'West',
    description: 'Official statutory platform under Rajasthan Transparency in Public Procurement (RTPP) Act, driving canal networks, solar parks, and RIICO industrial corridors.',
    keyAuthorities: ['Rajasthan PWD', 'Public Health Engineering (PHED)', 'RIICO Industrial', 'Indira Gandhi Canal Board'],
    procurementTypes: ['Desert Highway Corridors', 'Canal Lining & Lift Irrigation', 'Solar Park Civil Works', 'Drinking Water Pipelines'],
    statutoryFramework: 'RTPP Act 2012 & Rules 2013 • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 125
  },

  // 13. Kerala e-Tenders
  {
    id: 'kerala',
    name: 'Kerala e-Tenders (etenders.kerala.gov.in)',
    domain: 'etenders.kerala.gov.in',
    url: 'https://etenders.kerala.gov.in/nicgep/app',
    category: 'State',
    state: 'Kerala',
    region: 'South',
    description: 'Statutory e-procurement portal for Kerala PWD, Kochi Metro (KMRL), Kerala Water Authority (KWA), and coastal/backwater infrastructure development.',
    keyAuthorities: ['Kerala PWD', 'Kochi Metro (KMRL)', 'Kerala Water Authority (KWA)', 'KSEB Power', 'KINFRA'],
    procurementTypes: ['Kochi Water Metro Jetties', 'Hill Highway & Coastal Highway', 'Water Treatment Works', 'IT Park Infrastructure'],
    statutoryFramework: 'Kerala PWD Manual • NIC-GEP System',
    status: 'LIVE',
    activeCountEstimate: 110
  },

  // 14. Telangana e-Procurement
  {
    id: 'telangana',
    name: 'Telangana e-Procurement Portal',
    domain: 'tender.telangana.gov.in',
    url: 'https://tender.telangana.gov.in',
    category: 'State',
    state: 'Telangana',
    region: 'South',
    description: 'Pioneering statutory electronic procurement platform of the Government of Telangana, executing Kaleshwaram Lift Irrigation, GHMC Hyderabad, and HMDA strategic road projects.',
    keyAuthorities: ['Irrigation & CAD Dept', 'Roads & Buildings (R&B)', 'GHMC Hyderabad', 'HMDA Regional Authority'],
    procurementTypes: ['Strategic Road Development Plan (SRDP)', 'Lift Irrigation Barrages & Tunnels', 'Hyderabad Metro Phase II', 'Bulk Water Transmission'],
    statutoryFramework: 'Telangana Procurement Guidelines • TSTS Managed',
    status: 'LIVE',
    activeCountEstimate: 150
  },

  // 15. Andhra Pradesh e-Procurement
  {
    id: 'andhra',
    name: 'Andhra Pradesh e-Procurement Portal',
    domain: 'tender.apeprocurement.gov.in',
    url: 'https://tender.apeprocurement.gov.in',
    category: 'State',
    state: 'Andhra Pradesh',
    region: 'South',
    description: 'Statutory portal for Andhra Pradesh Water Resources (Polavaram Dam Project), AP Transco, and Amaravati Capital Region Development Authority (APCRDA).',
    keyAuthorities: ['Water Resources Dept (Polavaram)', 'R&B Andhra Pradesh', 'AP Transco & Genco', 'APCRDA Amaravati'],
    procurementTypes: ['Major Irrigation Spillways & Diaphragm Walls', 'Capital City Arterials', 'Coastal Port Access Roads', 'EHV Substations'],
    statutoryFramework: 'AP e-Governance Council Guidelines',
    status: 'LIVE',
    activeCountEstimate: 135
  },

  // 16. Madhya Pradesh Tenders
  {
    id: 'mp',
    name: 'MP Tenders (mptenders.gov.in)',
    domain: 'mptenders.gov.in',
    url: 'https://mptenders.gov.in/nicgep/app',
    category: 'State',
    state: 'Madhya Pradesh',
    region: 'East & Central',
    description: 'Statutory e-tendering system of Madhya Pradesh for Madhya Pradesh Road Development Corp (MPRDC), Narmada Valley Development, and Jal Nigam.',
    keyAuthorities: ['MPRDC Roads Corp', 'MP PWD', 'Narmada Valley Dev (NVDA)', 'MP Jal Nigam', 'Bhopal Smart City'],
    procurementTypes: ['Atal Pragati Path Corridors', 'Narmada Basin Lift Irrigation', 'Rural Tap Water Networks', 'Metro Civil Works'],
    statutoryFramework: 'MP Works Dept Manual • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 115
  },

  // 17. Odisha Tenders
  {
    id: 'odisha',
    name: 'Odisha Tenders (tendersodisha.gov.in)',
    domain: 'tendersodisha.gov.in',
    url: 'https://tendersodisha.gov.in/nicgep/app',
    category: 'State',
    state: 'Odisha',
    region: 'East & Central',
    description: 'Statutory portal for Odisha Works Department, OBCC, IDCO, and Biju Expressway mining and industrial infrastructure corridors.',
    keyAuthorities: ['Odisha Works Dept', 'OBCC Corporation', 'Water Resources Odisha', 'IDCO Industrial Dev'],
    procurementTypes: ['Biju Expressway Corridors', 'Coastal Port Evacuation Roads', 'Cyclone-Resilient Bridges', 'In-Stream Barrages'],
    statutoryFramework: 'Odisha Public Works Code • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 95
  },

  // 18. Bihar e-Procurement
  {
    id: 'bihar',
    name: 'Bihar e-Procurement 2 (eproc2.bihar.gov.in)',
    domain: 'eproc2.bihar.gov.in',
    url: 'https://eproc2.bihar.gov.in',
    category: 'State',
    state: 'Bihar',
    region: 'East & Central',
    description: 'Next-generation statutory procurement platform of the Government of Bihar, Bihar State Road Development Corp (BSRDCL), and Pul Nirman Nigam.',
    keyAuthorities: ['Road Construction Dept (RCD)', 'BSRDCL', 'Bihar Rajya Pul Nirman Nigam (BRPNNL)', 'PHED Bihar'],
    procurementTypes: ['Ganga River Bridges & Elevated Roadways', 'Four-Lane State Corridors', 'Rural Connectivity Packages', 'Water Treatment'],
    statutoryFramework: 'Bihar Public Works Account Code',
    status: 'LIVE',
    activeCountEstimate: 90
  },

  // 19. Punjab e-Procurement
  {
    id: 'punjab',
    name: 'Punjab e-Procurement (eproc.punjab.gov.in)',
    domain: 'eproc.punjab.gov.in',
    url: 'https://eproc.punjab.gov.in/nicgep/app',
    category: 'State',
    state: 'Punjab',
    region: 'North',
    description: 'Statutory procurement system for Punjab PWD (B&R), Punjab Mandi Board, and Water Resources Department.',
    keyAuthorities: ['Punjab PWD (B&R)', 'Punjab Mandi Board', 'Punjab Water Supply & Sanitation', 'GMADA Mohali'],
    procurementTypes: ['Agricultural Marketing Corridors', 'State Highway Widening', 'River Canalization', 'Urban Drainage'],
    statutoryFramework: 'Punjab Financial Rules • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 85
  },

  // 20. Haryana e-Procurement
  {
    id: 'haryana',
    name: 'Haryana e-Procurement (etenders.hry.nic.in)',
    domain: 'etenders.hry.nic.in',
    url: 'https://etenders.hry.nic.in/nicgep/app',
    category: 'State',
    state: 'Haryana',
    region: 'North',
    description: 'Statutory portal for Haryana PWD, Haryana Shehri Vikas Pradhikaran (HSVP / HUDA), and Irrigation & Water Resources.',
    keyAuthorities: ['Haryana PWD (B&R)', 'HSVP (HUDA)', 'Haryana Irrigation Dept', 'GMDA Gurugram'],
    procurementTypes: ['Gurugram Southern Peripheral Road', 'Industrial Township Infrastructure', 'Canal Modernization', 'ROBs/RUBs'],
    statutoryFramework: 'Haryana Financial Rules • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 88
  },

  // 21. Assam & North East Tenders
  {
    id: 'assam',
    name: 'Assam & North East Tenders (assamtenders.gov.in)',
    domain: 'assamtenders.gov.in',
    url: 'https://assamtenders.gov.in/nicgep/app',
    category: 'State',
    state: 'Assam',
    region: 'North East',
    description: 'Statutory e-procurement portal for Assam PWD, Brahmaputra River Dredging & Embankment, and Guwahati Development Authority.',
    keyAuthorities: ['Assam PWD Roads', 'Brahmaputra Board', 'Water Resources Assam', 'Guwahati Smart City'],
    procurementTypes: ['Brahmaputra River Bridges & Embankments', 'Hilly Highway Packages', 'Flood Protection Works', 'Urban Transport'],
    statutoryFramework: 'Assam Public Procurement Rules • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 78
  },

  // 22. J&K e-Procurement
  {
    id: 'jk',
    name: 'Jammu & Kashmir e-Procurement (jktenders.gov.in)',
    domain: 'jktenders.gov.in',
    url: 'https://jktenders.gov.in/nicgep/app',
    category: 'State',
    state: 'Jammu & Kashmir',
    region: 'North',
    description: 'Official statutory portal for J&K Public Works (R&B), Jal Shakti, and Economic Reconstruction Agency (ERA) in high-altitude zones.',
    keyAuthorities: ['J&K PWD (R&B)', 'Jal Shakti Department', 'J&K ERA Agency', 'Srinagar / Jammu Smart City'],
    procurementTypes: ['High-Altitude Snow-Bound Passes', 'Valley River Dredging & Protection', 'Alpine Water Schemes', 'Tunnel Approaches'],
    statutoryFramework: 'J&K Financial Code • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 70
  },

  // 23. Uttarakhand & Himachal Tenders
  {
    id: 'himalayan',
    name: 'Uttarakhand & Himachal Tenders (uktenders & hptenders)',
    domain: 'uktenders.gov.in / hptenders.gov.in',
    url: 'https://uktenders.gov.in/nicgep/app',
    category: 'State',
    state: 'Uttarakhand',
    region: 'North',
    description: 'Statutory portals for Himalayan hill states driving Char Dham All-Weather Road, Hydroelectric Civil Packages, and landslide-mitigation works.',
    keyAuthorities: ['Uttarakhand PWD', 'HP PWD', 'Uttarakhand Peyjal Nigam', 'HP State Electricity (HPSEB)'],
    procurementTypes: ['Char Dham Road Widening', 'Landslide Slope Stabilization', 'Small Hydro Civil Tunnels', 'Gravity Water Networks'],
    statutoryFramework: 'Hill State Works Manual • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 82
  },

  // 24. Defense Procurement Portal (DefProc)
  {
    id: 'defense',
    name: 'Defense Procurement Portal (defproc.gov.in)',
    domain: 'defproc.gov.in',
    url: 'https://defproc.gov.in/nicgep/app',
    category: 'Defense & PSU',
    state: 'Pan-India / Central',
    region: 'National',
    description: 'High-security statutory procurement portal for the Ministry of Defense, Border Roads Organisation (BRO), Military Engineer Services (MES), and Indian Armed Forces.',
    keyAuthorities: ['Border Roads Organisation (BRO)', 'Military Engineer Services (MES)', 'Ordnance Factories', 'Defense Research & Dev (DRDO)'],
    procurementTypes: ['Strategic Border Pass Roads', 'Air Force Base Underground Shelters', 'Ammunition Depots & Blast Fences', 'Naval Dry Docks'],
    statutoryFramework: 'Defense Procurement Procedure (DAP 2020) • NIC-GEP High Security',
    status: 'LIVE',
    activeCountEstimate: 110
  },

  // 25. Oil, Gas & Petrochemicals
  {
    id: 'oilgas',
    name: 'Oil & Gas e-Procurement (IOCL / ONGC)',
    domain: 'iocletenders.nic.in',
    url: 'https://iocletenders.nic.in/nicgep/app',
    category: 'Defense & PSU',
    state: 'Pan-India / Central',
    region: 'National',
    description: 'Statutory procurement portal for India\'s state-owned oil and gas majors executing refinery expansions, offshore platforms, LNG terminals, and petroleum retail depots.',
    keyAuthorities: ['Indian Oil Corp (IOCL)', 'ONGC Limited', 'Bharat Petroleum (BPCL)', 'Hindustan Petroleum (HPCL)', 'GAIL India'],
    procurementTypes: ['POL Storage Terminal Civil Foundations', 'Firewater Pumping Systems & Networks', 'LPG Bottling Plants', 'Cross-Country Trenching'],
    statutoryFramework: 'Petroleum & Natural Gas Regulatory Board (PNGRB) • CVC Guidelines',
    status: 'LIVE',
    activeCountEstimate: 98
  },

  // 26. Open Government Data Platform India (data.gov.in)
  {
    id: 'ogd',
    name: 'Open Government Data Platform India (data.gov.in)',
    domain: 'data.gov.in',
    url: 'https://data.gov.in',
    category: 'Open Data',
    state: 'Pan-India / Central',
    region: 'National',
    description: 'National Open Data Initiative under the National Data Sharing and Accessibility Policy (NDSAP), publishing statutory procurement datasets, departmental notifications, and open public tender feeds.',
    keyAuthorities: ['Ministry of Electronics & IT (MeitY)', 'National Informatics Centre (NIC)', 'Department of Expenditure'],
    procurementTypes: ['Statutory Open Data Dumps', 'Departmental Tender Gazette Feeds', 'Public Notification Channels', 'Open Contract Records'],
    statutoryFramework: 'NDSAP Policy • Open Data Commons (ODC-By) Standard',
    status: 'LIVE',
    activeCountEstimate: 120
  },

  // 27. Goa e-Procurement
  {
    id: 'goa',
    name: 'Goa e-Procurement (eprocure.goa.gov.in)',
    domain: 'eprocure.goa.gov.in',
    url: 'https://eprocure.goa.gov.in/nicgep/app',
    category: 'State',
    state: 'Goa',
    region: 'West',
    description: 'Official statutory platform for the Government of Goa, Goa PWD, and Goa State Infrastructure Development Corporation (GSIDC).',
    keyAuthorities: ['Goa PWD', 'GSIDC Corporation', 'Water Resources Goa', 'Mormugao Port Authority'],
    procurementTypes: ['Zuari & Mandovi River Bridges', 'Coastal Tourism Corridors', 'Heritage Fort Restoration', 'Desalination Works'],
    statutoryFramework: 'Goa Public Works Manual • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 45
  },

  // 28. Jharkhand e-Procure
  {
    id: 'jharkhand',
    name: 'Jharkhand e-Procure (jharkhandtenders.gov.in)',
    domain: 'jharkhandtenders.gov.in',
    url: 'https://jharkhandtenders.gov.in/nicgep/app',
    category: 'State',
    state: 'Jharkhand',
    region: 'East & Central',
    description: 'Statutory procurement portal for Jharkhand Road Construction Department (RCD), JUIDCO urban infrastructure, and Drinking Water & Sanitation.',
    keyAuthorities: ['Jharkhand RCD', 'JUIDCO Urban Infra', 'Drinking Water & Sanitation Dept', 'Ranchi Smart City'],
    procurementTypes: ['Mining Corridor Expressways', 'Ring Road Packages', 'Subernarekha Multi-Purpose Project', 'Urban Water Supply'],
    statutoryFramework: 'Jharkhand PWD Code • NIC-GEP',
    status: 'LIVE',
    activeCountEstimate: 62
  }
];
