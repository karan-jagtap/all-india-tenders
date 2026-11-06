import React from 'react';
import { Clock } from 'lucide-react';

export function getUrgencyBadge(daysLeft?: number, isClosed?: boolean): React.ReactNode {
  if (isClosed || (daysLeft !== undefined && daysLeft < 0)) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1 shadow-2xs">
        <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
        Bids Closed
      </span>
    );
  }

  if (daysLeft === undefined || daysLeft === null) return null;

  if (daysLeft === 0) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1 shadow-2xs">
        <Clock className="w-3 h-3 text-rose-600 animate-pulse" />
        CLOSES TODAY!
      </span>
    );
  }

  if (daysLeft <= 3) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1 shadow-2xs">
        <Clock className="w-3 h-3 text-rose-600 animate-pulse" />
        {daysLeft}d left (CRITICAL)
      </span>
    );
  }

  if (daysLeft <= 7) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-600" />
        {daysLeft} Days Left
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {daysLeft} Days Left
    </span>
  );
}
