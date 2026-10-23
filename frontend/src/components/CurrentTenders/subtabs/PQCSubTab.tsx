import React from 'react';
import { CheckCircle } from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';

export interface PQCSubTabProps {
  selectedTender: EnrichedCurrentTender;
}

export const PQCSubTab: React.FC<PQCSubTabProps> = ({ selectedTender }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-orange-600" />
          Pre-Qualification & Eligibility Criteria (PQC)
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Mandatory financial, solvency, and technical experience thresholds required to pass Cover-2 evaluation.
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200 text-xs">
          <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Annual Turnover Requirement</span>
          </div>
          <p className="text-blue-950">
            {selectedTender.turnover_criteria || 'Minimum 40% of estimated cost over past 3 financial years verified by CA with valid UDIN.'}
          </p>
        </div>

        <div className="bg-purple-50/60 p-3.5 rounded-lg border border-purple-200 text-xs">
          <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Bank Solvency Certificate</span>
          </div>
          <p className="text-purple-950">
            {selectedTender.solvency_criteria || 'Banker Solvency Certificate of 40% value from a Scheduled Commercial Bank.'}
          </p>
        </div>

        <div className="bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200 text-xs">
          <div className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Similar Work Experience (3-2-1 Formula)</span>
          </div>
          <p className="text-emerald-950">
            {selectedTender.experience_criteria || '3 completed works of 40% value, 2 works of 50% value, or 1 work of 80% value in the last 7 years.'}
          </p>
        </div>
      </div>
    </div>
  );
};
