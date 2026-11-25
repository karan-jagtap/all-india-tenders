import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Key, ShieldCheck, Terminal, Copy, Check, ExternalLink } from 'lucide-react';
import type { ClerkSetupModalProps } from '../../types';

export type { ClerkSetupModalProps };

export const ClerkSetupModal: React.FC<ClerkSetupModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [customKey, setCustomKey] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleSaveKey = () => {
    if (!customKey.trim()) return;
    try {
      localStorage.setItem('VITE_CLERK_PUBLISHABLE_KEY', customKey.trim());
      (window as any).__CLERK_PUBLISHABLE_KEY__ = customKey.trim();
      setSavedSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 animate-scaleUp">
        {/* Header Strip */}
        <div className="h-1.5 w-full flex shrink-0">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {t('clerkSetup.title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('clerkSetup.appId', { appId: 'app_3MNQS7uCfXNbu5JrpHYdjnRRrzo' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-amber-900 dark:text-amber-200 leading-relaxed">
            <p className="font-semibold text-xs flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t('clerkSetup.noticeTitle')}</span>
            </p>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80">
              {t('clerkSetup.noticeDesc')}
            </p>
          </div>

          {/* Option A: Terminal CLI Commands */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('clerkSetup.optionA')}</span>
              </span>
              <button
                onClick={() => handleCopy('npx clerk auth login && npx clerk link --app app_3MNQS7uCfXNbu5JrpHYdjnRRrzo && npx clerk env pull', 'full')}
                className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copiedCmd === 'full' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'full' ? t('common.copied') : t('clerkSetup.copyAll')}</span>
              </button>
            </div>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] space-y-1.5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span>{t('clerkSetup.logInCli')}</span>
              </div>
              <p className="text-emerald-400 select-all">npx clerk auth login</p>
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span>{t('clerkSetup.linkApp')}</span>
              </div>
              <p className="text-emerald-400 select-all">npx clerk link --app app_3MNQS7uCfXNbu5JrpHYdjnRRrzo</p>
              <p className="text-emerald-400 select-all">npx clerk env pull</p>
            </div>
          </div>

          {/* Option B: Enter Publishable Key Directly */}
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              {t('clerkSetup.optionB')}
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('clerkSetup.whereFindKey')}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="pk_test_..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSaveKey}
                disabled={!customKey.trim()}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg cursor-pointer transition-all shrink-0"
              >
                {savedSuccess ? t('clerkSetup.keySaved') : t('clerkSetup.saveReload')}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-orange-500 flex items-center gap-1 transition-colors"
          >
            <span>{t('clerkSetup.openDashboard')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
