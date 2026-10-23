import React from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const MSMESubTab: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          Statutory MSE Exemption Advisory (Rule 170 of GFR 2017)
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Legal provisions under Government of India Public Procurement Policy for MSEs Order 2012.
        </p>
      </div>

      <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs space-y-3">
        <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>100% EMD Exemption Guaranteed for UDYAM MSEs</span>
        </div>

        <p className="text-emerald-950 leading-relaxed">
          Micro and Small Enterprises (MSEs) registered with UDYAM Registration portal are completely exempt from furnishing Earnest Money Deposit (EMD) under Rule 170 of General Financial Rules (GFR) 2017.
        </p>

        <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1.5">
          <div className="font-bold text-slate-800">Checklist to Claim Exemption in Cover-1:</div>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            <li>Valid UDYAM Registration Certificate with matching National Industry Classification (NIC) codes</li>
            <li>Bid Security Declaration (Form B) in lieu of EMD on bidder letterhead</li>
            <li>Class-I / Class-II Local Supplier Self-Declaration under Public Procurement (Make in India) Order</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
