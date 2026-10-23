import React from 'react';
import { FileText } from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';

export interface ScopeAndSpecsSubTabProps {
  selectedTender: EnrichedCurrentTender;
}

export const ScopeAndSpecsSubTab: React.FC<ScopeAndSpecsSubTabProps> = ({ selectedTender }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-orange-600" />
          Detailed Scope of Work & Specifications
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Statutory technical description issued by the tendering authority under GFR 2017 guidelines.
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed space-y-3">
        <p className="font-medium text-slate-900">
          {selectedTender.scope_summary || 'Detailed specifications available on official portal.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tender Type</span>
            <span className="font-semibold text-slate-800">{selectedTender.tender_type || 'Open e-Tender'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Published Date</span>
            <span className="font-semibold text-slate-800">{selectedTender.published_date || 'Recent'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">State & Territory</span>
            <span className="font-semibold text-slate-800">{selectedTender.state || 'Pan-India'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">City / Work Location</span>
            <span className="font-semibold text-slate-800">{selectedTender.city || 'Statewide'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
