import { fetchContractorPools } from '../services/api';

export interface PoolContractor {
  name: string;
  hq: string;
  cls: string;
  turnoverCr: number;
}

export const CONTRACTOR_POOLS: Record<string, PoolContractor[]> = {
  'Civil & Infrastructure': [
    { name: 'B.G. Shirke Construction Technology Pvt. Ltd.', hq: 'Pune, Maharashtra', cls: 'Super Class-I PWD', turnoverCr: 3820 },
    { name: 'T&T Infra Limited', hq: 'Pune, Maharashtra', cls: 'Class-I PWD', turnoverCr: 1850 },
    { name: 'Ashoka Buildcon Limited', hq: 'Nashik, Maharashtra', cls: 'Class-I A National', turnoverCr: 6800 },
    { name: 'Dilip Buildcon Limited (DBL)', hq: 'Bhopal, Madhya Pradesh', cls: 'Class-I A EPC', turnoverCr: 9500 },
    { name: 'Larsen & Toubro Limited (L&T)', hq: 'Mumbai, Maharashtra', cls: 'Super Class-I Tier-1', turnoverCr: 18500 },
    { name: 'Tata Projects Limited', hq: 'Mumbai / Noida', cls: 'Super Class-I Tier-1', turnoverCr: 14200 },
    { name: 'J. Kumar Infraprojects Limited', hq: 'Mumbai, Maharashtra', cls: 'Class-I A Metro/Flyover', turnoverCr: 4210 },
    { name: 'KNR Constructions Limited', hq: 'Hyderabad, Telangana', cls: 'Class-I Highway EPC', turnoverCr: 3900 },
    { name: 'Montecarlo Limited', hq: 'Ahmedabad, Gujarat', cls: 'Class-I Civil', turnoverCr: 4600 }
  ],
  'Highways, Metros & Rail Transport': [
    { name: 'Dilip Buildcon Limited (DBL)', hq: 'Bhopal, Madhya Pradesh', cls: 'Class-I A EPC', turnoverCr: 9500 },
    { name: 'Ashoka Buildcon Limited', hq: 'Nashik, Maharashtra', cls: 'Class-I A National', turnoverCr: 6800 },
    { name: 'Larsen & Toubro Limited (Heavy Civil)', hq: 'Chennai / Mumbai', cls: 'Super Class-I Tier-1', turnoverCr: 18500 },
    { name: 'GR Infraprojects Limited', hq: 'Udaipur, Rajasthan', cls: 'Class-I A Highway BOT', turnoverCr: 7900 },
    { name: 'Afcons Infrastructure Limited', hq: 'Mumbai, Maharashtra', cls: 'Class-I Viaduct & Marine', turnoverCr: 11800 },
    { name: 'Megha Engineering & Infrastructures (MEIL)', hq: 'Hyderabad, Telangana', cls: 'Super Class-I EPC', turnoverCr: 21000 },
    { name: 'IRB Infrastructure Developers Ltd.', hq: 'Mumbai, Maharashtra', cls: 'Class-I Expressway BOT', turnoverCr: 6400 }
  ],
  'Healthcare, Medical & Hospital Infra': [
    { name: 'Siemens Healthcare Private Limited', hq: 'Bengaluru / Gurugram', cls: 'Tier-1 MedTech OEM', turnoverCr: 6400 },
    { name: 'GE Precision Healthcare India Ltd.', hq: 'Bengaluru, Karnataka', cls: 'Tier-1 Imaging & ICU', turnoverCr: 7200 },
    { name: 'Philips India Limited (Healthcare Div)', hq: 'Gurugram, Haryana', cls: 'Tier-1 Diagnostic OEM', turnoverCr: 5800 },
    { name: 'Allengers Medical Systems Limited', hq: 'Chandigarh, UT', cls: 'Class-I Medical Devices', turnoverCr: 1450 },
    { name: 'Wipro GE Healthcare Private Limited', hq: 'Bengaluru, Karnataka', cls: 'Class-I Medical Systems', turnoverCr: 4900 },
    { name: 'Mindray Medical India Pvt. Ltd.', hq: 'Gurugram, NCR', cls: 'Class-I OT Equipment', turnoverCr: 1100 }
  ],
  'Defence, Border Security & Paramilitary': [
    { name: 'Bharat Electronics Limited (BEL)', hq: 'Bengaluru, Karnataka', cls: 'Navratna Defence PSU', turnoverCr: 19800 },
    { name: 'Tata Advanced Systems Limited (TASL)', hq: 'Hyderabad, Telangana', cls: 'Tier-1 Defence Private', turnoverCr: 6200 },
    { name: 'Larsen & Toubro Limited (Defence IC)', hq: 'Mumbai, Maharashtra', cls: 'Super Class-I Strategic', turnoverCr: 8400 },
    { name: 'BEML Limited', hq: 'Bengaluru, Karnataka', cls: 'Defence Mobility PSU', turnoverCr: 4300 },
    { name: 'Zen Technologies Limited', hq: 'Hyderabad, Telangana', cls: 'Defence Systems & Radars', turnoverCr: 890 },
    { name: 'Hindustan Aeronautics Limited (HAL)', hq: 'Bengaluru, Karnataka', cls: 'Maharatna Aerospace', turnoverCr: 26000 }
  ],
  'Atomic Energy, Power & Grid Infra': [
    { name: 'Bharat Heavy Electricals Limited (BHEL)', hq: 'New Delhi / Bhopal', cls: 'Maharatna Power PSU', turnoverCr: 23500 },
    { name: 'Power Grid Corporation of India', hq: 'Gurugram, Haryana', cls: 'Maharatna T&D', turnoverCr: 45000 },
    { name: 'ABB India Limited', hq: 'Bengaluru, Karnataka', cls: 'Tier-1 Substation GIS', turnoverCr: 9800 },
    { name: 'Siemens Energy India Limited', hq: 'Mumbai, Maharashtra', cls: 'Tier-1 Grid Substation', turnoverCr: 8600 },
    { name: 'Kalpataru Projects International Ltd.', hq: 'Gandhinagar / Mumbai', cls: 'Class-I Power Transmission', turnoverCr: 14200 },
    { name: 'KEC International Limited', hq: 'Mumbai, Maharashtra', cls: 'Class-I Substation EPC', turnoverCr: 16500 }
  ],
  'IT, Telecom & Semiconductor Works': [
    { name: 'Tata Consultancy Services Limited (TCS)', hq: 'Mumbai, Maharashtra', cls: 'Tier-1 Global IT System', turnoverCr: 240000 },
    { name: 'Infosys Limited', hq: 'Bengaluru, Karnataka', cls: 'Tier-1 Enterprise Cloud', turnoverCr: 153000 },
    { name: 'Wipro Limited', hq: 'Bengaluru, Karnataka', cls: 'Tier-1 Digital & Infra', turnoverCr: 89000 },
    { name: 'Tech Mahindra Limited', hq: 'Pune, Maharashtra', cls: 'Tier-1 Telecom & Cloud', turnoverCr: 53000 },
    { name: 'HFCL Limited (Himachal Futuristic)', hq: 'New Delhi', cls: 'Class-I OFC & 5G Telecom', turnoverCr: 4800 },
    { name: 'ITI Limited', hq: 'Bengaluru, Karnataka', cls: 'Telecom PSU (Govt of India)', turnoverCr: 1750 }
  ],
  'Ports, Shipping & Maritime Works': [
    { name: 'Dredging Corporation of India Ltd.', hq: 'Visakhapatnam, AP', cls: 'Maritime PSU', turnoverCr: 1100 },
    { name: 'Adani Ports & Special Economic Zone', hq: 'Ahmedabad, Gujarat', cls: 'Port & Dredging EPC', turnoverCr: 22000 },
    { name: 'ITD Cementation India Limited', hq: 'Mumbai, Maharashtra', cls: 'Class-I Maritime & Jetty', turnoverCr: 5400 },
    { name: 'Afcons Infrastructure Limited', hq: 'Mumbai, Maharashtra', cls: 'Class-I Marine & Berth', turnoverCr: 11800 },
    { name: 'Essar Ports EPC Private Limited', hq: 'Mumbai / Hazira', cls: 'Deep Sea Terminal EPC', turnoverCr: 3200 }
  ],
  'Central Government Procurement': [
    { name: 'NBCC (India) Limited', hq: 'New Delhi', cls: 'Navratna Project PSU', turnoverCr: 9400 },
    { name: 'Ahluwalia Contracts (India) Limited', hq: 'New Delhi', cls: 'Class-I CPWD Super', turnoverCr: 2800 },
    { name: 'Bridge and Roof Company (India) Ltd.', hq: 'Kolkata, West Bengal', cls: 'Miniratna Central PSU', turnoverCr: 3200 },
    { name: 'PSP Projects Limited', hq: 'Ahmedabad, Gujarat', cls: 'Class-I Institutional', turnoverCr: 2100 },
    { name: 'Larsen & Toubro Limited', hq: 'Mumbai, Maharashtra', cls: 'Super Class-I Tier-1', turnoverCr: 18500 },
    { name: 'Tata Projects Limited', hq: 'Mumbai / Noida', cls: 'Super Class-I Tier-1', turnoverCr: 14200 }
  ]
};

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
  if (CONTRACTOR_POOLS[category] && CONTRACTOR_POOLS[category].length > 0) {
    return CONTRACTOR_POOLS[category];
  }
  const catLower = (category || '').toLowerCase();
  if (catLower.includes('health') || catLower.includes('medical')) {
    return CONTRACTOR_POOLS['Healthcare, Medical & Hospital Infra'] || [];
  }
  if (catLower.includes('defence') || catLower.includes('security') || catLower.includes('police')) {
    return CONTRACTOR_POOLS['Defence, Border Security & Paramilitary'] || [];
  }
  if (catLower.includes('highway') || catLower.includes('metro') || catLower.includes('rail')) {
    return CONTRACTOR_POOLS['Highways, Metros & Rail Transport'] || [];
  }
  if (catLower.includes('power') || catLower.includes('atomic') || catLower.includes('grid')) {
    return CONTRACTOR_POOLS['Atomic Energy, Power & Grid Infra'] || [];
  }
  if (catLower.includes('it') || catLower.includes('telecom') || catLower.includes('semiconductor')) {
    return CONTRACTOR_POOLS['IT, Telecom & Semiconductor Works'] || [];
  }
  if (catLower.includes('port') || catLower.includes('marine') || catLower.includes('ship')) {
    return CONTRACTOR_POOLS['Ports, Shipping & Maritime Works'] || [];
  }
  return CONTRACTOR_POOLS['Civil & Infrastructure'] || [];
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
