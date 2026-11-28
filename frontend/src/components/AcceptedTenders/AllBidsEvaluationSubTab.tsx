import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { getContractorPool, subscribeContractorPools } from '../../constants';
import { hashString, formatDate } from '../../utils';
import {
  AwardBidRank,
  EvaluationCover1Status,
  EvaluationCover2Status,
  UiAccentColor,
  EvaluatedBidder,
  AllBidsEvaluationSubTabProps
} from '../../types';

export type { EvaluatedBidder, AllBidsEvaluationSubTabProps };

export const AllBidsEvaluationSubTab: React.FC<AllBidsEvaluationSubTabProps> = ({ tender }) => {
  const { t } = useTranslation();
  const [expandedBidderRank, setExpandedBidderRank] = useState<string | null>('L1');
  const [poolsTick, setPoolsTick] = useState(0);

  useEffect(() => {
    return subscribeContractorPools(() => setPoolsTick((tick) => tick + 1));
  }, []);

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
    const estimatedCost = tender.og_tender?.estimated_cost_inr ?? tender.bid_submission?.quoted_amount_inr ?? 0;
    const l1WinnerName = tender.winning_company?.name ?? 'L1 Winning Bidder';
    const l1Quote =
      tender.bid_submission?.quoted_amount_inr ??
      (estimatedCost > 0 ? Math.round(estimatedCost * 0.9632) : 0);
    const l1DiscountPct =
      tender.bid_submission?.quoted_discount_pct ??
      (estimatedCost > 0 ? Number((((estimatedCost - l1Quote) / estimatedCost) * 100).toFixed(2)) : 0);

    const seed = hashString(tender.id + (tender.og_tender?.nit_number || 'eval-seed'));

    // Select suitable contractor pool sourced dynamically from database
    const pool = getContractorPool(tender.category);

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
        rank: AwardBidRank.L1,
        isWinner: true,
        name: l1WinnerName,
        hq: tender.winning_company?.registered_office?.split(',').slice(-2).join(',').trim() || 'India',
        contractorClass: tender.winning_company?.business_type || 'Super Class-I Registered Contractor',
        quotedAmountInr: l1Quote,
        quotedDiscountPct: l1DiscountPct,
        varianceVsEstimatePct: estimatedCost > 0 ? Number((((l1Quote - estimatedCost) / estimatedCost) * 100).toFixed(2)) : 0,
        marginOverL1Inr: 0,
        marginOverL1Pct: 0,
        techScore: 97.5,
        cover1Status: EvaluationCover1Status.COMPLIANT_AND_VERIFIED,
        cover2Status: EvaluationCover2Status.QUALIFIED,
        isDisqualified: false,
        emdStatus: tender.bid_submission?.emd_mode || 'Bank Guarantee Verified',
        statusBadge: t('acceptedTenders.evalMatrix.statusAwardedContract'),
        statusBadgeColor: UiAccentColor.EMERALD,
        evaluationSummary:
          tender.acceptance_and_loa?.committee_verdict ||
          'Lowest responsive bidder conforming to all technical qualification benchmarks, CA UDIN turnover criteria, and equipment mobilization schedule. Approved for LOA.',
        equipmentDeclared: 'Dedicated automated batching plants, sensor pavers, hydraulic piling rigs & transit mixers pledged within site jurisdiction.',
        turnoverCited: tender.winning_company?.audited_turnover_inr
          ? formatCr(tender.winning_company.audited_turnover_inr)
          : '—'
      },

      // 2. L2 Runner-Up
      {
        rank: AwardBidRank.L2,
        isWinner: false,
        name: c2.name,
        hq: c2.hq,
        contractorClass: c2.cls,
        quotedAmountInr: quoteL2,
        quotedDiscountPct: estimatedCost > 0 ? Number((((estimatedCost - quoteL2) / estimatedCost) * 100).toFixed(2)) : 0,
        varianceVsEstimatePct: estimatedCost > 0 ? Number((((quoteL2 - estimatedCost) / estimatedCost) * 100).toFixed(2)) : 0,
        marginOverL1Inr: quoteL2 - l1Quote,
        marginOverL1Pct: deltaL2Pct,
        techScore: 94.0,
        cover1Status: EvaluationCover1Status.COMPLIANT_AND_VERIFIED,
        cover2Status: EvaluationCover2Status.QUALIFIED,
        isDisqualified: false,
        emdStatus: 'Bank Guarantee from Nationalized Bank',
        statusBadge: t('acceptedTenders.evalMatrix.statusRunnerUp'),
        statusBadgeColor: UiAccentColor.BLUE,
        evaluationSummary: `Technically qualified in both Cover-1 and Cover-2 envelopes. Quoted +${deltaL2Pct}% over L1. Placed on statutory standby in accordance with CPWD Works Manual / GFR Rule 173.`,
        equipmentDeclared: 'Adequate deployment of road/structural equipment meeting all Schedule-C technical capacity criteria.',
        turnoverCited: `₹ ${c2.turnoverCr.toLocaleString()} Cr (3-Year Audited Average)`
      },

      // 3. L3 Second Runner-Up
      {
        rank: AwardBidRank.L3,
        isWinner: false,
        name: c3.name,
        hq: c3.hq,
        contractorClass: c3.cls,
        quotedAmountInr: quoteL3,
        quotedDiscountPct: estimatedCost > 0 ? Number((((estimatedCost - quoteL3) / estimatedCost) * 100).toFixed(2)) : 0,
        varianceVsEstimatePct: estimatedCost > 0 ? Number((((quoteL3 - estimatedCost) / estimatedCost) * 100).toFixed(2)) : 0,
        marginOverL1Inr: quoteL3 - l1Quote,
        marginOverL1Pct: deltaL3Pct,
        techScore: 91.5,
        cover1Status: EvaluationCover1Status.COMPLIANT_AND_VERIFIED,
        cover2Status: EvaluationCover2Status.QUALIFIED,
        isDisqualified: false,
        emdStatus: 'Online Gateway E-Payment Receipt',
        statusBadge: t('acceptedTenders.evalMatrix.statusResponsive', { rank: 'L3' }),
        statusBadgeColor: UiAccentColor.SLATE,
        evaluationSummary: `Technically compliant. Higher rate quoted on sub-structure reinforced concrete and specialized electrical/MEP work lines (+${deltaL3Pct}% over L1).`,
        equipmentDeclared: 'Owned fabrication yard, cranes, and tipper fleets declared in Technical Cover-2.',
        turnoverCited: `₹ ${c3.turnoverCr.toLocaleString()} Cr (3-Year Audited Average)`
      },

      // 4. L4 Participant
      {
        rank: AwardBidRank.L4,
        isWinner: false,
        name: c4.name,
        hq: c4.hq,
        contractorClass: c4.cls,
        quotedAmountInr: quoteL4,
        quotedDiscountPct: estimatedCost > 0 ? Number((((estimatedCost - quoteL4) / estimatedCost) * 100).toFixed(2)) : 0,
        varianceVsEstimatePct: estimatedCost > 0 ? Number((((quoteL4 - estimatedCost) / estimatedCost) * 100).toFixed(2)) : 0,
        marginOverL1Inr: quoteL4 - l1Quote,
        marginOverL1Pct: deltaL4Pct,
        techScore: 88.0,
        cover1Status: EvaluationCover1Status.COMPLIANT_AND_VERIFIED,
        cover2Status: EvaluationCover2Status.QUALIFIED,
        isDisqualified: false,
        emdStatus: 'Bank Guarantee from Scheduled Bank',
        statusBadge: t('acceptedTenders.evalMatrix.statusResponsive', { rank: 'L4' }),
        statusBadgeColor: UiAccentColor.SLATE,
        evaluationSummary: `Technically qualified. Factored higher corporate mobilization contingencies and supply chain escalation risk buffer (+${deltaL4Pct}% over L1).`,
        equipmentDeclared: 'Standard equipment fleet satisfying minimum tender qualification requirements.',
        turnoverCited: `₹ ${c4.turnoverCr.toLocaleString()} Cr (3-Year Audited Average)`
      },

      // 5. L5 (High Quote or Disqualified)
      {
        rank: AwardBidRank.L5,
        isWinner: false,
        name: c5.name,
        hq: c5.hq,
        contractorClass: c5.cls,
        quotedAmountInr: isL5Disqualified ? 0 : quoteL5,
        quotedDiscountPct: isL5Disqualified ? 0 : (estimatedCost > 0 ? Number((((estimatedCost - quoteL5) / estimatedCost) * 100).toFixed(2)) : 0),
        varianceVsEstimatePct: isL5Disqualified ? 0 : (estimatedCost > 0 ? Number((((quoteL5 - estimatedCost) / estimatedCost) * 100).toFixed(2)) : 0),
        marginOverL1Inr: isL5Disqualified ? 0 : quoteL5 - l1Quote,
        marginOverL1Pct: isL5Disqualified ? 0 : deltaL5Pct,
        techScore: isL5Disqualified ? 64.0 : 85.0,
        cover1Status: EvaluationCover1Status.COMPLIANT_AND_VERIFIED,
        cover2Status: isL5Disqualified ? EvaluationCover2Status.DISQUALIFIED : EvaluationCover2Status.QUALIFIED,
        isDisqualified: isL5Disqualified,
        emdStatus: 'Online Gateway E-Payment',
        statusBadge: isL5Disqualified ? t('acceptedTenders.evalMatrix.statusCover2Disqualified') : t('acceptedTenders.evalMatrix.statusHighQuote'),
        statusBadgeColor: isL5Disqualified ? UiAccentColor.ROSE : UiAccentColor.SLATE,
        evaluationSummary: isL5Disqualified
          ? 'Disqualified in Technical Evaluation: Banker Solvency certificate dated prior to mandatory 6-month validity window. Financial Cover-3 unopened in accordance with GFR Rule 173.'
          : `Fully responsive, but quoted highest unit rates (+${deltaL5Pct}% over L1).`,
        equipmentDeclared: isL5Disqualified ? 'Deficient equipment commitment for peak monthly execution.' : 'Standard subcontractor lease agreements.',
        turnoverCited: `₹ ${c5.turnoverCr.toLocaleString()} Cr`
      }
    ];

    return list;
  }, [tender, poolsTick, t]);

  const estimatedCost = tender.og_tender?.estimated_cost_inr ?? tender.bid_submission?.quoted_amount_inr ?? 0;
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
              {t('acceptedTenders.evalMatrix.badge')}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {t('acceptedTenders.evalMatrix.standards')}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {t('acceptedTenders.evalMatrix.title')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('acceptedTenders.evalMatrix.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">{t('acceptedTenders.evalMatrix.l1WinningBid')}</span>
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
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('acceptedTenders.evalMatrix.l1AwardedBid')}</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-950 dark:text-emerald-200 font-mono">
            {formatCr(l1Bid.quotedAmountInr)}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>
              {l1Bid.quotedDiscountPct > 0
                ? t('acceptedTenders.evalMatrix.belowEstimate', { pct: l1Bid.quotedDiscountPct })
                : t('acceptedTenders.evalMatrix.atDepartmentRate')}
            </span>
          </div>
        </div>

        {/* Card 2: L1 vs L2 Margin */}
        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('acceptedTenders.evalMatrix.l1ToL2Spread')}</span>
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-lg font-black text-blue-950 dark:text-blue-200 font-mono">
            +{l1MarginOverL2Pct}%
          </div>
          <div className="text-[11px] text-blue-700 dark:text-blue-400 mt-1 font-mono">
            {t('acceptedTenders.evalMatrix.l1WonByMargin', { amount: formatCr(l1MarginOverL2Inr) })}
          </div>
        </div>

        {/* Card 3: Public Exchequer Savings */}
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('acceptedTenders.evalMatrix.publicSavings')}</span>
            <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-lg font-black text-amber-950 dark:text-amber-200 font-mono">
            {exchequerSavingsInr > 0 ? formatCr(exchequerSavingsInr) : '₹ 0.00 Cr'}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-mono">
            {t('acceptedTenders.evalMatrix.savedBelowBudget', { budget: formatCr(estimatedCost) })}
          </div>
        </div>

        {/* Card 4: Total Bidders Evaluated */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('acceptedTenders.evalMatrix.evaluatedBids')}</span>
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            {t('acceptedTenders.evalMatrix.biddersCount')}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {t('acceptedTenders.evalMatrix.responsiveCount', {
              responsive: evaluatedBids.filter((b) => !b.isDisqualified).length,
              rejected: evaluatedBids.filter((b) => b.isDisqualified).length
            })}
          </div>
        </div>
      </div>

      {/* 3. Comprehensive All Bids Evaluation Matrix Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('acceptedTenders.evalMatrix.tableTitle')}</span>
          </h4>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {t('acceptedTenders.evalMatrix.clickToExpand')}
          </span>
        </div>

        <div className="sm:hidden text-[11px] text-slate-500 dark:text-slate-400 font-medium px-1 flex items-center justify-between">
          <span>{t('acceptedTenders.evalMatrix.swipeNotice')}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 dark:bg-slate-950 text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colRank')}</th>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colContractor')}</th>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colFinancialBid')}</th>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colVariance')}</th>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colMargin')}</th>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colTechScore')}</th>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colPqc')}</th>
                <th className="py-3 px-3">{t('acceptedTenders.evalMatrix.colVerdict')}</th>
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

                      {/* Contractor Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          {isWinner && <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          <span className="break-words">
                            {bid.name}
                          </span>
                        </div>
                      </td>

                      {/* Financial Bid */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        {isDisq ? (
                          <span className="text-slate-400 dark:text-slate-500 italic">{t('acceptedTenders.evalMatrix.unopenedDeficient')}</span>
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
                            {t('acceptedTenders.evalMatrix.basePrice')}
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
                            {t('acceptedTenders.evalMatrix.disqualified')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            {t('acceptedTenders.evalMatrix.pqcPassed')}
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
                        <td colSpan={8} className="p-4 space-y-3">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-white dark:bg-[#0E1422] px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 w-fit">
                            <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span>{bid.hq}</span>
                            <span>•</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{bid.contractorClass}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            {/* Col 1: Evaluation Verdict */}
                            <div className="space-y-1.5 bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                {t('acceptedTenders.evalMatrix.committeeFindings')}
                              </span>
                              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                                {bid.evaluationSummary}
                              </p>
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">{t('acceptedTenders.evalMatrix.securityMode')}</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{bid.emdStatus}</span>
                              </div>
                            </div>

                            {/* Col 2: Equipment & Machinery Fleet */}
                            <div className="space-y-1.5 bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                {t('acceptedTenders.evalMatrix.plantMachinery')}
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                                {bid.equipmentDeclared}
                              </p>
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">{t('acceptedTenders.evalMatrix.technicalScore')}</span>
                                <span className="font-bold text-slate-900 dark:text-white font-mono">{bid.techScore} / 100</span>
                              </div>
                            </div>

                            {/* Col 3: Financial Capacity & Turnover */}
                            <div className="space-y-1.5 bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                {t('acceptedTenders.evalMatrix.financialStanding')}
                              </span>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">{t('acceptedTenders.evalMatrix.auditedTurnover')}</span>
                                <span className="font-semibold text-slate-900 dark:text-white font-mono">{bid.turnoverCited}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">{t('acceptedTenders.evalMatrix.cover1Compliance')}</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{bid.cover1Status}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">{t('acceptedTenders.evalMatrix.cover2Technical')}</span>
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
            {t('acceptedTenders.evalMatrix.priceClustering')}
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {t('acceptedTenders.evalMatrix.estimateLabel', { amount: formatCr(estimatedCost) })}
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
              {t('acceptedTenders.evalMatrix.committeeVerdictTitle')}
            </h5>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {t('acceptedTenders.evalMatrix.loaRef', { ref: tender.acceptance_and_loa?.loa_number || 'LOA-CONFIRMED' })}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{tender.acceptance_and_loa?.committee_verdict ||
            'The Tender Evaluation Committee opened and scrutinized all Cover-1 (Fee/EMD) and Cover-2 (Technical Pre-Qualification) dossiers. 4 bids were found responsive. Upon opening of Financial Cover-3, the consortium led by the L1 bidder was confirmed as the lowest responsive evaluated tenderer. Contract execution awarded.'}"
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            {t('acceptedTenders.evalMatrix.awardingBody')}{' '}
            <strong className="text-slate-200 font-semibold">
              {tender.acceptance_and_loa?.awarding_authority || tender.og_tender?.authority || 'Competent Authority'}
            </strong>
          </div>
          <div className="flex items-center gap-4">
            <span>{t('acceptedTenders.evalMatrix.agreementDate')} <strong className="text-slate-200 font-semibold">{tender.acceptance_and_loa?.contract_agreement_date ? formatDate(tender.acceptance_and_loa.contract_agreement_date) : t('acceptedTenders.evalMatrix.executed')}</strong></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {t('acceptedTenders.evalMatrix.awardApproved')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBidsEvaluationSubTab;

