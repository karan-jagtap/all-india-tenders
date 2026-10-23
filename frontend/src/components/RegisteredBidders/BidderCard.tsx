import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { RegisteredBidder } from '../../types';
import { formatCr } from '../../utils';

export interface BidderCardProps {
  bidder: RegisteredBidder;
  isSelected: boolean;
  onSelect: () => void;
}

export const BidderCard: React.FC<BidderCardProps> = ({
  bidder,
  isSelected,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl p-4 border transition-all text-xs relative ${
        isSelected
          ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
          {bidder.pqc_clearance_rating || 'Super Class-I National'}
        </span>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {bidder.total_contracts_won} Won Contracts
        </span>
      </div>

      <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 mt-1">
        {bidder.name}
      </h3>

      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="truncate">{bidder.registered_office || (bidder.states && bidder.states[0]) || 'India'}</span>
      </div>

      {/* Financials Strip */}
      <div className="grid grid-cols-2 gap-2 pt-2.5 mt-2 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px]">Total Awarded</span>
          <strong className="text-slate-900 font-bold font-mono">
            {formatCr(bidder.total_awarded_value_inr)}
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Audited Turnover</span>
          <strong className="text-purple-700 font-bold font-mono">
            {formatCr(bidder.audited_turnover_inr)}
          </strong>
        </div>
      </div>

      {/* Financial Standing & Win Rate */}
      <div className="grid grid-cols-2 gap-2 pt-2 mt-1 border-t border-slate-100 text-[10px]">
        <div>
          <span className="text-slate-400 block">Credit Rating</span>
          <span className="font-bold text-blue-700 truncate block" title={bidder.credit_rating}>
            {bidder.credit_rating?.split('(')[0]?.trim() || 'CRISIL AAA'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Win Rate / Book</span>
          <span className="font-bold text-emerald-700 block">
            {bidder.win_rate_pct || 68}% • {formatCr(bidder.unexecuted_order_book_inr)}
          </span>
        </div>
      </div>

      {/* Badges strip */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
        <span className="text-[9px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
          {bidder.categories[0] || 'Civil'}
        </span>
        {bidder.categories[1] && (
          <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            +{bidder.categories.length - 1} more
          </span>
        )}
        <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-medium ml-auto">
          Make in India {bidder.local_content_pct}%
        </span>
      </div>

      {isSelected && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
