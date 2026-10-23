import React from 'react';
import { Award, Search } from 'lucide-react';
import { BidderWonContract } from '../../types';
import { formatCr, formatINR } from '../../utils';

export interface BidderContractsTableProps {
  totalContractsCount: number;
  contractSearchQuery: string;
  setContractSearchQuery: (q: string) => void;
  filteredContracts: BidderWonContract[];
}

export const BidderContractsTable: React.FC<BidderContractsTableProps> = ({
  totalContractsCount,
  contractSearchQuery,
  setContractSearchQuery,
  filteredContracts
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            Verified Statutory Public Contracts Awarded Till Date ({totalContractsCount})
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Official government contract awards aggregated from CPPP, GeM, MahaTenders, IREPS, and state portals under GFR 173 transparency norms.
          </p>
        </div>

        {/* Project search filter */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter contractor's projects..."
            value={contractSearchQuery}
            onChange={(e) => setContractSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs max-h-[500px]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 text-[10px] uppercase font-bold tracking-wider sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3">Project Title & Scope</th>
              <th className="py-2.5 px-3">Procuring Authority</th>
              <th className="py-2.5 px-3">Award Date & Year</th>
              <th className="py-2.5 px-3">Contract Value</th>
              <th className="py-2.5 px-3">Winning Quote Delta</th>
              <th className="py-2.5 px-3">LOA Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredContracts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No matching projects found for this query.
                </td>
              </tr>
            ) : (
              filteredContracts.map((c) => (
                <tr key={c.tender_id || c.loa_number} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 max-w-sm">
                    <div className="font-bold text-slate-900 leading-snug line-clamp-2">{c.title}</div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {c.category}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 max-w-xs text-slate-700">
                    <div className="font-medium truncate">{c.authority}</div>
                    <span className="text-[10px] text-slate-400 font-mono block">{c.portal}</span>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-mono">
                    <div className="font-semibold">{c.award_date}</div>
                    <span className="text-[10px] text-slate-400">FY {c.year}</span>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-slate-900">
                    <div>{formatCr(c.contract_value_inr)}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{formatINR(c.contract_value_inr)}</div>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                    <span className={c.discount_pct <= 0 ? 'text-emerald-700 font-bold' : 'text-slate-700 font-bold'}>
                      {c.discount_pct <= 0 ? `${c.discount_pct}%` : `+${c.discount_pct}%`}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-sans">{c.ranking}</span>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[10px] text-slate-500">
                    <div className="truncate max-w-[150px]" title={c.loa_number}>{c.loa_number}</div>
                    <span className="text-[9px] text-slate-400 block">NIT: {c.nit_number.slice(0, 15)}...</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
