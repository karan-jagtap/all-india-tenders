import React from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn, UserCheck } from 'lucide-react';
import { UserButton, SignInButton } from '@clerk/react';
import { dark } from '@clerk/themes';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { AuthHeaderControlsProps } from '../../types';

export type { AuthHeaderControlsProps };

export const AuthHeaderControls: React.FC<AuthHeaderControlsProps> = ({ onNavigateToSignIn }) => {
  const { t } = useTranslation();
  const { isSignedIn, isConfigured, openSignIn, user } = useAuthContext();
  const { isDark } = useTheme();

  // If user is signed in with Clerk
  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        {/* User Name Badge (desktop) */}
        {user && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate max-w-[120px]">
              {user.firstName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'}
            </span>
          </div>
        )}

        {/* Native Clerk UserButton with Avatar & Popover */}
        <div className="flex items-center">
          <UserButton
            appearance={{
              theme: isDark ? (dark as any) : undefined,
              elements: {
                userButtonAvatarBox: 'w-8 h-8 rounded-lg ring-2 ring-orange-500/30',
              },
            }}
          />
        </div>
      </div>
    );
  }

  // If signed out and Clerk is configured
  if (isConfigured) {
    return (
      <SignInButton mode="modal">
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ring-1 ring-orange-400/30"
          title={t('nav.signIn')}
        >
          <LogIn className="w-3.5 h-3.5 shrink-0" />
          <span>{t('nav.signIn')}</span>
        </button>
      </SignInButton>
    );
  }

  // Fallback when Clerk publishable key is not yet configured
  return (
    <button
      type="button"
      onClick={onNavigateToSignIn || openSignIn}
      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ring-1 ring-orange-400/30"
      title={t('nav.signIn')}
    >
      <LogIn className="w-3.5 h-3.5 shrink-0" />
      <span>{t('nav.signIn')}</span>
    </button>
  );
};
