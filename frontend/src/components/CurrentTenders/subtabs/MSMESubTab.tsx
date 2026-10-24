import React from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const MSMESubTab: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0E1422] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Statutory MSE Exemption Advisory (Rule 170 of GFR 2017)
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Legal provisions under Government of India Public Procurement Policy for MSEs Order 2012.
        </p>
      </div>

      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-3">
        <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>100% EMD Exemption Guaranteed for UDYAM MSEs</span>
        </div>

        <p className="text-emerald-950 dark:text-emerald-300 leading-relaxed">
          Micro and Small Enterprises (MSEs) registered with UDYAM Registration portal are completely exempt from furnishing Earnest Money Deposit (EMD) under Rule 170 of General Financial Rules (GFR) 2017.
        </p>

        <div className="bg-white dark:bg-[#0E1422] p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
          <div className="font-bold text-slate-800 dark:text-slate-200">Checklist to Claim Exemption in Cover-1:</div>
          <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
            <li>Valid UDYAM Registration Certificate with matching National Industry Classification (NIC) codes</li>
            <li>Bid Security Declaration (Form B) in lieu of EMD on bidder letterhead</li>
            <li>Class-I / Class-II Local Supplier Self-Declaration under Public Procurement (Make in India) Order</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
