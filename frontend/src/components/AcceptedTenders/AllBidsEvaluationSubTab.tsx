import React, { useMemo, useState } from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  Scale,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check
} from 'lucide-react';
import { AcceptedTender } from '../../services/api';
import { CONTRACTOR_POOLS } from '../../constants';
import { hashString } from '../../utils';

export interface EvaluatedBidder {
  rank: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  isWinner: boolean;
  name: string;
  hq: string;
  contractorClass: string;
  quotedAmountInr: number;
  quotedDiscountPct: number;
  varianceVsEstimatePct: number;
  marginOverL1Inr: number;
  marginOverL1Pct: number;
  techScore: number;
  cover1Status: 'Compliant & Verified' | 'Verified';
  cover2Status: 'Qualified (100% PQC Met)' | 'Disqualified (Criteria Shortfall)';
  isDisqualified: boolean;
  emdStatus: string;
  statusBadge: string;
  statusBadgeColor: 'emerald' | 'blue' | 'slate' | 'rose' | 'amber';
  evaluationSummary: string;
  equipmentDeclared: string;
  turnoverCited: string;
}

interface AllBidsEvaluationSubTabProps {
  tender: AcceptedTender;
}

export const AllBidsEvaluationSubTab: React.FC<AllBidsEvaluationSubTabProps> = ({ tender }) => {
  const [expandedBidderRank, setExpandedBidderRank] = useState<string | null>('L1');

  const formatINR = (val?: number) => {
    if (!val) return '₹ 0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatCr = (val?: number) => {
    if (!val) return '₹ 0.00 Cr';
    const cr = val / 10000000;
    return `₹ ${cr.toFixed(2)} Cr`;
  };

  // Compute all evaluated competitor bids deterministically
  const evaluatedBids: EvaluatedBidder[] = useMemo(() => {
    const estimatedCost = tender.og_tender?.estimated_cost_inr || 150000000;
    const l1WinnerName = tender.winning_company?.name || 'L1 Winning Bidder';
    const l1Quote =
      tender.bid_submission?.quoted_amount_inr ||
      Math.round(estimatedCost * 0.9632);
    const l1DiscountPct =
      tender.bid_submission?.quoted_discount_pct ||
      Number((((estimatedCost - l1Quote) / estimatedCost) * 100).toFixed(2));

    const seed = hashString(tender.id + (tender.og_tender?.nit_number || 'eval-seed'));

    // Select suitable contractor pool
    let pool = CONTRACTOR_POOLS[tender.category];
    if (!pool || pool.length < 5) {
      const catLower = (tender.category || '').toLowerCase();
      if (catLower.includes('health') || catLower.includes('medical')) {
        pool = CONTRACTOR_POOLS['Healthcare, Medical & Hospital Infra'];
      } else if (catLower.includes('defence') || catLower.includes('security')) {
        pool = CONTRACTOR_POOLS['Defence, Border Security & Paramilitary'];
      } else if (catLower.includes('highway') || catLower.includes('metro') || catLower.includes('rail')) {
        pool = CONTRACTOR_POOLS['Highways, Metros & Rail Transport'];
      } else if (catLower.includes('power') || catLower.includes('atomic') || catLower.includes('grid')) {
        pool = CONTRACTOR_POOLS['Atomic Energy, Power & Grid Infra'];
      } else if (catLower.includes('it') || catLower.includes('telecom')) {
        pool = CONTRACTOR_POOLS['IT, Telecom & Semiconductor Works'];
      } else if (catLower.includes('port') || catLower.includes('marine')) {
        pool = CONTRACTOR_POOLS['Ports, Shipping & Maritime Works'];
      } else {
        pool = CONTRACTOR_POOLS['Civil & Infrastructure'];
      }
    }

    // Filter out winning company from competitor pool
    const competitors = (pool || []).filter(
      (c) => !c.name.toLowerCase().includes(l1WinnerName.toLowerCase().slice(0, 8))
    );

    // Deterministically shuffle competitors
    const shuffled = [...competitors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = (seed + i * 23) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const c2 = shuffled[0] || {
      name: 'Afcons Infrastructure Limited',
      hq: 'Mumbai, Maharashtra',
      cls: 'Class-I Mega EPC',
      turnoverCr: 11800
    };
    const c3 = shuffled[1] || {
      name: 'Dilip Buildcon Limited (DBL)',
      hq: 'Bhopal, Madhya Pradesh',
      cls: 'Class-I A EPC',
      turnoverCr: 9500
    };
    const c4 = shuffled[2] || {
      name: 'Tata Projects Limited',
      hq: 'Mumbai / Noida',
      cls: 'Super Class-I Tier-1',
      turnoverCr: 14200
    };
    const c5 = shuffled[3] || {
      name: 'Ashoka Buildcon Limited',
      hq: 'Nashik, Maharashtra',
      cls: 'Class-I A National',
      turnoverCr: 6800
    };

    // Calculate spreads
    const deltaL2Pct = Number((1.8 + ((seed % 14) / 10)).toFixed(2)); // +1.8% to +3.1% over L1
    const quoteL2 = Math.round(l1Quote * (1 + deltaL2Pct / 100));

    const deltaL3Pct = Number((4.2 + ((seed % 18) / 10)).toFixed(2)); // +4.2% to +5.9% over L1
    const quoteL3 = Math.round(l1Quote * (1 + deltaL3Pct / 100));

    const deltaL4Pct = Number((7.5 + ((seed % 22) / 10)).toFixed(2)); // +7.5% to +9.6% over L1
    const quoteL4 = Math.round(l1Quote * (1 + deltaL4Pct / 100));

    const isL5Disqualified = (seed % 3 === 0);
    const deltaL5Pct = Number((11.2 + ((seed % 28) / 10)).toFixed(2));
    const quoteL5 = Math.round(l1Quote * (1 + deltaL5Pct / 100));

    const list: EvaluatedBidder[] = [
      // 1. L1 Winner
      {
        rank: 'L1',
        isWinner: true,
        name: l1WinnerName,
        hq: tender.winning_company?.registered_office?.split(',').slice(-2).join(',').trim() || 'India',
        contractorClass: tender.winning_company?.business_type || 'Super Class-I Registered Contractor',
        quotedAmountInr: l1Quote,
        quotedDiscountPct: l1DiscountPct,
        varianceVsEstimatePct: Number((((l1Quote - estimatedCost) / estimatedCost) * 100).toFixed(2)),
        marginOverL1Inr: 0,
        marginOverL1Pct: 0,
        techScore: 97.5,
        cover1Status: 'Compliant & Verified',
        cover2Status: 'Qualified (100% PQC Met)',
        isDisqualified: false,
        emdStatus: tender.bid_submission?.emd_mode || 'Bank Guarantee Verified',
        statusBadge: 'AWARDED CONTRACT (L1)',
        statusBadgeColor: 'emerald',
        evaluationSummary:
          tender.acceptance_and_loa?.committee_verdict ||
          'Lowest responsive bidder conforming to all technical qualification benchmarks, CA UDIN turnover criteria, and equipment mobilization schedule. Approved for LOA.',
        equipmentDeclared: 'Dedicated automated batching plants, sensor pavers, hydraulic piling rigs & transit mixers pledged within site jurisdiction.',
        turnoverCited: tender.winning_company?.audited_turnover_inr
          ? formatCr(tender.winning_company.audited_turnover_inr)
          : '₹ 3,820 Cr (Avg 3 FYs)'
      },

      // 2. L2 Runner-Up
      {
        rank: 'L2',
        isWinner: false,
        name: c2.name,
        hq: c2.hq,
        contractorClass: c2.cls,
        quotedAmountInr: quoteL2,
        quotedDiscountPct: Number((((estimatedCost - quoteL2) / estimatedCost) * 100).toFixed(2)),
        varianceVsEstimatePct: Number((((quoteL2 - estimatedCost) / estimatedCost) * 100).toFixed(2)),
        marginOverL1Inr: quoteL2 - l1Quote,
        marginOverL1Pct: deltaL2Pct,
        techScore: 94.0,
        cover1Status: 'Compliant & Verified',
        cover2Status: 'Qualified (100% PQC Met)',
        isDisqualified: false,
        emdStatus: 'Bank Guarantee from Nationalized Bank',
        statusBadge: 'RUNNER-UP (L2 STANDBY)',
        statusBadgeColor: 'blue',
        evaluationSummary: `Technically qualified in both Cover-1 and Cover-2 envelopes. Quoted +${deltaL2Pct}% over L1. Placed on statutory standby in accordance with CPWD Works Manual / GFR Rule 173.`,
        equipmentDeclared: 'Adequate deployment of road/structural equipment meeting all Schedule-C technical capacity criteria.',
        turnoverCited: `₹ ${c2.turnoverCr.toLocaleString()} Cr (3-Year Audited Average)`
      },

      // 3. L3 Second Runner-Up
      {
        rank: 'L3',
        isWinner: false,
        name: c3.name,
        hq: c3.hq,
        contractorClass: c3.cls,
        quotedAmountInr: quoteL3,
        quotedDiscountPct: Number((((estimatedCost - quoteL3) / estimatedCost) * 100).toFixed(2)),
        varianceVsEstimatePct: Number((((quoteL3 - estimatedCost) / estimatedCost) * 100).toFixed(2)),
        marginOverL1Inr: quoteL3 - l1Quote,
        marginOverL1Pct: deltaL3Pct,
        techScore: 91.5,
        cover1Status: 'Compliant & Verified',
        cover2Status: 'Qualified (100% PQC Met)',
        isDisqualified: false,
        emdStatus: 'Online Gateway E-Payment Receipt',
        statusBadge: 'RESPONSIVE (L3)',
        statusBadgeColor: 'slate',
        evaluationSummary: `Technically compliant. Higher rate quoted on sub-structure reinforced concrete and specialized electrical/MEP work lines (+${deltaL3Pct}% over L1).`,
        equipmentDeclared: 'Owned fabrication yard, cranes, and tipper fleets declared in Technical Cover-2.',
        turnoverCited: `₹ ${c3.turnoverCr.toLocaleString()} Cr (3-Year Audited Average)`
      },

      // 4. L4 Participant
      {
        rank: 'L4',
        isWinner: false,
        name: c4.name,
        hq: c4.hq,
        contractorClass: c4.cls,
        quotedAmountInr: quoteL4,
        quotedDiscountPct: Number((((estimatedCost - quoteL4) / estimatedCost) * 100).toFixed(2)),
        varianceVsEstimatePct: Number((((quoteL4 - estimatedCost) / estimatedCost) * 100).toFixed(2)),
        marginOverL1Inr: quoteL4 - l1Quote,
        marginOverL1Pct: deltaL4Pct,
        techScore: 88.0,
        cover1Status: 'Compliant & Verified',
        cover2Status: 'Qualified (100% PQC Met)',
        isDisqualified: false,
        emdStatus: 'Bank Guarantee from Scheduled Bank',
        statusBadge: 'RESPONSIVE (L4)',
        statusBadgeColor: 'slate',
        evaluationSummary: `Technically qualified. Factored higher corporate mobilization contingencies and supply chain escalation risk buffer (+${deltaL4Pct}% over L1).`,
        equipmentDeclared: 'Standard equipment fleet satisfying minimum tender qualification requirements.',
        turnoverCited: `₹ ${c4.turnoverCr.toLocaleString()} Cr (3-Year Audited Average)`
      },

      // 5. L5 (High Quote or Disqualified)
      {
        rank: 'L5',
        isWinner: false,
        name: c5.name,
        hq: c5.hq,
        contractorClass: c5.cls,
        quotedAmountInr: isL5Disqualified ? 0 : quoteL5,
        quotedDiscountPct: isL5Disqualified ? 0 : Number((((estimatedCost - quoteL5) / estimatedCost) * 100).toFixed(2)),
        varianceVsEstimatePct: isL5Disqualified ? 0 : Number((((quoteL5 - estimatedCost) / estimatedCost) * 100).toFixed(2)),
        marginOverL1Inr: isL5Disqualified ? 0 : quoteL5 - l1Quote,
        marginOverL1Pct: isL5Disqualified ? 0 : deltaL5Pct,
        techScore: isL5Disqualified ? 64.0 : 85.0,
        cover1Status: 'Compliant & Verified',
        cover2Status: isL5Disqualified ? 'Disqualified (Criteria Shortfall)' : 'Qualified (100% PQC Met)',
        isDisqualified: isL5Disqualified,
        emdStatus: 'Online Gateway E-Payment',
        statusBadge: isL5Disqualified ? 'COVER-2 DISQUALIFIED' : 'HIGH QUOTE (L5)',
        statusBadgeColor: isL5Disqualified ? 'rose' : 'slate',
        evaluationSummary: isL5Disqualified
          ? 'Disqualified in Technical Evaluation: Banker Solvency certificate dated prior to mandatory 6-month validity window. Financial Cover-3 unopened in accordance with GFR Rule 173.'
          : `Fully responsive, but quoted highest unit rates (+${deltaL5Pct}% over L1).`,
        equipmentDeclared: isL5Disqualified ? 'Deficient equipment commitment for peak monthly execution.' : 'Standard subcontractor lease agreements.',
        turnoverCited: `₹ ${c5.turnoverCr.toLocaleString()} Cr`
      }
    ];

    return list;
  }, [tender]);

  const estimatedCost = tender.og_tender?.estimated_cost_inr || 150000000;
  const l1Bid = evaluatedBids[0];
  const l2Bid = evaluatedBids[1];

  const exchequerSavingsInr = estimatedCost - l1Bid.quotedAmountInr;
  const l1MarginOverL2Inr = l2Bid.quotedAmountInr - l1Bid.quotedAmountInr;
  const l1MarginOverL2Pct = l2Bid.marginOverL1Pct;

  const getRankBadgeClasses = (rank: string) => {
    switch (rank) {
      case 'L1':
        return 'bg-emerald-600 text-white font-black shadow-xs';
      case 'L2':
        return 'bg-blue-600 text-white font-bold';
      case 'L3':
        return 'bg-slate-700 text-slate-200 font-bold';
      case 'L4':
        return 'bg-slate-800 text-slate-300 font-medium';
      case 'L5':
      default:
        return 'bg-slate-800 text-slate-400 font-medium';
    }
  };

  const getStatusBadgeClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rose':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'slate':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-6 transition-colors">
      {/* 1. Header Bar: Official Tender Evaluation Statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-slate-950 flex items-center gap-1 shadow-2xs">
              <Users className="w-3.5 h-3.5" />
              Comparative Bid Evaluation Matrix (All Competitors)
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Form 49 • NIC-GEP / CPPP Standards
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Financial & Technical Bids Comparison: L1 Winner vs L2, L3, L4, L5 Competitors
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive comparative statement of all participating contractors, evaluated quotes, price spreads, and committee resolution.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">L1 Winning Bid</span>
            <span className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-200">
              {formatCr(l1Bid.quotedAmountInr)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Executive Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Winning L1 Bid */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">L1 Awarded Bid</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-950 dark:text-emerald-200 font-mono">
            {formatCr(l1Bid.quotedAmountInr)}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>
              {l1Bid.quotedDiscountPct > 0
                ? `${l1Bid.quotedDiscountPct}% below estimate`
                : 'At department rate'}
            </span>
          </div>
        </div>

        {/* Card 2: L1 vs L2 Margin */}
        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">L1 to L2 Spread</span>
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-lg font-black text-blue-950 dark:text-blue-200 font-mono">
            +{l1MarginOverL2Pct}%
          </div>
          <div className="text-[11px] text-blue-700 dark:text-blue-400 mt-1 font-mono">
            L1 won by <strong>{formatCr(l1MarginOverL2Inr)}</strong> margin
          </div>
        </div>

        {/* Card 3: Public Exchequer Savings */}
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Public Savings</span>
            <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-lg font-black text-amber-950 dark:text-amber-200 font-mono">
            {exchequerSavingsInr > 0 ? formatCr(exchequerSavingsInr) : '₹ 0.00 Cr'}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-mono">
            Saved below ₹ {formatCr(estimatedCost)} budget
          </div>
        </div>

        {/* Card 4: Total Bidders Evaluated */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Evaluated Bids</span>
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            5 Bidders
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {evaluatedBids.filter((b) => !b.isDisqualified).length} Responsive •{' '}
            {evaluatedBids.filter((b) => b.isDisqualified).length} Rejected
          </div>
        </div>
      </div>

      {/* 3. Comprehensive All Bids Evaluation Matrix Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Master Comparative Bids Table (Rankings L1 – L5)</span>
          </h4>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Click on any row to expand technical dossier and equipment breakdown
          </span>
        </div>

        <div className="sm:hidden text-[11px] text-slate-500 dark:text-slate-400 font-medium px-1 flex items-center justify-between">
          <span>← Swipe table horizontally to see all columns →</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 dark:bg-slate-950 text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Contractor / Firm Name</th>
                <th className="py-3 px-3">Financial Bid Quoted</th>
                <th className="py-3 px-3">Variance vs Est.</th>
                <th className="py-3 px-3">Margin vs L1</th>
                <th className="py-3 px-3">Tech Score</th>
                <th className="py-3 px-3">PQC / Cover-2</th>
                <th className="py-3 px-3">Tender Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#0E1422]">
              {evaluatedBids.map((bid) => {
                const isSelected = expandedBidderRank === bid.rank;
                const isWinner = bid.isWinner;
                const isDisq = bid.isDisqualified;

                return (
                  <React.Fragment key={bid.rank}>
                    <tr
                      onClick={() => setExpandedBidderRank(isSelected ? null : bid.rank)}
                      className={`transition-colors cursor-pointer ${
                        isWinner
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          : isDisq
                          ? 'bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/60 dark:hover:bg-rose-950/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-6 rounded-md text-[11px] ${getRankBadgeClasses(
                            bid.rank
                          )}`}
                        >
                          {bid.rank}
                        </span>
                      </td>

                      {/* Contractor Name & HQ */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          {isWinner && <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          <span className="break-words">
                            {bid.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{bid.hq}</span>
                          <span>•</span>
                          <span>{bid.contractorClass}</span>
                        </div>
                      </td>

                      {/* Financial Bid */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        {isDisq ? (
                          <span className="text-slate-400 dark:text-slate-500 italic">Unopened (Deficient)</span>
                        ) : (
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {formatCr(bid.quotedAmountInr)}
                            </span>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">
                              {formatINR(bid.quotedAmountInr)}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Variance vs Estimate */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        {isDisq ? (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        ) : bid.varianceVsEstimatePct <= 0 ? (
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[11px]">
                            {bid.varianceVsEstimatePct}%
                          </span>
                        ) : (
                          <span className="font-bold text-rose-700 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/60 px-1.5 py-0.5 rounded text-[11px]">
                            +{bid.varianceVsEstimatePct}%
                          </span>
                        )}
                      </td>

                      {/* Margin vs L1 */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        {isWinner ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                            0.00% (Base Price)
                          </span>
                        ) : isDisq ? (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        ) : (
                          <div className="text-slate-700 dark:text-slate-300">
                            <span className="font-bold">+{bid.marginOverL1Pct}%</span>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">
                              (+{formatCr(bid.marginOverL1Inr)})
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Tech Score */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            bid.techScore >= 90
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : bid.techScore >= 80
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {bid.techScore}/100
                        </span>
                      </td>

                      {/* PQC / Cover-2 */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isDisq ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                            Disqualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            PQC Passed
                          </span>
                        )}
                      </td>

                      {/* Verdict Status Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusBadgeClasses(
                              bid.statusBadgeColor
                            )}`}
                          >
                            {bid.statusBadge}
                          </span>
                          {isSelected ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" />
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Breakdown Drawer Row */}
                    {isSelected && (
                      <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                        <td colSpan={8} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            {/* Col 1: Evaluation Verdict */}
                            <div className="space-y-1.5 bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                Committee Evaluation Findings
                              </span>
                              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                                {bid.evaluationSummary}
                              </p>
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">Security Mode:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{bid.emdStatus}</span>
                              </div>
                            </div>

                            {/* Col 2: Equipment & Machinery Fleet */}
                            <div className="space-y-1.5 bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                Committed Plant & Machinery
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                                {bid.equipmentDeclared}
                              </p>
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">Technical Score:</span>
                                <span className="font-bold text-slate-900 dark:text-white font-mono">{bid.techScore} / 100</span>
                              </div>
                            </div>

                            {/* Col 3: Financial Capacity & Turnover */}
                            <div className="space-y-1.5 bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                Verified Financial Standing
                              </span>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">Audited Turnover:</span>
                                <span className="font-semibold text-slate-900 dark:text-white font-mono">{bid.turnoverCited}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">Cover-1 Compliance:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{bid.cover1Status}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">Cover-2 Technical:</span>
                                <span className={bid.isDisqualified ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                                  {bid.cover2Status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Visual Price Spread Spectrum */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Competitive Price Clustering (Visual Dispersion vs Department Estimate)
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Estimate: {formatCr(estimatedCost)}
          </span>
        </div>

        <div className="space-y-2">
          {evaluatedBids
            .filter((b) => !b.isDisqualified)
            .map((b) => {
              const pct = (b.quotedAmountInr / estimatedCost) * 100;
              const barWidth = Math.min(Math.max(pct, 20), 100);

              return (
                <div key={b.rank} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${getRankBadgeClasses(b.rank)}`}>
                        {b.rank}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{b.name}</span>
                    </div>
                    <div className="font-mono text-xs">
                      <strong className="text-slate-900 dark:text-white">{formatCr(b.quotedAmountInr)}</strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1.5">
                        ({b.varianceVsEstimatePct <= 0 ? `${b.varianceVsEstimatePct}%` : `+${b.varianceVsEstimatePct}%`})
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.isWinner
                          ? 'bg-emerald-600'
                          : b.rank === 'L2'
                          ? 'bg-blue-600'
                          : 'bg-slate-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 5. Tender Committee Official Resolution Excerpt */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Tender Opening & Evaluation Committee Verdict (Official Record)
            </h5>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            LOA Ref: {tender.acceptance_and_loa?.loa_number || 'LOA-CONFIRMED'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{tender.acceptance_and_loa?.committee_verdict ||
            'The Tender Evaluation Committee opened and scrutinized all Cover-1 (Fee/EMD) and Cover-2 (Technical Pre-Qualification) dossiers. 4 bids were found responsive. Upon opening of Financial Cover-3, the consortium led by the L1 bidder was confirmed as the lowest responsive evaluated tenderer. Contract execution awarded.'}"
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            Awarding Body:{' '}
            <strong className="text-slate-200 font-semibold">
              {tender.acceptance_and_loa?.awarding_authority || tender.og_tender?.authority || 'Competent Authority'}
            </strong>
          </div>
          <div className="flex items-center gap-4">
            <span>Agreement Date: <strong className="text-slate-200 font-semibold">{tender.acceptance_and_loa?.contract_agreement_date || 'Executed'}</strong></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Award Approved & Bound
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBidsEvaluationSubTab;

