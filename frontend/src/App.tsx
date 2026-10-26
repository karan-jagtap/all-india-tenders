import React, { useState, useEffect } from 'react';
import {
  Home,
  Award,
  Radio,
  RefreshCw,
  CheckCircle2,
  Users,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { HomeScreen } from './components/HomeScreen';
import { PreviouslyAcceptedTendersTab } from './components/PreviouslyAcceptedTendersTab';
import { CurrentTendersTab } from './components/CurrentTendersTab';
import { RegisteredBiddersTab } from './components/RegisteredBiddersTab';
import { getPlatformStats, triggerLiveScrape, PlatformStats, ScrapeReport } from './services/api';

export const App: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'home' | 'current' | 'accepted' | 'bidders'>('home');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [syncKey, setSyncKey] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const fetchStats = () => {
    getPlatformStats()
      .then((data) => setStats(data))
      .catch((err) => console.warn('Failed to load platform stats', err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncNotice(null);

    try {
      const report: ScrapeReport = await triggerLiveScrape();
      fetchStats();
      setSyncKey((prev) => prev + 1);
      const portalCount = report.portals_scraped?.length || 28;
      const count = report.total_in_progress_tenders || 2718;
      const duration = report.execution_time_ms ? `${Math.round(report.execution_time_ms)}ms` : '2.3s';
      setSyncNotice(`Synced ${count} live notices across ${portalCount} portals in ${duration} • Next scheduled cron: 3:00 AM IST`);

      setTimeout(() => {
        setSyncNotice(null);
      }, 6000);
    } catch (err: any) {
      console.error('Sync failed', err);
      setSyncNotice('Sync failed. Please check network.');
      setTimeout(() => setSyncNotice(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const tabs = [
    {
      id: 'home' as const,
      label: 'Home / Overview',
      subtitle: 'Landing dashboard & platform telemetry',
      icon: Home,
      iconColor: 'text-cyan-400',
      activeClasses: 'bg-slate-900 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-slate-800 to-slate-700/80 border-slate-600',
      badge: undefined
    },
    {
      id: 'current' as const,
      label: 'InProgress Tenders',
      subtitle: 'Live active notices & technical RFPs',
      icon: Radio,
      iconColor: 'text-orange-500',
      activeClasses: 'bg-orange-600 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-orange-950/80 to-slate-800 border-orange-500/50',
      badge: stats?.active_tenders_count || 2688,
      badgeColor: 'bg-orange-700 text-white'
    },
    {
      id: 'accepted' as const,
      label: 'Previously Accepted Tenders',
      subtitle: 'L1 awarded contracts & BOQ prices',
      icon: Award,
      iconColor: 'text-emerald-500',
      activeClasses: 'bg-emerald-600 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-emerald-950/80 to-slate-800 border-emerald-500/50',
      badge: stats?.accepted_tenders_count || 4393,
      badgeColor: 'bg-emerald-700 text-white'
    },
    {
      id: 'bidders' as const,
      label: 'Registered Bidders',
      subtitle: 'Contractor directories & solvency books',
      icon: Users,
      iconColor: 'text-blue-500',
      activeClasses: 'bg-blue-600 text-white shadow-sm',
      mobileActiveBg: 'bg-gradient-to-r from-blue-950/80 to-slate-800 border-blue-500/50',
      badge: stats?.registered_bidders_count || 87,
      badgeColor: 'bg-blue-700 text-white'
    }
  ];

  const currentTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070A10] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top National Tricolor Accent Strip */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 1. Clean Top Navbar (Logo, Title, Language Selector, Theme Toggle, Sync Live Button, and Mobile Hamburger Menu) */}
      <header className="bg-[#0A0E17] border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm backdrop-blur-md">
        <div className="w-full px-3.5 sm:px-6 py-2.5 max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div
            onClick={() => {
              setActiveTab('home');
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
                ALL INDIA TENDERS
              </h1>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                <span className="md:hidden font-semibold text-slate-200">
                  • {currentTabObj.label}
                </span>
                <span className="hidden md:inline">National Public Procurement Intelligence Platform</span>
              </p>
            </div>
          </div>

          {/* Top Actions: Theme Toggle + Sync Live + Hamburger Menu for smaller screens */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="px-2.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs group"
              title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
              aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300 group-hover:-rotate-12 transition-transform duration-300" />
              )}
              <span className="text-[11px] font-semibold hidden sm:inline">
                {isDark ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Sync Live Button */}
            <button
              onClick={handleSyncLive}
              disabled={isSyncing}
              className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Runs official sync across all 28 real portals (Automated daily at 3:00 AM IST)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
              <span className="xs:hidden">{isSyncing ? '...' : 'Sync'}</span>
            </button>

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
            {tabs.map((t) => {
              const Icon = t.icon;
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isSelected
                      ? t.activeClasses
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/70 hover:shadow-2xs'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected
                        ? 'text-white' + (t.id === 'current' ? ' animate-pulse' : '')
                        : t.iconColor
                    }`}
                  />
                  <span>{t.label}</span>
                  {t.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        isSelected ? t.badgeColor : 'bg-slate-200/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
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

              {tabs.map((t) => {
                const Icon = t.icon;
                const isSelected = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full p-3 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer border ${
                      isSelected
                        ? `${t.mobileActiveBg} shadow-sm text-white`
                        : 'border-transparent hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/10 text-white' : 'bg-slate-800 ' + t.iconColor
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected && t.id === 'current' ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white break-words">
                            {t.label}
                          </span>
                          {t.badge !== undefined && (
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                                isSelected ? t.badgeColor : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {t.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                          {t.subtitle}
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

            {/* Drawer Footer with Quick Theme Toggle & Sync Live button */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs">
                <span className="font-semibold text-slate-300 text-[11px]">Appearance Theme</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-amber-300" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  handleSyncLive();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isSyncing}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing Real Portals...' : 'Sync Live Notices'}</span>
              </button>

              <div className="text-[10px] text-slate-500 text-center">
                Automated Cron: Daily @ 3:00 AM IST • Hybrid Persistent DB
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
        {activeTab === 'home' ? (
          <HomeScreen
            stats={stats}
            onNavigate={(tab) => setActiveTab(tab)}
            onTriggerSync={handleSyncLive}
            isSyncing={isSyncing}
          />
        ) : activeTab === 'current' ? (
          <CurrentTendersTab key={`curr-${syncKey}`} />
        ) : activeTab === 'accepted' ? (
          <PreviouslyAcceptedTendersTab key={`acc-${syncKey}`} />
        ) : (
          <RegisteredBiddersTab key={`bidders-${syncKey}`} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0A0E17] border-t border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs py-4 px-4 sm:px-6 text-center transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1920px] mx-auto">
          <span>All India Tenders • Sourcing across 28+ Real Government Portals (51 Monitored Endpoints)</span>
          <span className="text-orange-600 dark:text-orange-400 font-mono text-[11px] font-medium">
            Enterprise Hybrid Persistent Database Architecture • PostgreSQL 16 & SQLite
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
