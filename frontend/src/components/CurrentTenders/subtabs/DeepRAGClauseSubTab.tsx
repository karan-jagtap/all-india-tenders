import React from 'react';
import {
  Sparkles,
  Scale,
  FileSpreadsheet,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { DeepDocumentRAGReport, EnrichedCurrentTender } from '../../../types';
import { formatINR } from '../../../utils';

export interface DeepRAGClauseSubTabProps {
  deepRAGReport: DeepDocumentRAGReport;
  selectedTender: EnrichedCurrentTender;
  sbdUrl: string;
  boqUrl: string;
}

export const DeepRAGClauseSubTab: React.FC<DeepRAGClauseSubTabProps> = ({
  deepRAGReport,
  selectedTender,
  sbdUrl,
  boqUrl
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Top Executive Dossier Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-xl p-5 shadow-sm border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500 text-slate-950 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                RAG CONTRACT DOCUMENT INTELLIGENCE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono border border-slate-700">
                SBD & BOQ Schedule Synthesis
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/60">
                {deepRAGReport.riskVerdict}
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">
              Standard Bidding Document (SBD) Clause Breakdown & BOQ Cost Drivers
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              AI Retrieval-Augmented Generation extracts and risk-scores critical contractual liabilities: Liquidated Damages formulas, RBI/MoSPI Price Variation clauses, Mobilization Advances, DLP warranty retentions, and Pareto 80/20 bill of quantities cost drivers.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-indigo-500/40 px-4 py-2.5 rounded-xl text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bankability Score</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-bold text-indigo-400 font-mono">
                {deepRAGReport.overallRiskScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">
              High Bankability Tier
            </span>
          </div>
        </div>
      </div>

      {/* 4 Contractual Foundation Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Liquidated Damages (LD)</span>
          <strong className="text-sm font-bold text-rose-700 block mt-0.5">
            0.5% / Wk (Cap {deepRAGReport.ldCapPct}%)
          </strong>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Milestone Linked</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price Variation (PVC)</span>
          <strong className="text-sm font-bold text-emerald-700 block mt-0.5">
            MoSPI WPI Active
          </strong>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Steel, Cement, Labour, Fuel</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mobilization Advance</span>
          <strong className="text-sm font-bold text-blue-700 block mt-0.5">
            10.0% @ 8% p.a.
          </strong>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Against Bank Guarantee</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Defect Liability (DLP)</span>
          <strong className="text-sm font-bold text-purple-700 block mt-0.5">
            {deepRAGReport.dlpMonths} Months
          </strong>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{deepRAGReport.pbgPct}% PBG Retention</span>
        </div>
      </div>

      {/* SECTION 1: SBD Clause-by-Clause Risk Matrix */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-600" />
              Contractual Clause Risk Matrix & Legal Obligations
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Extracted from General Conditions of Contract (GCC) & Special Conditions (SCC) under GFR 2017 & CVC guidelines.
            </p>
          </div>
          <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 font-mono">
            {deepRAGReport.clauses.length} Clauses Analyzed
          </span>
        </div>

        <div className="space-y-3">
          {deepRAGReport.clauses.map((c) => {
            const isHigh = c.riskLevel === 'HIGH';
            const isMed = c.riskLevel === 'MEDIUM';
            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border text-xs transition-all ${
                  isHigh
                    ? 'bg-rose-50/40 border-rose-200'
                    : isMed
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : isMed
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {c.riskLevel} RISK
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">{c.clauseName}</h5>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono shrink-0">
                    <span>{c.standardSbdReference}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{c.authorityStrictness}</span>
                  </div>
                </div>

                {/* Extracted Formula or Statutory Rule */}
                <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 mb-2 leading-relaxed">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block mb-0.5">
                    Statutory Contractual Provision:
                  </span>
                  {c.extractedFormulaOrRule}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Commercial & Cash-Flow Risk Assessment:
                    </span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">
                      {c.riskAssessmentSummary}
                    </p>
                  </div>
                  <div>
                    <span className="text-indigo-700 block text-[10px] uppercase font-bold">
                      Recommended Contractor Mitigation:
                    </span>
                    <p className="text-slate-800 mt-0.5 leading-relaxed font-medium">
                      {c.contractorMitigationAdvice}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: BOQ Pareto 80/20 Cost Drivers Table */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              BOQ Pareto 80/20 Cost Drivers & Material Sensitivity
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Identifies the key 20% of work packages driving 80% of project expenditure and raw material price volatility.
            </p>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
            80/20 Pareto Analyzed
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Item No</th>
                <th className="py-2.5 px-3">Work Package & Description</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Est. Amount</th>
                <th className="py-2.5 px-3">Cost Share</th>
                <th className="py-2.5 px-3">Cumulative</th>
                <th className="py-2.5 px-3">Material Sensitivity & Hedging</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {deepRAGReport.paretoCostDrivers.map((p) => (
                <tr
                  key={p.itemNo}
                  className={p.isParetoDriver80_20 ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-slate-50'}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {p.itemNo}
                  </td>

                  <td className="py-3 px-3 max-w-sm">
                    <div className="font-bold text-slate-900 leading-snug">{p.description}</div>
                    {p.isParetoDriver80_20 && (
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        ★ Top 80% Pareto Driver
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600">
                    {p.unit}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-800 font-semibold">
                    {p.estimatedQuantity.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {formatINR(p.totalAmountInr)}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                    {p.costSharePct}%
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-500">
                    {p.cumulativeParetoPct}%
                  </td>

                  <td className="py-3 px-3 text-[11px] text-slate-700 max-w-xs">
                    <div className="font-semibold text-slate-900">{p.materialSensitivity}</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{p.hedgingStrategy}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Statutory GFR 2017 Compliance Checklist */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-blue-600" />
          Statutory GFR 2017 & Eligibility Verification Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {deepRAGReport.statutoryChecklist.map((chk) => (
            <div key={chk.title} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{chk.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {chk.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {chk.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions Bar: Direct Document Access */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Standard Bidding Document (SBD) and BOQ generated in memory via ReportLab with zero disk overhead.
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={sbdUrl}
            download={`${selectedTender.id}_Detailed_Tender_Document_SBD.pdf`}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Download Full SBD (3.8 MB)</span>
          </a>
          <a
            href={boqUrl}
            download={`${selectedTender.id}_BOQ_Schedule.pdf`}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download BOQ Schedule (320 KB)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
