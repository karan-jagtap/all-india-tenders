export const VALUE_RANGE_OPTIONS = [
  { value: 'ALL', label: 'All Estimated Values' },
  { value: 'CLOSING_SOON', label: '⚡ Urgent / Closing in 7 Days' },
  { value: 'UNDER_10CR', label: '< ₹ 10 Cr (SME Tier)' },
  { value: '10CR_50CR', label: '₹ 10 Cr – ₹ 50 Cr (Medium EPC)' },
  { value: 'OVER_50CR', label: '> ₹ 50 Cr (Mega Infrastructure)' }
] as const;

export const QUICK_SECTOR_CHIPS = [
  { label: 'All Sectors', val: 'ALL' },
  { label: 'Civil & Infra', val: 'Civil & Infrastructure' },
  { label: 'Highways & Rail', val: 'Highways, Metros & Rail Transport' },
  { label: 'Water & Irrigation', val: 'Water, Irrigation & Public Health Engineering' },
  { label: 'Power & Grid', val: 'Atomic Energy, Power & Grid Infra' },
  { label: 'Healthcare Infra', val: 'Healthcare, Medical & Hospital Infra' },
  { label: 'IT & Telecom', val: 'IT, Telecom & Semiconductor Works' },
  { label: 'Ports & Maritime', val: 'Ports, Shipping & Maritime Works' }
] as const;

export const QUICK_PORTAL_PILLS = [
  {
    label: '🏛️ data.gov.in (OGD)',
    val: 'Open Government Data Platform India (data.gov.in)',
    activeClass: 'bg-cyan-500 text-slate-950 font-bold'
  },
  {
    label: 'Central CPPP',
    val: 'Central Public Procurement Portal (eprocure.gov.in)',
    activeClass: 'bg-orange-500 text-white font-bold'
  },
  {
    label: 'GeM Portal',
    val: 'Government e-Marketplace (gem.gov.in)',
    activeClass: 'bg-emerald-500 text-white font-bold'
  }
] as const;
