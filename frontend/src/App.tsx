import React, { useState, useEffect } from 'react';
import { Home, Award, Radio, RefreshCw, CheckCircle2, Users } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { PreviouslyAcceptedTendersTab } from './components/PreviouslyAcceptedTendersTab';
import { CurrentTendersTab } from './components/CurrentTendersTab';
import { RegisteredBiddersTab } from './components/RegisteredBiddersTab';
import { getPlatformStats, triggerLiveScrape, PlatformStats, ScrapeReport } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'current' | 'accepted' | 'bidders'>('home');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [syncKey, setSyncKey] = useState<number>(0);

  const fetchStats = () => {
    getPlatformStats()
      .then((data) => setStats(data))
      .catch((err) => console.warn('Failed to load platform stats', err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSyncLive = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncNotice(null);

    try {
      const report: ScrapeReport = await triggerLiveScrape();
      fetchStats();
      setSyncKey((prev) => prev + 1);
      setSyncNotice(`Synced ${report.total_in_progress_tenders} live notices across ${report.portals_scraped.length} portals in ${report.execution_time_ms}ms`);

      setTimeout(() => {
        setSyncNotice(null);
      }, 5000);
    } catch (err: any) {
      console.error('Sync failed', err);
      setSyncNotice('Sync failed. Please check network.');
      setTimeout(() => setSyncNotice(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top National Tricolor Accent Strip */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 1. Clean Top Navbar (Logo, Title, and Sync Live Button) */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm">
        <div className="w-full px-3.5 sm:px-6 py-2.5 max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer group"
            title="Click to go to Home Landing Page"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-emerald-600 flex items-center justify-center shadow-md border border-white/20 shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-lg sm:text-xl">🇮🇳</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight truncate group-hover:text-orange-400 transition-colors">
                ALL INDIA TENDERS
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                National Public Procurement Intelligence Platform
              </p>
            </div>
          </div>

          {/* Sync Live Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSyncLive}
              disabled={isSyncing}
              className="px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Trigger live scraper across all 28 real government tender portals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
              <span className="xs:hidden">{isSyncing ? '...' : 'Sync'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Dedicated Navigation Div for Tabs (Below Navbar on New Line) */}
      <nav className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-2xs sticky top-[53px] sm:top-[57px] z-40">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Main Tenders Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto shadow-inner flex-wrap sm:flex-nowrap gap-1 sm:gap-0">
            {/* Home / Overview Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Home / Overview</span>
            </button>

            {/* InProgress Tenders Tab */}
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'current'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${activeTab === 'current' ? 'animate-pulse text-white' : 'text-orange-500'}`} />
              <span className="hidden sm:inline">InProgress Tenders</span>
              <span className="sm:hidden">InProgress</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                activeTab === 'current' ? 'bg-orange-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats?.active_tenders_count || 2688}
              </span>
            </button>

            {/* Previously Accepted Tenders Tab */}
            <button
              onClick={() => setActiveTab('accepted')}
              className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'accepted'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${activeTab === 'accepted' ? 'text-white' : 'text-emerald-500'}`} />
              <span className="hidden sm:inline">Previously Accepted Tenders</span>
              <span className="sm:hidden">Accepted Tenders</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                activeTab === 'accepted' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats?.accepted_tenders_count || 2602}
              </span>
            </button>

            {/* Registered Bidders Tab */}
            <button
              onClick={() => setActiveTab('bidders')}
              className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'bidders'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeTab === 'bidders' ? 'text-white' : 'text-blue-500'}`} />
              <span className="hidden sm:inline">Registered Bidders</span>
              <span className="sm:hidden">Bidders</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                activeTab === 'bidders' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats?.registered_bidders_count || 87}
              </span>
            </button>
          </div>

          {/* Sync Live Notice Toast Banner */}
          {syncNotice && (
            <div className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse self-start sm:self-auto shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}
        </div>
      </nav>

      {/* 3. Main Content Container (Mobile-Optimized Padding) */}
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
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-3.5 px-4 sm:px-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1920px] mx-auto">
          <span>All India Tenders • Sourcing across 28+ Real Government Portals (51 Monitored Endpoints)</span>
          <span className="text-orange-400 font-mono text-[11px]">
            Purely Scraping-Based Architecture • Zero Database Required
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
