import React from 'react';
import { CheckCircle } from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';

export interface PQCSubTabProps {
  selectedTender: EnrichedCurrentTender;
}

export const PQCSubTab: React.FC<PQCSubTabProps> = ({ selectedTender }) => {
  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          Pre-Qualification & Eligibility Criteria (PQC)
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Mandatory financial, solvency, and technical experience thresholds required to pass Cover-2 evaluation.
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-blue-50/60 dark:bg-blue-950/30 p-3.5 rounded-lg border border-blue-200 dark:border-blue-900/50 text-xs">
          <div className="font-bold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Annual Turnover Requirement</span>
          </div>
          <p className="text-blue-950 dark:text-blue-300">
            {selectedTender.turnover_criteria || 'Minimum 40% of estimated cost over past 3 financial years verified by CA with valid UDIN.'}
          </p>
        </div>

        <div className="bg-purple-50/60 dark:bg-purple-950/30 p-3.5 rounded-lg border border-purple-200 dark:border-purple-900/50 text-xs">
          <div className="font-bold text-purple-900 dark:text-purple-200 mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Bank Solvency Certificate</span>
          </div>
          <p className="text-purple-950 dark:text-purple-300">
            {selectedTender.solvency_criteria || 'Banker Solvency Certificate of 40% value from a Scheduled Commercial Bank.'}
          </p>
        </div>

        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50 text-xs">
          <div className="font-bold text-emerald-950 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Similar Work Experience (3-2-1 Formula)</span>
          </div>
          <p className="text-emerald-950 dark:text-emerald-300">
            {selectedTender.experience_criteria || '3 completed works of 40% value, 2 works of 50% value, or 1 work of 80% value in the last 7 years.'}
          </p>
        </div>
      </div>
    </div>
  );
};
