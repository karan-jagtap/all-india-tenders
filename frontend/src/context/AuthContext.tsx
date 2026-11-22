import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ClerkProvider, useAuth as useClerkAuth, useUser as useClerkUser, useClerk } from '@clerk/react';
import { dark } from '@clerk/themes';
import { Loader2 } from 'lucide-react';
import { useTheme } from './ThemeContext';

export interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null | undefined;
  user: any;
  isConfigured: boolean;
  openSignIn: () => void;
  openSignUp: () => void;
  signOut: () => Promise<void>;
  showSetupGuide: boolean;
  setShowSetupGuide: (show: boolean) => void;
}

const defaultAuthContext: AuthContextType = {
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  user: null,
  isConfigured: false,
  openSignIn: () => {},
  openSignUp: () => {},
  signOut: async () => {},
  showSetupGuide: false,
  setShowSetupGuide: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuthContext = (): AuthContextType => {
  return useContext(AuthContext);
};

// Internal bridge component that consumes Clerk's native hooks
const ClerkAuthBridge: React.FC<{
  children: React.ReactNode;
  showSetupGuide: boolean;
  setShowSetupGuide: (show: boolean) => void;
}> = ({ children, showSetupGuide, setShowSetupGuide }) => {
  const { isLoaded, isSignedIn, userId } = useClerkAuth();
  const { user } = useClerkUser();
  const clerk = useClerk();
  const [timedOut, setTimedOut] = useState<boolean>(false);

  // Safety fallback after 6s in case network/initialization stalls
  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  const authValue = useMemo<AuthContextType>(() => ({
    isLoaded: !!isLoaded || timedOut,
    isSignedIn: !!isSignedIn,
    userId: userId ?? null,
    user: user ?? null,
    isConfigured: true,
    openSignIn: () => {
      try {
        clerk.openSignIn();
      } catch (e) {
        console.warn('Failed to open Clerk signIn modal', e);
      }
    },
    openSignUp: () => {
      try {
        clerk.openSignUp();
      } catch (e) {
        console.warn('Failed to open Clerk signUp modal', e);
      }
    },
    signOut: async () => {
      await clerk.signOut();
    },
    showSetupGuide,
    setShowSetupGuide,
  }), [isLoaded, timedOut, isSignedIn, userId, user, clerk, showSetupGuide, setShowSetupGuide]);

  // Keep the page loading while Clerk restores the user session
  if (!isLoaded && !timedOut) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070A10] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center font-sans select-none">
        {/* Top National Tricolor Accent Strip */}
        <div className="fixed top-0 left-0 right-0 h-1.5 w-full flex shrink-0 z-50">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        <div className="flex flex-col items-center gap-5 p-8 max-w-sm text-center animate-fadeIn">
          {/* Logo with pulsing glow */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-emerald-600 flex items-center justify-center shadow-lg border border-white/20">
              <span className="text-3xl">🇮🇳</span>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500 to-emerald-500 opacity-25 blur-md animate-pulse" />
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              ALL INDIA TENDERS
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              National Public Procurement Intelligence Platform
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs mt-2">
            <Loader2 className="w-4 h-4 animate-spin text-orange-500 shrink-0" />
            <span>Restoring secure session...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Read publishable key from environment (Vite uses VITE_ prefix) or localStorage
  const publishableKey =
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
    (typeof window !== 'undefined'
      ? (window as any).__CLERK_PUBLISHABLE_KEY__ || localStorage.getItem('VITE_CLERK_PUBLISHABLE_KEY')
      : undefined);

  if (publishableKey) {
    return (
      <ClerkProvider
        publishableKey={publishableKey}
        appearance={{
          theme: isDark ? (dark as any) : undefined,
          variables: {
            colorPrimary: '#ea580c', // Orange-600 matching our tricolor theme
          },
        }}
      >
        <ClerkAuthBridge showSetupGuide={showSetupGuide} setShowSetupGuide={setShowSetupGuide}>
          {children}
        </ClerkAuthBridge>
      </ClerkProvider>
    );
  }

  // Graceful fallback when publishable key is not yet set
  const fallbackValue: AuthContextType = {
    isLoaded: true,
    isSignedIn: false,
    userId: null,
    user: null,
    isConfigured: false,
    openSignIn: () => setShowSetupGuide(true),
    openSignUp: () => setShowSetupGuide(true),
    signOut: async () => {},
    showSetupGuide,
    setShowSetupGuide,
  };

  return (
    <AuthContext.Provider value={fallbackValue}>
      {children}
    </AuthContext.Provider>
  );
};
