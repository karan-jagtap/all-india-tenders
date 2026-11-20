import React, { useState } from 'react';
import { Globe, X, Building2, CheckCircle, Copy, Check, ShieldAlert, Search, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showBookmarkletHelp, setShowBookmarkletHelp] = useState(false);
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);

  if (!isOpen || !tender) return null;

  const isGem = tender.source_portal?.toLowerCase().includes('gem') || tender.portal_url?.includes('gem.gov.in');
  
  // For GeM, query parameter pre-population works natively without captcha
  const portalGatewayUrl = isGem
    ? `https://bidplus.gem.gov.in/all-bids?search=${encodeURIComponent(tender.nit_number)}`
    : (tender.portal_search_url || tender.portal_url);

  const bookmarkletCode = `javascript:(async()=>{try{const t=await navigator.clipboard.readText();const inputs=Array.from(document.querySelectorAll('input[type="text"], input:not([type])'));const target=inputs.find(i=>/tender|keyword|ref/i.test(i.name||i.id||i.placeholder))||inputs[0];if(target){target.value=t;target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));}const captcha=inputs.find(i=>/captcha/i.test(i.name||i.id||i.placeholder));if(captcha){captcha.focus();}else{alert('Pasted Tender ID: '+t+'. Please enter captcha.');}}catch(e){alert('Pasting failed. Please press Ctrl+V into the search field.');}})();`;

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopiedBookmarklet(true);
    setTimeout(() => setCopiedBookmarklet(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0E1422] rounded-2xl max-w-xl w-full border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200 transition-colors max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Official Portal Direct Bridge
                </h3>
                {isGem ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Auto Pre-Populated
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Captcha Protected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {tender.source_portal}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tender Info */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{tender.organization}</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {tender.title}
          </p>
        </div>

        {/* NIT Copy Box */}
        <div className="mt-4 p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tender Reference ID (Copied to Clipboard!)
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full font-semibold">
              Ready to Paste
            </span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-lg p-2.5 shadow-2xs">
            <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 select-all">
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

        {/* Technical Reality & Explanation Note */}
        <div className="mt-4 p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-950 dark:text-blue-200 space-y-2">
          <div className="font-bold flex items-center justify-between text-blue-900 dark:text-blue-300">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Can search fields be pre-populated for all sources?
            </span>
          </div>
          {isGem ? (
            <p className="text-[11px] leading-relaxed text-blue-900/90 dark:text-blue-300/90">
              ✅ <strong>Yes for GeM:</strong> Government e-Marketplace supports URL-based search parameters with zero captcha on public searches. Clicking the gateway button below will open GeM with this Tender ID pre-filled!
            </p>
          ) : (
            <>
              <p className="text-[11px] leading-relaxed text-blue-900/90 dark:text-blue-300/90">
                ⚠️ <strong>Not natively via web links on GePNIC / State Portals:</strong> National NIC portals (CPPP, MahaTenders, defproc, etc.) run Apache Tapestry with server-side session states that deliberately <strong>ignore URL query parameters</strong> and mandate entering a human visual captcha. Furthermore, modern browsers enforce strict <em>Same-Origin Policy</em> preventing external web apps from script-injecting into government domains.
              </p>
              <div className="text-[11px] font-semibold text-blue-900 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/40 p-2 rounded-lg flex items-center gap-2">
                <span>⚡ 2-Second Workflow:</span>
                <span className="font-normal">
                  The Tender ID is already copied! Click gateway &rarr; Paste (<kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-blue-300 dark:border-blue-700">Ctrl+V</kbd> / <kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-blue-300 dark:border-blue-700">Cmd+V</kbd>) into <strong>Tender ID / Ref No</strong> &rarr; Type Captcha &rarr; Search.
                </span>
              </div>
            </>
          )}

          {/* Optional Bookmarklet Helper for 1-Click Auto-Fill */}
          {!isGem && (
            <div className="pt-1 border-t border-blue-200/60 dark:border-blue-900/40">
              <button
                type="button"
                onClick={() => setShowBookmarkletHelp(!showBookmarkletHelp)}
                className="text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Want 1-click auto-fill? Use the "Auto-Fill & Focus Captcha" Bookmarklet</span>
                {showBookmarkletHelp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showBookmarkletHelp && (
                <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2 text-[10.5px]">
                  <p className="text-slate-600 dark:text-slate-300 leading-normal">
                    Since browsers block cross-site script injection, a <strong>Bookmarklet</strong> runs locally in your browser with full access to the portal page. It reads your copied Tender ID, types it into the search box, and puts your cursor right inside the Captcha box!
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyBookmarklet}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedBookmarklet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBookmarklet ? 'Bookmarklet Copied!' : 'Copy Auto-Fill Bookmarklet'}</span>
                    </button>
                    <span className="text-slate-400">Save as a browser bookmark & click it on the portal.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={portalGatewayUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all text-center"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>
              {isGem ? '1. Open Pre-Populated GeM Search ↗' : '1. Open Official Search Gateway ↗'}
            </span>
          </a>

          <a
            href={tender.portal_url}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all text-center"
          >
            <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>2. Open Org Directory ↗</span>
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
