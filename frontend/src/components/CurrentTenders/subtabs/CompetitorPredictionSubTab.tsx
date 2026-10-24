import React from 'react';
import {
  Zap,
  Radio,
  Scale,
  CheckCircle,
  MapPin,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { PreBidSimulationReport } from '../../../types';
import { formatINR } from '../../../utils';

export interface CompetitorPredictionSubTabProps {
  preBidPrediction: PreBidSimulationReport;
}

export const CompetitorPredictionSubTab: React.FC<CompetitorPredictionSubTabProps> = ({
  preBidPrediction
}) => {
  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-5 animate-in fade-in duration-150 transition-colors">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 rounded-xl p-5 border border-amber-500/30 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-xs">
                <Zap className="w-3 h-3 text-slate-950" />
                PRE-BID AI SIMULATOR • GFR 173 BENCHMARK
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono border border-slate-700">
                Confidence: {preBidPrediction.confidenceScorePct}% ({preBidPrediction.matchingConfidenceLevel.split(' ')[0]})
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">
              Pre-Bid Competitor Bids & L1 Winning Simulator
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Synthesized using Retrieval-Augmented Generation (RAG) against 2,600+ historical awarded tenders. Evaluates mandatory PQC turnover/solvency thresholds, authority Schedule of Rates (SOR) clearance margins, and regional contractor proximity to project likely competitor bids before you submit.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-amber-500/30 px-3.5 py-2 rounded-xl text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Predicted Turnout</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {preBidPrediction.estimatedTurnoutCount} Bidders
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Two-Cover Qualified</span>
          </div>
        </div>
      </div>

      {/* 4 Core Intelligence Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Official NIT Estimate</span>
          <strong className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5 font-mono">
            {formatINR(preBidPrediction.estimatedCostInr)}
          </strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Baseline 100% Rate Book</span>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold block">Predicted L1 Winner Cutoff</span>
          <strong className="text-sm font-bold text-emerald-900 dark:text-emerald-200 block mt-0.5 font-mono">
            {formatINR(preBidPrediction.predictedL1QuoteInr)}
          </strong>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 block">
            {preBidPrediction.predictedL1VariancePct}% below estimate
          </span>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
          <span className="text-[10px] text-amber-800 dark:text-amber-400 uppercase font-semibold block">Target Winning Sweet Spot</span>
          <strong className="text-xs font-bold text-amber-950 dark:text-amber-200 block mt-0.5 font-mono">
            {formatINR(preBidPrediction.winningSweetSpotMinInr)} – {formatINR(preBidPrediction.winningSweetSpotMaxInr)}
          </strong>
          <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold mt-1 block">
            {preBidPrediction.winningSweetSpotMinPct}% to {preBidPrediction.winningSweetSpotMaxPct}% (88% Win Rate)
          </span>
        </div>

        <div className="bg-rose-50/70 dark:bg-rose-950/30 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50">
          <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-semibold block">"Winner's Curse" Risk Zone</span>
          <strong className="text-sm font-bold text-rose-900 dark:text-rose-200 block mt-0.5 font-mono">
            Below {formatINR(preBidPrediction.winnersCurseThresholdInr)}
          </strong>
          <span className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold mt-1 block">
            Beyond {preBidPrediction.winnersCurseThresholdPct}% (Negative Margin)
          </span>
        </div>
      </div>

      {/* Authority Clearance Insight Callout */}
      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>RAG Historical Authority Pattern:</strong> {preBidPrediction.authorityHistoricalClearancePattern}
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold text-amber-800 dark:text-amber-400 shrink-0">
          Sample Size: 2,600+ Awards
        </span>
      </div>

      {/* Market Simulator: Clearing Probability Density Curve & Margin Distribution Bands */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Clearing Probability Density Curve & Margin Distribution
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Monte Carlo DSR Calibration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          {preBidPrediction.probabilityBands.map((band) => (
            <div
              key={band.bandLabel}
              className={`p-3 rounded-lg border text-xs relative ${
                band.isRecommended
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-sm ring-1 ring-emerald-500/50'
                  : band.isCurseZone
                  ? 'bg-rose-950/40 border-rose-800'
                  : 'bg-slate-800/80 border-slate-700'
              }`}
            >
              {band.isRecommended && (
                <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded uppercase tracking-wider">
                  Recommended Sweet Spot
                </span>
              )}
              <div className="text-[11px] font-bold text-slate-200 mb-1">
                {band.bandLabel}
              </div>
              <div className="text-[10px] font-mono text-amber-300 font-bold">
                {band.discountRange}
              </div>
              <div className="text-[11px] font-mono font-bold text-white mt-0.5">
                {band.priceRangeInr}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Win Probability:</span>
                <span className={`font-mono font-bold text-xs ${band.isRecommended ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {band.clearanceProbabilityPct}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    band.isRecommended
                      ? 'bg-emerald-400'
                      : band.isCurseZone
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${band.clearanceProbabilityPct}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-2 leading-relaxed">
                {band.riskEbitdaImpact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Financial Comparative Statement (CS Sheet) Table */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Simulated Financial Comparative Statement (Predicted CS Sheet)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Projected financial opening based on PQC contractor balance sheets, regional equipment depots, and GFR 173 compliance.
            </p>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-mono">
            RAG Matched: 5 Contenders
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 dark:bg-slate-950 text-slate-200 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Predicted Rank</th>
                <th className="py-2.5 px-3">Qualified Competitor</th>
                <th className="py-2.5 px-3">Sector Win Rate & Track</th>
                <th className="py-2.5 px-3">Pricing Posture & Book</th>
                <th className="py-2.5 px-3">Predicted Quote</th>
                <th className="py-2.5 px-3">Variance vs NIT</th>
                <th className="py-2.5 px-3">Delta vs L1</th>
                <th className="py-2.5 px-3">Tech Score</th>
                <th className="py-2.5 px-3">Bidding Behavior & Logistics Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0E1422]">
              {preBidPrediction.bids.map((b) => {
                const isL1 = b.rank.startsWith('L1');
                return (
                  <tr
                    key={b.bidderName}
                    className={isL1 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors'}
                  >
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isL1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                          <CheckCircle className="w-3 h-3 text-white" />
                          {b.rank}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {b.rank}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white leading-snug">{b.bidderName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 flex-wrap">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        <span>{b.headquarters}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{b.contractorClass}</span>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Turnover ₹ {b.annualTurnoverCr} Cr</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white font-mono text-[11px] flex items-center gap-1">
                        <span className="text-emerald-700 dark:text-emerald-400">{b.sectorWinRatePct}%</span>
                        <span className="text-slate-400 font-normal">Win Rate</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[160px]" title={b.headToHeadRecord}>
                        {b.headToHeadRecord}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        b.pricingPosture.includes('Aggressive')
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                          : b.pricingPosture.includes('Balanced')
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                      }`}>
                        {b.pricingPosture}
                      </span>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Book: ₹ {b.orderBookCr} Cr • Solv: {b.solvencyRatio}x
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                      {formatINR(b.quotedAmountInr)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono font-bold">
                      <span className={b.variancePct < 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
                        {b.variancePct > 0 ? `+${b.variancePct}%` : `${b.variancePct}%`}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                      {isL1 ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">0.0 (Baseline)</span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400">
                          +{formatINR(b.deltaL1Inr)} (+{b.deltaL1Pct}%)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {b.technicalScore} / 100
                    </td>

                    <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-sm">
                      <p className="leading-relaxed">{b.biddingStrategy}</p>
                      <span className="inline-block text-[10px] text-blue-700 dark:text-blue-400 font-medium mt-0.5">
                        {b.fleetMobilityIndex}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Action Advisory Playbook */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
        <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
          <div className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Winning Sweet-Spot Strategy
          </div>
          <p className="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed font-semibold">
            {preBidPrediction.strategicAdvice.recommendedPriceWindow}
          </p>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
            {preBidPrediction.strategicAdvice.targetAction}
          </p>
        </div>

        <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-1.5">
          <div className="font-bold text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            "Winner's Curse" Risk Warning
          </div>
          <p className="text-[11px] text-rose-900 dark:text-rose-300 leading-relaxed font-semibold">
            Avoid Quoting Below {formatINR(preBidPrediction.winnersCurseThresholdInr)} ({preBidPrediction.winnersCurseThresholdPct}%)
          </p>
          <p className="text-[11px] text-rose-800 dark:text-rose-400 leading-relaxed">
            {preBidPrediction.strategicAdvice.riskAlert}
          </p>
        </div>

        <div className="p-4 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-1.5">
          <div className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Cover-1 Technical Compliance Safeguard
          </div>
          <p className="text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed font-semibold">
            Strict Pre-Qualification Criteria (PQC) Adherence
          </p>
          <p className="text-[11px] text-blue-800 dark:text-blue-400 leading-relaxed">
            {preBidPrediction.strategicAdvice.complianceKey}
          </p>
        </div>
      </div>
    </div>
  );
};
