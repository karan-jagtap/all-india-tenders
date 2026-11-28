import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Home,
  Award,
  Radio,
  CheckCircle2,
  Users,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  LogIn,
  Lock
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { useAuthContext } from './context/AuthContext';
import { HomeScreen } from './components/HomeScreen';
import { PreviouslyAcceptedTendersTab } from './components/PreviouslyAcceptedTendersTab';
import { CurrentTendersTab } from './components/CurrentTendersTab';
import { RegisteredBiddersTab } from './components/RegisteredBiddersTab';
import { AuthHeaderControls, SignInView, ClerkSetupModal, ProtectedRoute } from './components/auth';
import {
  getPlatformStats,
  triggerLiveScrape,
  getUserSyncQuota,
  getCachedUserQuota,
  PlatformStats,
  ScrapeReport,
  UserQuotaInfo
} from './services/api';
import { NavigationTab } from './types';
import { loadContractorPools } from './constants/contractors';
import { loadPortalSources } from './constants/portalSources';
import { loadMasterFilters } from './constants/masterFilters';
import { loadUiFilters } from './constants/filters';
import { SyncLiveButton, formatQuotaCountdown } from './components/common';
import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const { toggleTheme, isDark } = useTheme();
  const { isSignedIn, userId, user, openSignIn, showSetupGuide, setShowSetupGuide } = useAuthContext();
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.HOME);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(() => {
    try {
      const inProgress = localStorage.getItem('ait_sync_in_progress') === 'true';
      const activeUntil = Number(localStorage.getItem('ait_sync_active_until') || '0');
      return inProgress || activeUntil > Date.now();
    } catch {
      return false;
    }
  });
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() => {
    try {
      const expiry = Number(localStorage.getItem('ait_cooldown_expiry_epoch') || '0');
      const diff = Math.ceil((expiry - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  });
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [syncKey, setSyncKey] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [userQuota, setUserQuota] = useState<UserQuotaInfo | null>(() => {
    try {
      const lastId = localStorage.getItem('ait_last_user_id');
      if (lastId) {
        return getCachedUserQuota(lastId);
      }
    } catch {}
    return null;
  });
  const [isQuotaLoading, setIsQuotaLoading] = useState<boolean>(() => {
    try {
      const lastId = localStorage.getItem('ait_last_user_id');
      return !lastId || !localStorage.getItem(`ait_user_quota_${lastId}`);
    } catch {
      return false;
    }
  });

  // User details derived from Clerk session
  const userEmail = useMemo(() => {
    return (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      null
    );
  }, [user]);

  const userName = useMemo(() => {
    return user?.fullName || user?.firstName || user?.username || null;
  }, [user]);

  // Fetch 24-hour sync quota for signed-in user directly from database
  const fetchUserQuota = useCallback(async () => {
    if (!userId) {
      setUserQuota(null);
      setIsQuotaLoading(false);
      return;
    }
    try {
      const quota = await getUserSyncQuota(userId);
      setUserQuota(quota);
      setIsQuotaLoading(false);

      if (quota.is_sync_in_progress) {
        setIsSyncing(true);
        localStorage.setItem('ait_sync_in_progress', 'true');
        const currentUntil = Number(localStorage.getItem('ait_sync_active_until') || '0');
        if (currentUntil <= Date.now()) {
          localStorage.setItem('ait_sync_active_until', String(Date.now() + 45000));
        }
      } else {
        localStorage.removeItem('ait_sync_in_progress');
        const activeUntil = Number(localStorage.getItem('ait_sync_active_until') || '0');
        if (activeUntil <= Date.now()) {
          setIsSyncing(false);
          localStorage.removeItem('ait_sync_active_until');
        }
      }

      if (quota.cooldown_remaining_seconds && quota.cooldown_remaining_seconds > 0) {
        setCooldownRemaining(quota.cooldown_remaining_seconds);
        localStorage.setItem('ait_cooldown_expiry_epoch', String(Date.now() + quota.cooldown_remaining_seconds * 1000));
      }
    } catch (err) {
      console.warn('Failed to load user sync quota', err);
      setIsQuotaLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isSignedIn && userId) {
      localStorage.setItem('ait_last_user_id', userId);
      const cached = getCachedUserQuota(userId);
      if (cached) {
        setUserQuota(cached);
        if (cached.is_sync_in_progress) {
          setIsSyncing(true);
        }
      }
      fetchUserQuota();
    } else {
      setUserQuota(null);
      setIsQuotaLoading(false);
    }
  }, [isSignedIn, userId, fetchUserQuota]);

  // Live 1-second interval for 24-hour quota unlock countdown
  useEffect(() => {
    if (!userQuota?.is_locked || (userQuota.next_sync_available_seconds ?? 0) <= 0) return;

    const timer = setInterval(() => {
      setUserQuota((prev) => {
        if (!prev) return prev;
        const current = prev.next_sync_available_seconds ?? 0;
        if (current <= 1) {
          clearInterval(timer);
          fetchUserQuota();
          return {
            ...prev,
            next_sync_available_seconds: 0,
            is_locked: false,
            syncs_remaining: 2,
            syncs_used_24h: 0
          };
        }
        return {
          ...prev,
          next_sync_available_seconds: current - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userQuota?.is_locked, userQuota?.next_sync_available_seconds, fetchUserQuota]);

  // Sync route from URL hash or query if present (e.g. #sign-in)
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search).get('tab');
    if ((hash === '#sign-in' || hash === '#login' || search === 'sign-in' || search === 'login') && !isSignedIn) {
      setActiveTab(NavigationTab.SIGN_IN);
    }
  }, [isSignedIn]);

  // When user is signed in, ensure they are on Home/Overview instead of Sign In page
  useEffect(() => {
    if (isSignedIn && activeTab === NavigationTab.SIGN_IN) {
      setActiveTab(NavigationTab.HOME);
    }
  }, [isSignedIn, activeTab]);

  const fetchStats = useCallback(() => {
    getPlatformStats()
      .then((data) => {
        setStats(data);
        if (data?.is_sync_in_progress) {
          setIsSyncing(true);
          const currentUntil = Number(localStorage.getItem('ait_sync_active_until') || '0');
          if (currentUntil <= Date.now()) {
            localStorage.setItem('ait_sync_active_until', String(Date.now() + 45000));
          }
        } else {
          const activeUntil = Number(localStorage.getItem('ait_sync_active_until') || '0');
          if (activeUntil <= Date.now()) {
            setIsSyncing(false);
            localStorage.removeItem('ait_sync_active_until');
          }
        }
        if (data?.cooldown_remaining_seconds && data.cooldown_remaining_seconds > 0) {
          setCooldownRemaining(data.cooldown_remaining_seconds);
          localStorage.setItem('ait_cooldown_expiry_epoch', String(Date.now() + data.cooldown_remaining_seconds * 1000));
        }
      })
      .catch((err) => console.warn('Failed to load platform stats', err));
  }, []);

  // Live 1-second countdown interval for safety cooldown (persisted across refresh)
  useEffect(() => {
    if (cooldownRemaining <= 0) {
      localStorage.removeItem('ait_cooldown_expiry_epoch');
      return;
    }
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('ait_cooldown_expiry_epoch');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  // Active poller while synchronization is in progress (survives page refresh)
  useEffect(() => {
    if (!isSyncing) return;

    const pollInterval = setInterval(async () => {
      const activeUntil = Number(localStorage.getItem('ait_sync_active_until') || '0');
      if (activeUntil <= Date.now()) {
        setIsSyncing(false);
        localStorage.removeItem('ait_sync_active_until');
        fetchStats();
        fetchUserQuota();
        return;
      }

      try {
        const data = await getPlatformStats();
        setStats(data);
        if (data?.is_sync_in_progress === false && (activeUntil - Date.now() < 50000)) {
          setIsSyncing(false);
          localStorage.removeItem('ait_sync_active_until');
          setSyncKey((prev) => prev + 1);
          fetchUserQuota();
        }
      } catch {
        // Static hosting fallback
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [isSyncing, fetchStats, fetchUserQuota]);

  useEffect(() => {
    fetchStats();
    loadContractorPools();
    loadPortalSources();
    loadMasterFilters();
    loadUiFilters();
  }, [fetchStats]);

  // Close mobile hamburger menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSyncLive = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (userQuota?.is_locked) {
      const remainingTime = formatQuotaCountdown(userQuota.next_sync_available_seconds);
      setSyncNotice(
        `Daily sync limit reached (2 of 2 syncs used within 24 hours). Next live sync available in ${remainingTime}.`
      );
      setTimeout(() => setSyncNotice(null), 5000);
      return;
    }

    if (isSyncing || cooldownRemaining > 0) return;
    setIsSyncing(true);
    setSyncNotice(null);
    localStorage.setItem('ait_sync_in_progress', 'true');
    localStorage.setItem('ait_sync_active_until', String(Date.now() + 60000));

    if (userId) {
      localStorage.setItem('ait_last_user_id', userId);
      // Optimistically update quota in state & persistent storage immediately
      const currentUsed = userQuota?.syncs_used_24h ?? 0;
      const nextUsed = Math.min(2, currentUsed + 1);
      const isNowLocked = nextUsed >= 2;
      const unlockAt = isNowLocked ? new Date(Date.now() + 24 * 3600 * 1000).toISOString() : null;
      const optimisticQuota: UserQuotaInfo = {
        ...(userQuota || {
          user_id: userId,
          sync_limit: 2,
          syncs_used_24h: 0,
          syncs_remaining: 2,
          is_locked: false,
          is_sync_in_progress: true,
          next_sync_available_seconds: 0,
          next_sync_available_formatted: 'Available now',
          next_sync_available_at: null,
          last_sync_at: null
        }),
        syncs_used_24h: nextUsed,
        syncs_remaining: isNowLocked ? 0 : Math.max(0, 2 - nextUsed),
        is_locked: isNowLocked,
        is_sync_in_progress: true,
        next_sync_available_seconds: isNowLocked ? 86400 : 0,
        next_sync_available_formatted: isNowLocked ? '24h 0m 0s' : 'Available now',
        next_sync_available_at: unlockAt,
        last_sync_at: new Date().toISOString()
      };
      setUserQuota(optimisticQuota);
      try {
        localStorage.setItem(`ait_user_quota_${userId}`, JSON.stringify(optimisticQuota));
      } catch {}

      // Optimistically record sync timestamp so that immediate refresh reflects usage
      const key = `ait_sync_timestamps_${userId}`;
      try {
        let timestamps: number[] = [];
        const raw = localStorage.getItem(key);
        if (raw) timestamps = JSON.parse(raw);
        const lastTs = timestamps.length > 0 ? timestamps[timestamps.length - 1] : 0;
        if (Date.now() - lastTs > 45000) {
          timestamps.push(Date.now());
        }
        localStorage.setItem(key, JSON.stringify(timestamps));
      } catch {}
    }

    try {
      const report: ScrapeReport = await triggerLiveScrape({
        id: userId || undefined,
        email: userEmail || undefined,
        name: userName || undefined
      });
      fetchStats();
      setSyncKey((prev) => prev + 1);

      if (report.user_quota) {
        setUserQuota(report.user_quota);
      } else {
        await fetchUserQuota();
      }

      if (report.status === 'quota_exceeded') {
        setSyncNotice(report.message || 'Daily sync limit reached (2 of 2 syncs used within 24 hours).');
      } else if (report.status === 'in_progress') {
        setSyncNotice(report.message || 'A synchronization is actively in progress.');
        localStorage.setItem('ait_sync_active_until', String(Date.now() + 30000));
      } else if (report.status === 'cooldown') {
        setSyncNotice(report.message || 'Synchronization is currently in cooldown to protect portals.');
        if (report.cooldown_remaining_seconds && report.cooldown_remaining_seconds > 0) {
          setCooldownRemaining(report.cooldown_remaining_seconds);
          localStorage.setItem('ait_cooldown_expiry_epoch', String(Date.now() + report.cooldown_remaining_seconds * 1000));
        }
      } else {
        const portalCount = report.portals_scraped?.length ?? 0;
        const count = report.total_in_progress_tenders ?? 0;
        const duration = report.execution_time_ms ? `${Math.round(report.execution_time_ms)}ms` : '2.3s';
        const quotaRemaining = report.user_quota?.syncs_remaining ?? (userQuota ? Math.max(0, userQuota.syncs_remaining - 1) : 1);
        setSyncNotice(`Synced ${count} live notices across ${portalCount} portals in ${duration} • ${quotaRemaining} of 2 daily syncs remaining`);

        if (report.cooldown_remaining_seconds && report.cooldown_remaining_seconds > 0) {
          setCooldownRemaining(report.cooldown_remaining_seconds);
          localStorage.setItem('ait_cooldown_expiry_epoch', String(Date.now() + report.cooldown_remaining_seconds * 1000));
        }
      }

      setTimeout(() => {
        setSyncNotice(null);
      }, 6000);
    } catch (err: any) {
      console.error('Sync failed', err);
      setSyncNotice('Sync failed. Please check network.');
      setTimeout(() => setSyncNotice(null), 4000);
    } finally {
      localStorage.removeItem('ait_sync_in_progress');
      localStorage.removeItem('ait_sync_active_until');
      setIsSyncing(false);
      fetchUserQuota();
    }
  };

  const tabs = [
    {
      id: NavigationTab.HOME,
      label: t('nav.home'),
      subtitle: t('nav.homeSubtitle'),
      icon: Home,
      iconColor: 'text-cyan-400',
      activeClasses: 'bg-slate-900 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-slate-800 to-slate-700/80 border-slate-600',
      badge: undefined
    },
    {
      id: NavigationTab.CURRENT,
      label: t('nav.current'),
      subtitle: t('nav.currentSubtitle'),
      icon: Radio,
      iconColor: 'text-orange-500',
      activeClasses: 'bg-orange-600 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-orange-950/80 to-slate-800 border-orange-500/50',
      badge: stats?.active_tenders_count,
      badgeColor: 'bg-orange-700 text-white'
    },
    {
      id: NavigationTab.ACCEPTED,
      label: t('nav.accepted'),
      subtitle: t('nav.acceptedSubtitle'),
      icon: Award,
      iconColor: 'text-emerald-500',
      activeClasses: 'bg-emerald-600 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-emerald-950/80 to-slate-800 border-emerald-500/50',
      badge: stats?.accepted_tenders_count,
      badgeColor: 'bg-emerald-700 text-white'
    },
    {
      id: NavigationTab.BIDDERS,
      label: t('nav.bidders'),
      subtitle: t('nav.biddersSubtitle'),
      icon: Users,
      iconColor: 'text-blue-500',
      activeClasses: 'bg-blue-600 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-blue-950/80 to-slate-800 border-blue-500/50',
      badge: stats?.registered_bidders_count,
      badgeColor: 'bg-blue-700 text-white'
    }
  ];

  const currentTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070A10] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Clean Top Navbar (Logo, Title, Theme Toggle, Sync Live Button, and Mobile Hamburger Menu) */}
      <header className="bg-[#0A0E17] border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm backdrop-blur-md">
        <div className="w-full px-3.5 sm:px-6 py-2.5 max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div
            onClick={() => {
              setActiveTab(NavigationTab.HOME);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer group"
            title="Click to go to Home Landing Page"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-emerald-600 flex items-center justify-center shadow-md border border-white/20 shrink-0 group-hover:scale-105 transition-transform ring-1 ring-amber-500/20">
              <span className="text-lg sm:text-xl">🇮🇳</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight truncate group-hover:text-orange-400 transition-colors">
                {t('brand.name')}
              </h1>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                <span className="md:hidden font-semibold text-slate-200">
                  • {currentTabObj.label}
                </span>
                <span className="hidden md:inline">{t('brand.tagline')}</span>
              </p>
            </div>
          </div>

          {/* Top Actions: Theme Toggle + Sync Live + Auth Header Controls + Hamburger Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="px-2.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs group"
              title={isDark ? t('nav.switchToLight') : t('nav.switchToDark')}
              aria-label={isDark ? t('nav.switchToLight') : t('nav.switchToDark')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300 group-hover:-rotate-12 transition-transform duration-300" />
              )}
              <span className="text-[11px] font-semibold hidden sm:inline">
                {isDark ? t('nav.light') : t('nav.dark')}
              </span>
            </button>

            {/* Sync Live Button (Protected: Locked with tooltip when signed out, Quota-limited to 2 syncs/24h when signed in) */}
            <SyncLiveButton
              onClick={handleSyncLive}
              isSyncing={isSyncing}
              cooldownRemaining={cooldownRemaining}
              variant="header"
              isLocked={!isSignedIn}
              onLockedClick={openSignIn}
              quotaInfo={userQuota}
              isQuotaLoading={isQuotaLoading}
              userEmail={userEmail}
              userName={userName}
            />

            {/* Clerk Authentication Controls (Sign In Button or User Avatar Button) */}
            <AuthHeaderControls onNavigateToSignIn={() => setActiveTab(NavigationTab.SIGN_IN)} />

            {/* Mobile Hamburger Button (< md) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white border border-slate-700/80 md:hidden flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              title={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-orange-400" />
              ) : (
                <Menu className="w-5 h-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Desktop Tab Bar Navigation (Visible on md:block, hidden on smaller screens where hamburger menu is used) */}
      <nav className="hidden md:block bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 px-6 py-2.5 shadow-2xs sticky top-[57px] z-40 transition-colors">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2.5">
          {/* Main Tenders Tabs */}
          <div className="flex items-center bg-slate-100/90 dark:bg-[#131A2B] p-1 rounded-xl border border-slate-200/90 dark:border-slate-800/80 shadow-inner gap-1 shrink-0">
            {tabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const isSelected = activeTab === tabItem.id;
              const isLocked = tabItem.id === NavigationTab.BIDDERS && !isSignedIn;
              return (
                <div
                  key={tabItem.id}
                  className="relative group inline-flex"
                  title={isLocked ? t('nav.loginPromptBidders') : undefined}
                >
                  <button
                    onClick={() => setActiveTab(tabItem.id)}
                    className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      isSelected
                        ? tabItem.activeClasses
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/70 hover:shadow-2xs'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isSelected
                          ? 'text-white' + (tabItem.id === 'current' ? ' animate-pulse' : '')
                          : tabItem.iconColor
                      }`}
                    />
                    <span>{tabItem.label}</span>
                    {isLocked && (
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    {tabItem.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          isSelected ? tabItem.badgeColor : 'bg-slate-200/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {tabItem.badge}
                      </span>
                    )}
                  </button>

                  {isLocked && (
                    <div
                      role="tooltip"
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-60 p-2.5 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-amber-500/40 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 text-center"
                    >
                      <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold text-xs pb-1 border-b border-slate-800">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{t('nav.loginPromptAccess')}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                        {t('nav.loginPromptDesc')}
                      </p>
                      <div className="mt-2 pt-1 border-t border-slate-800 text-[10px] text-amber-400 font-semibold">
                        {t('nav.clickLoginRequirements')}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sync Live Notice Toast Banner on Desktop */}
          {syncNotice && (
            <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}
        </div>
      </nav>

      {/* 3. Mobile Hamburger Menu Drawer (Visible when isMobileMenuOpen is true on smaller screens) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-In Drawer */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-slideInRight text-white">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-emerald-600 flex items-center justify-center text-sm shadow-xs border border-white/20">
                  🇮🇳
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Navigation Menu</h2>
                  <p className="text-[10px] text-slate-400">All India Public Tenders</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs List */}
            <div className="p-3 space-y-2 flex-1 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Platform Sections
              </div>

              {tabs.map((tabItem) => {
                const Icon = tabItem.icon;
                const isSelected = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    title={tabItem.id === NavigationTab.BIDDERS && !isSignedIn ? t('nav.loginPromptBidders') : undefined}
                    onClick={() => {
                      setActiveTab(tabItem.id);
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full p-3 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer border ${
                      isSelected
                        ? `${tabItem.mobileActiveBg} shadow-sm text-white`
                        : 'border-transparent hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/10 text-white' : 'bg-slate-800 ' + tabItem.iconColor
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected && tabItem.id === 'current' ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white break-words">
                            {tabItem.label}
                          </span>
                          {tabItem.id === NavigationTab.BIDDERS && !isSignedIn && (
                            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          {tabItem.badge !== undefined && (
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                                isSelected ? tabItem.badgeColor : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {tabItem.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                          {tabItem.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-white' : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer with Quick Theme Toggle, Auth, & Sync Live button */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
              {/* Auth Account Action in Drawer */}
              {!isSignedIn ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openSignIn();
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              ) : (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs">
                  <span className="font-semibold text-emerald-400 text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Signed In</span>
                  </span>
                  <AuthHeaderControls />
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs">
                <span className="font-semibold text-slate-300 text-[11px]">{t('nav.appearanceTheme')}</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('nav.lightTheme')}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t('nav.darkTheme')}</span>
                    </>
                  )}
                </button>
              </div>

              <SyncLiveButton
                onClick={() => {
                  handleSyncLive();
                  setIsMobileMenuOpen(false);
                }}
                isSyncing={isSyncing}
                cooldownRemaining={cooldownRemaining}
                variant="drawer"
                isLocked={!isSignedIn}
                onLockedClick={() => {
                  setIsMobileMenuOpen(false);
                  openSignIn();
                }}
                quotaInfo={userQuota}
                isQuotaLoading={isQuotaLoading}
                userEmail={userEmail}
                userName={userName}
              />

              <div className="text-[10px] text-slate-500 text-center">
                {t('nav.automatedCronFooter')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Live Notice Toast Banner for Mobile */}
      {syncNotice && (
        <div className="md:hidden mx-3 mt-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-2 rounded-lg flex items-center gap-2 animate-pulse shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="flex-1 break-words">{syncNotice}</span>
        </div>
      )}

      {/* 4. Main Content Container (Mobile-Optimized Padding) */}
      <main className="w-full px-2.5 sm:px-6 py-4 max-w-[1920px] mx-auto flex-1">
        {activeTab === NavigationTab.HOME ? (
          <HomeScreen
            stats={stats}
            onNavigate={(tab) => setActiveTab(tab as NavigationTab)}
            onTriggerSync={handleSyncLive}
            isSyncing={isSyncing}
            cooldownRemaining={cooldownRemaining}
            quotaInfo={userQuota}
            userEmail={userEmail}
            userName={userName}
          />
        ) : activeTab === NavigationTab.CURRENT ? (
          <CurrentTendersTab key={`curr-${syncKey}`} />
        ) : activeTab === NavigationTab.ACCEPTED ? (
          <PreviouslyAcceptedTendersTab key={`acc-${syncKey}`} />
        ) : activeTab === NavigationTab.BIDDERS ? (
          <ProtectedRoute
            title="Registered Bidders & Contractor Directory"
            description="Access to contractor directories, 3-year audited financial turnovers, net worth calculations, and past awarded contract books is restricted to authenticated users. Please sign in to view registered bidders."
          >
            <RegisteredBiddersTab key={`bidders-${syncKey}`} />
          </ProtectedRoute>
        ) : activeTab === NavigationTab.SIGN_IN ? (
          <SignInView onNavigateHome={() => setActiveTab(NavigationTab.HOME)} />
        ) : (
          <HomeScreen
            stats={stats}
            onNavigate={(tab) => setActiveTab(tab as NavigationTab)}
            onTriggerSync={handleSyncLive}
            isSyncing={isSyncing}
            cooldownRemaining={cooldownRemaining}
            quotaInfo={userQuota}
            userEmail={userEmail}
            userName={userName}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0A0E17] border-t border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs py-4 px-4 sm:px-6 text-center transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-[1920px] mx-auto">
          <span>{t('brand.footer')}</span>
        </div>
      </footer>
      {/* Clerk Setup / Authentication Modal */}
      <ClerkSetupModal
        isOpen={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
      />
    </div>
  );
};

export default App;
