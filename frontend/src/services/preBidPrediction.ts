import {
  CurrentTender,
  PredictedCompetitorBid,
  ClearingProbabilityBand,
  PreBidSimulationReport
} from '../types';
import { CONTRACTOR_POOLS } from '../constants';
import { hashString, formatCr } from '../utils';

export * from '../types/prediction';

export function generatePreBidSimulation(tender: CurrentTender): PreBidSimulationReport {
  const cost = tender.estimated_cost_inr && tender.estimated_cost_inr > 0 ? tender.estimated_cost_inr : 250000000;
  const seed = hashString(tender.nit_number || tender.id || 'seed-default');

  // Find suitable pool
  let pool = CONTRACTOR_POOLS[tender.category];
  if (!pool || pool.length < 5) {
    if (tender.category.toLowerCase().includes('health') || tender.category.toLowerCase().includes('medical')) {
      pool = CONTRACTOR_POOLS['Healthcare, Medical & Hospital Infra'];
    } else if (tender.category.toLowerCase().includes('defence') || tender.category.toLowerCase().includes('police') || tender.category.toLowerCase().includes('security')) {
      pool = CONTRACTOR_POOLS['Defence, Border Security & Paramilitary'];
    } else if (tender.category.toLowerCase().includes('highway') || tender.category.toLowerCase().includes('metro') || tender.category.toLowerCase().includes('rail')) {
      pool = CONTRACTOR_POOLS['Highways, Metros & Rail Transport'];
    } else if (tender.category.toLowerCase().includes('power') || tender.category.toLowerCase().includes('atomic') || tender.category.toLowerCase().includes('grid')) {
      pool = CONTRACTOR_POOLS['Atomic Energy, Power & Grid Infra'];
    } else if (tender.category.toLowerCase().includes('it') || tender.category.toLowerCase().includes('telecom') || tender.category.toLowerCase().includes('semiconductor')) {
      pool = CONTRACTOR_POOLS['IT, Telecom & Semiconductor Works'];
    } else if (tender.category.toLowerCase().includes('port') || tender.category.toLowerCase().includes('marine') || tender.category.toLowerCase().includes('ship')) {
      pool = CONTRACTOR_POOLS['Ports, Shipping & Maritime Works'];
    } else {
      pool = CONTRACTOR_POOLS['Civil & Infrastructure'];
    }
  }

  // Shuffle pool deterministically based on seed
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i * 17) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selectedContenders = shuffled.slice(0, 5);

  const isHighAltitudeOrRemote =
    (tender.state && (tender.state.includes('Jammu') || tender.state.includes('Ladakh') || tender.state.includes('Assam') || tender.state.includes('Arunachal') || tender.state.includes('Tripura') || tender.state.includes('Andaman')));

  let baseDiscount = isHighAltitudeOrRemote ? -1.5 : -7.2;
  const seedDelta = ((seed % 35) - 15) / 10;
  const l1Discount = Number((baseDiscount + seedDelta).toFixed(2));

  const l1Quote = Math.round(cost * (1 + l1Discount / 100));

  const spreads = [
    { deltaPct: 0.0, techScore: 96.5 },
    { deltaPct: Number((0.9 + ((seed % 10) / 15)).toFixed(2)), techScore: 94.0 },
    { deltaPct: Number((2.4 + ((seed % 15) / 15)).toFixed(2)), techScore: 91.5 },
    { deltaPct: Number((4.5 + ((seed % 20) / 15)).toFixed(2)), techScore: 88.0 },
    { deltaPct: Number((7.0 + ((seed % 25) / 15)).toFixed(2)), techScore: 85.0 }
  ];

  const ranks: Array<'L1 (Predicted Winner)' | 'L2' | 'L3' | 'L4' | 'L5'> = [
    'L1 (Predicted Winner)',
    'L2',
    'L3',
    'L4',
    'L5'
  ];

  const strategies = [
    `Local setup in ${tender.state || 'region'}; lowest logistics hauling expense; historically quotes aggressive Schedule of Rates discounts on ${tender.source_portal.split('(')[0].trim()}.`,
    'Established Class-I contractor; typical bid margin targets 5-7% net margin; robust bank solvency and strong working capital.',
    'Major national EPC player; slightly higher corporate mobilization overhead; prioritizes strict technical compliance and standard warranty.',
    'Conservative bidder; factors site-specific contingency allowances and raw material index escalations into bill of quantities.',
    'High-margin target bidder; frequently relies on technical scoring advantage and proprietary execution methodologies.'
  ];

  const postures: Array<'Aggressive DSR Discounter' | 'Balanced EPC Contractor' | 'Conservative Margin-First'> = [
    'Aggressive DSR Discounter',
    'Balanced EPC Contractor',
    'Balanced EPC Contractor',
    'Conservative Margin-First',
    'Conservative Margin-First'
  ];

  const bids: PredictedCompetitorBid[] = selectedContenders.map((c, idx) => {
    const sp = spreads[idx];
    const quote = idx === 0 ? l1Quote : Math.round(l1Quote * (1 + sp.deltaPct / 100));
    const variancePct = Number((((quote - cost) / cost) * 100).toFixed(2));
    const deltaL1Inr = quote - l1Quote;
    const deltaL1Pct = sp.deltaPct;
    const cSeed = hashString(c.name + (tender.id || 't-id'));

    const winRate = Number((62.0 + (cSeed % 26) + (idx === 0 ? 6.5 : -idx * 2.5)).toFixed(1));
    const solvRatio = Number((1.3 + (cSeed % 8) * 0.1).toFixed(2));
    const orderBook = Math.round(c.turnoverCr * (1.2 + (cSeed % 10) * 0.1));

    return {
      rank: ranks[idx],
      bidderName: c.name,
      headquarters: c.hq,
      contractorClass: c.cls,
      annualTurnoverCr: c.turnoverCr,
      quotedAmountInr: quote,
      variancePct,
      deltaL1Inr,
      deltaL1Pct,
      technicalScore: sp.techScore,
      logisticsAdvantage: idx === 0 ? `Zero mobilization lead time; active depots in ${tender.city || tender.state}` : `Regional operations via ${c.hq.split(',')[0]} circle`,
      biddingStrategy: strategies[idx],
      sectorWinRatePct: Math.min(94, Math.max(52, winRate)),
      solvencyRatio: solvRatio,
      orderBookCr: orderBook,
      headToHeadRecord: idx === 0 ? `Won 5 of last 7 sector bids (Highest L1 conversion)` : `Won ${Math.max(1, 4 - idx)} of last 6 sector tenders`,
      pricingPosture: postures[idx],
      fleetMobilityIndex: idx === 0 ? 'Tier-1 Immediate Fleet Mobilization (Same District)' : `Regional Hub Transit (~${50 + idx * 45} km)`,
      coverStatus: 'COVER 1 & 2 PASSED'
    };
  });

  const sweetSpotMinPct = Number((l1Discount - 0.7).toFixed(2));
  const sweetSpotMaxPct = Number((l1Discount - 0.2).toFixed(2));
  const sweetSpotMinInr = Math.round(cost * (1 + sweetSpotMinPct / 100));
  const sweetSpotMaxInr = Math.round(cost * (1 + sweetSpotMaxPct / 100));

  const cursePct = Number((l1Discount - 4.5).toFixed(2));
  const curseInr = Math.round(cost * (1 + cursePct / 100));

  const confidenceScore = 84 + (seed % 13);
  const confidenceLevel =
    confidenceScore >= 90
      ? 'HIGH (Level-1/2 Authority Benchmark)'
      : 'MEDIUM (Regional DSR Curve)';

  const probabilityBands: ClearingProbabilityBand[] = [
    {
      bandLabel: 'Aggressive Outlier Band',
      discountRange: `< ${cursePct}% (Over ${Math.abs(cursePct)}% Discount)`,
      priceRangeInr: `< ${formatCr(curseInr)}`,
      clearanceProbabilityPct: 94,
      riskEbitdaImpact: 'Severe EBITDA Erosion ("Winner\'s Curse" Zone, High Default Exposure)',
      colorClass: 'text-rose-700 bg-rose-50 border-rose-300',
      isRecommended: false,
      isCurseZone: true
    },
    {
      bandLabel: 'Optimal Sweet-Spot Window',
      discountRange: `${sweetSpotMinPct}% to ${sweetSpotMaxPct}% Discount`,
      priceRangeInr: `${formatCr(sweetSpotMinInr)} – ${formatCr(sweetSpotMaxInr)}`,
      clearanceProbabilityPct: 82,
      riskEbitdaImpact: 'Target 8-11% Gross Margin with High Technical Clearance Probability',
      colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-400 font-bold',
      isRecommended: true,
      isCurseZone: false
    },
    {
      bandLabel: 'Standard Tender Margin Band',
      discountRange: `${Number((l1Discount + 0.5).toFixed(1))}% to ${Number((l1Discount + 3.0).toFixed(1))}% Discount`,
      priceRangeInr: `${formatCr(Math.round(cost * (1 + (l1Discount + 0.5) / 100)))} – ${formatCr(Math.round(cost * (1 + (l1Discount + 3.0) / 100)))}`,
      clearanceProbabilityPct: 38,
      riskEbitdaImpact: 'Healthy 12-15% EBITDA, but vulnerable to aggressive local contractor bids',
      colorClass: 'text-amber-800 bg-amber-50 border-amber-300',
      isRecommended: false,
      isCurseZone: false
    },
    {
      bandLabel: 'Conservative / Near DSR Par',
      discountRange: `> ${Number((l1Discount + 3.5).toFixed(1))}% (Par to +3% Premium)`,
      priceRangeInr: `> ${formatCr(Math.round(cost * (1 + (l1Discount + 3.5) / 100)))}`,
      clearanceProbabilityPct: 9,
      riskEbitdaImpact: 'Low clearing odds; historically clears only in single-bidder situations',
      colorClass: 'text-slate-700 bg-slate-50 border-slate-300',
      isRecommended: false,
      isCurseZone: false
    }
  ];

  return {
    tenderId: tender.id,
    nitNumber: tender.nit_number,
    title: tender.title,
    organization: tender.organization,
    estimatedCostInr: cost,
    predictedL1QuoteInr: l1Quote,
    predictedL1VariancePct: l1Discount,
    winningSweetSpotMinInr: sweetSpotMinInr,
    winningSweetSpotMaxInr: sweetSpotMaxInr,
    winningSweetSpotMinPct: sweetSpotMinPct,
    winningSweetSpotMaxPct: sweetSpotMaxPct,
    winnersCurseThresholdInr: curseInr,
    winnersCurseThresholdPct: cursePct,
    estimatedTurnoutCount: 4 + (seed % 3),
    confidenceScorePct: confidenceScore,
    matchingConfidenceLevel: confidenceLevel,
    authorityHistoricalClearancePattern: `Historical contracts for ${tender.organization} on ${tender.source_portal.split('(')[0].trim()} typically clear between ${l1Discount - 1.5}% and ${l1Discount + 2.0}% against the published NIT estimate.`,
    bids,
    probabilityBands,
    strategicAdvice: {
      recommendedPriceWindow: `Target quote between ${formatCr(sweetSpotMinInr)} and ${formatCr(sweetSpotMaxInr)} (${sweetSpotMinPct}% to ${sweetSpotMaxPct}% of NIT estimate).`,
      targetAction: `Submit within the sweet-spot window to undercut predicted L1 (${bids[0].bidderName}) with an estimated 88% win probability while securing gross operating margin.`,
      riskAlert: `Do NOT bid below ${formatCr(curseInr)} (${cursePct}%). Quotes beyond this threshold hit the "Winner's Curse" and risk negative EBITDA under prevailing steel/cement and labor indices.`,
      complianceKey: `Ensure Banker Solvency Certificate and CA UDIN turnover certificates strictly conform to GFR Rule 173 to guarantee technical Cover-1 qualification.`
    }
  };
}
