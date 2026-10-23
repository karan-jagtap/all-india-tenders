import React from 'react';
import {
  Building2,
  MapPin,
  Check,
  Copy
} from 'lucide-react';
import { RegisteredBidder } from '../../types';
import { formatCr } from '../../utils';

export interface BidderDossierProps {
  selectedBidder: RegisteredBidder;
  onCopy: (text: string, e: React.MouseEvent) => void;
  copiedText: string | null;
}

export const BidderDossier: React.FC<BidderDossierProps> = ({
  selectedBidder,
  onCopy,
  copiedText
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              REGISTERED PUBLIC CONTRACTOR
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
              {selectedBidder.msme_status}
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
              {selectedBidder.local_content_class}
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {selectedBidder.name}
          </h2>

          <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{selectedBidder.registered_office}</span>
          </div>
        </div>

        <div className="text-right shrink-0 bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-xs">
          <span className="text-[10px] text-blue-700 uppercase font-semibold block">Total Portfolio Won</span>
          <strong className="text-lg font-bold text-blue-950 font-mono block">
            {formatCr(selectedBidder.total_awarded_value_inr)}
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            ✓ {selectedBidder.total_contracts_won} Statutory Contracts
          </span>
        </div>
      </div>

      {/* 4 Core Financial & Technical Strength Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">3-Yr Audited Turnover</span>
          <strong className="text-sm font-bold text-slate-900 block mt-0.5 font-mono">
            {formatCr(selectedBidder.audited_turnover_inr)}
          </strong>
          <span className="text-[9px] text-slate-500 block truncate mt-1" title={selectedBidder.ca_udin}>
            UDIN: {selectedBidder.ca_udin.slice(0, 15)}...
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Banker Solvency Limit</span>
          <strong className="text-sm font-bold text-purple-700 block mt-0.5 font-mono">
            {formatCr(selectedBidder.solvency_certificate_inr)}
          </strong>
          <span className="text-[9px] text-slate-500 block truncate mt-1" title={selectedBidder.solvency_bank}>
            {selectedBidder.solvency_bank.slice(0, 20)}...
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Make in India Ratio</span>
          <strong className="text-sm font-bold text-emerald-700 block mt-0.5 font-mono">
            {selectedBidder.local_content_pct}%
          </strong>
          <span className="text-[9px] text-emerald-700 font-semibold block mt-1">
            Class-I Local Supplier
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Project Leadership</span>
          <strong className="text-xs font-bold text-slate-800 block mt-0.5 truncate" title={selectedBidder.project_lead}>
            {selectedBidder.project_lead.split(',')[0]}
          </strong>
          <span className="text-[9px] text-slate-500 block mt-1 truncate">
            {selectedBidder.project_lead.split(',')[1] || 'Authorized Lead'}
          </span>
        </div>
      </div>

      {/* Enriched Financial Intelligence & Pre-Bid Capacity Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
          <span className="text-[10px] text-blue-700 uppercase font-semibold block">Credit Rating</span>
          <strong className="text-xs font-bold text-blue-950 block mt-0.5 truncate" title={selectedBidder.credit_rating}>
            {selectedBidder.credit_rating?.split('(')[0]?.trim() || 'CRISIL AAA'}
          </strong>
          <span className="text-[9px] text-blue-700 block truncate mt-0.5">
            Agency: {selectedBidder.credit_rating_agency || 'CRISIL / ICRA'}
          </span>
        </div>

        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
          <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Historical Win Rate</span>
          <strong className="text-sm font-bold text-emerald-900 block mt-0.5 font-mono">
            {selectedBidder.win_rate_pct || 68.4}%
          </strong>
          <span className="text-[9px] text-emerald-700 block mt-0.5 font-mono">
            Avg Discount: {selectedBidder.avg_discount_pct || -6.8}%
          </span>
        </div>

        <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
          <span className="text-[10px] text-amber-800 uppercase font-semibold block">Unexecuted Order Book</span>
          <strong className="text-xs font-bold text-amber-950 block mt-0.5 font-mono">
            {formatCr(selectedBidder.unexecuted_order_book_inr)}
          </strong>
          <span className="text-[9px] text-amber-800 block truncate mt-0.5">
            Fleet Asset: {formatCr(selectedBidder.equipment_fleet_val_inr)}
          </span>
        </div>

        <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200">
          <span className="text-[10px] text-purple-700 uppercase font-semibold block">PQC Standing Tier</span>
          <strong className="text-xs font-bold text-purple-950 block mt-0.5 truncate" title={selectedBidder.pqc_clearance_rating}>
            {selectedBidder.pqc_clearance_rating || 'Super Class-I National'}
          </strong>
          <span className="text-[9px] text-purple-700 block mt-0.5 font-mono">
            Solvency Ratio: {selectedBidder.solvency_ratio || 1.45}x
          </span>
        </div>
      </div>

      {/* Statutory Identifiers Strip (CIN, GSTIN, PAN) */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Corporate ID (CIN)</span>
            <code className="text-[11px] font-mono font-bold text-slate-800">{selectedBidder.cin}</code>
          </div>
          <button
            onClick={(e) => onCopy(selectedBidder.cin, e)}
            title="Copy CIN"
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors cursor-pointer"
          >
            {copiedText === selectedBidder.cin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold block">GSTIN Registration</span>
            <code className="text-[11px] font-mono font-bold text-slate-800">{selectedBidder.gstin}</code>
          </div>
          <button
            onClick={(e) => onCopy(selectedBidder.gstin, e)}
            title="Copy GSTIN"
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors cursor-pointer"
          >
            {copiedText === selectedBidder.gstin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Permanent Account No (PAN)</span>
            <code className="text-[11px] font-mono font-bold text-slate-800">{selectedBidder.pan}</code>
          </div>
          <button
            onClick={(e) => onCopy(selectedBidder.pan, e)}
            title="Copy PAN"
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors cursor-pointer"
          >
            {copiedText === selectedBidder.pan ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Core Sectors & Portals Tags */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] text-slate-400 font-semibold">Specializations:</span>
        {selectedBidder.categories.slice(0, 5).map((cat) => (
          <span key={cat} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
            {cat}
          </span>
        ))}
        {selectedBidder.categories.length > 5 && (
          <span className="text-[10px] text-slate-500">+{selectedBidder.categories.length - 5} more</span>
        )}
      </div>
    </div>
  );
};
