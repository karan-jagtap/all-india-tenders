import React from 'react';
import { Globe, X, Building2, CheckCircle, Copy, Check, ShieldAlert, Search } from 'lucide-react';
import { EnrichedCurrentTender } from '../../types';

export interface PortalBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender | null;
  copiedNit: string | null;
  onCopyNit: (nit: string) => void;
}

export const PortalBridgeModal: React.FC<PortalBridgeModalProps> = ({
  isOpen,
  onClose,
  tender,
  copiedNit,
  onCopyNit
}) => {
  if (!isOpen || !tender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Portal Direct Bridge
              </h3>
              <p className="text-xs text-slate-500">
                {tender.source_portal}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tender Info */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">{tender.organization}</span>
          </div>
          <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
            {tender.title}
          </p>
        </div>

        {/* NIT Copy Box */}
        <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Tender Reference ID (Copied to Clipboard!)
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
              Ready to Paste
            </span>
          </div>
          <div className="flex items-center justify-between bg-white border border-emerald-300 rounded-lg p-2.5 shadow-2xs">
            <code className="text-xs font-mono font-bold text-slate-800 select-all">
              {tender.nit_number}
            </code>
            <button
              onClick={() => onCopyNit(tender.nit_number)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              {copiedNit === tender.nit_number ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Again</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Explanation Note */}
        <div className="mt-4 p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-blue-900">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            Why doesn't the portal open the tender in 1 click?
          </div>
          <p className="text-[11px] leading-relaxed text-blue-900/90">
            National procurement portals (CPPP, MahaTenders, defproc, etc.) are protected by government anti-scraping firewalls. They <strong>do not permit direct unauthenticated deep-links</strong> and mandate entering the Tender ID + a quick visual captcha to prevent automated bot access.
          </p>
          <div className="text-[11px] font-semibold text-blue-900 bg-blue-100/70 p-2 rounded-lg flex items-center gap-2">
            <span>⚡ How to view instantly:</span>
            <span className="font-normal">
              Click the button below &rarr; Paste (<kbd className="font-mono bg-white px-1 rounded border border-blue-300">Ctrl+V</kbd> / <kbd className="font-mono bg-white px-1 rounded border border-blue-300">Cmd+V</kbd>) into <strong>Tender ID / Ref No</strong> &rarr; Click Search.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={tender.portal_search_url || tender.portal_url}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all text-center"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>1. Open Official Search Gateway ↗</span>
          </a>

          <a
            href={tender.portal_url}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all text-center"
          >
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span>2. Open Org Directory ↗</span>
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
