import React from 'react';
import { useTranslation } from 'react-i18next';
import { SignIn } from '@clerk/react';
import { dark } from '@clerk/themes';
import { Shield, Key, ArrowLeft, Terminal, Copy, Check } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export interface SignInViewProps {
  onNavigateHome: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onNavigateHome }) => {
  const { t } = useTranslation();
  const { isConfigured, isSignedIn } = useAuthContext();
  const { isDark } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('npx clerk auth login && npx clerk link --app app_3MNQS7uCfXNbu5JrpHYdjnRRrzo && npx clerk env pull');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('auth.backToOverview')}</span>
        </button>
      </div>

      {isSignedIn ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('auth.youAreSignedIn')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('auth.signedInFullAccess')}
          </p>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            {t('auth.exploreCatalog')}
          </button>
        </div>
      ) : isConfigured ? (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
              <span>{t('auth.statutoryAuthBadge')}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('auth.signInToYourAccount')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('auth.signInSubtitle')}
            </p>
          </div>

          <SignIn
            appearance={{
              theme: isDark ? (dark as any) : undefined,
              elements: {
                rootBox: 'w-full shadow-xl rounded-2xl',
                card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl',
              },
            }}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('auth.clerkSetupTitle')}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Application: <code className="font-mono text-orange-600 dark:text-orange-400 font-bold">app_3MNQS7uCfXNbu5JrpHYdjnRRrzo</code>
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
            <p>
              Authentication is integrated using Clerk. To authenticate this environment with your existing Clerk application, run the commands below in your host terminal:
            </p>
          </div>

          {/* Option A: Terminal Commands */}
          <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-orange-400" />
                <span>Option A: Run in Terminal</span>
              </span>
              <button
                onClick={handleCopyCmd}
                className="text-orange-400 hover:underline flex items-center gap-1 cursor-pointer font-sans text-xs font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <p className="text-emerald-400 select-all">npx clerk auth login && npx clerk link --app app_3MNQS7uCfXNbu5JrpHYdjnRRrzo && npx clerk env pull</p>
          </div>

          {/* Option B: Direct Key Input */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
              Option B: Paste Publishable Key directly
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Copy <code className="font-mono text-orange-500">pk_test_...</code> from your Clerk Dashboard (under <strong>API Keys</strong>) and paste below:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="pk_test_..."
                id="clerk-publishable-key-input"
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('clerk-publishable-key-input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    localStorage.setItem('VITE_CLERK_PUBLISHABLE_KEY', input.value.trim());
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shrink-0"
              >
                Connect Key
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Public catalog is always accessible without signing in.</span>
            <button
              onClick={onNavigateHome}
              className="font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
            >
              Continue to Public View →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
