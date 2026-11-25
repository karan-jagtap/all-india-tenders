import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Database,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Radio,
  Zap,
  CalendarClock,
  Laptop
} from 'lucide-react';
import { fetchSyncLogs, SyncLogsResponse, SyncLogItem } from '../../services/api';
import { formatDate } from '../../utils';
import type { SyncHistoryModalProps } from '../../types';

export type { SyncHistoryModalProps };

export const SyncHistoryModal: React.FC<SyncHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [data, setData] = useState<SyncLogsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'ALL' | 'MANUAL_BUTTON' | 'SCHEDULED_CRON'>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const typeParam = filterType === 'ALL' ? undefined : filterType;
      const res = await fetchSyncLogs(50, 0, typeParam);
      setData(res);
    } catch (err) {
      console.error('Failed to load sync logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen, filterType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const summary = data?.summary;
  const logs = data?.logs || [];

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const datePart = formatDate(isoString);
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      const secs = String(d.getSeconds()).padStart(2, '0');
      return `${datePart} ${hours}:${mins}:${secs}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0E1422] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Database Synchronization & Cron Audit Logs
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  table: cron_sync_logs
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Persistent audit tracking every manual scrape trigger and automated 4:00 AM IST scheduled cron job.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={loadLogs}
              disabled={isLoading}
              title="Refresh Logs"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Metrics Strip */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 sm:px-5 bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 shrink-0 text-xs">
            <div className="bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Runs</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {summary.total_runs}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold block">Automated Cron</span>
              <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">
                {summary.total_cron_runs}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold block">Manual User Sync</span>
              <span className="text-base font-extrabold text-blue-700 dark:text-blue-300">
                {summary.total_manual_runs}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">Success Rate</span>
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                {summary.success_rate_pct}%
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold block">Avg Duration</span>
              <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                {(summary.avg_duration_ms / 1000).toFixed(1)}s
              </span>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 uppercase">Filter:</span>
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Runs ({summary?.total_runs || logs.length})
            </button>
            <button
              onClick={() => setFilterType('SCHEDULED_CRON')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'SCHEDULED_CRON'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60'
              }`}
            >
              <CalendarClock className="w-3 h-3" />
              <span>Cron (4 AM)</span>
            </button>
            <button
              onClick={() => setFilterType('MANUAL_BUTTON')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'MANUAL_BUTTON'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60'
              }`}
            >
              <Laptop className="w-3 h-3" />
              <span>Manual UI</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            Showing {logs.length} of {data?.total_logs || logs.length} records
          </div>
        </div>

        {/* Scrollable Logs Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {isLoading && logs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <p className="text-xs">Querying database sync logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No synchronization audit logs found for the selected filter.
            </div>
          ) : (
            logs.map((log: SyncLogItem) => {
              const isCron = log.trigger_type === 'SCHEDULED_CRON';
              const isSuccess = log.status === 'SUCCESS';
              const isExpanded = expandedLogId === log.id;
              const durationSec = (log.execution_time_ms / 1000).toFixed(2);
              const portals = log.details?.portals_scraped || [];

              return (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0E1422] p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                >
                  {/* Top Bar of Log Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{log.id}
                      </span>
                      {isCron ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                          <CalendarClock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          Automated Daily Cron (04:00 AM IST)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          Manual Trigger {log.initiated_by ? `(${log.initiated_by})` : ''}
                        </span>
                      )}

                      {isSuccess ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          SUCCESS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          FAILED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateTime(log.created_at)}</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Live Notices</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {log.total_in_progress_count.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">DB Upserted</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        +{log.db_upserted_count} new notices
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Portals Monitored</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {log.portals_scraped_count} official feeds
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Execution Time</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">
                        {durationSec}s ({Math.round(log.execution_time_ms)}ms)
                      </span>
                    </div>
                  </div>

                  {/* Error Message if any */}
                  {log.error_message && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-200">
                      <strong className="block mb-0.5">Execution Error:</strong>
                      <span className="font-mono text-[11px]">{log.error_message}</span>
                    </div>
                  )}

                  {/* Expandable Portals Section */}
                  {portals.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="text-[11px] font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>
                          {isExpanded ? 'Hide Portals Scraped List' : `View ${portals.length} Portals Scraped Breakdown`}
                        </span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 max-h-48 overflow-y-auto">
                          {portals.map((p, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-[11px] py-1 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0"
                            >
                              <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-md">
                                {p.portal}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {p.notices_in_progress !== undefined && (
                                  <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">
                                    {p.notices_in_progress} notices
                                  </span>
                                )}
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded font-semibold">
                                  {p.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Next automatic cron trigger: <strong>04:00 AM IST (Daily)</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
