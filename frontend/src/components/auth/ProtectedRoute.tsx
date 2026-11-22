import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Lock, LogIn } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  title = 'Protected Feature',
  description = 'This section requires an authenticated account to access.',
}) => {
  const { isSignedIn, openSignIn } = useAuthContext();

  if (isSignedIn) {
    return <>{children}</>;
  }

  return (
    <div className="w-full max-w-lg mx-auto py-16 px-4 text-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
        <button
          onClick={openSignIn}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Continue</span>
        </button>
      </div>
    </div>
  );
};
