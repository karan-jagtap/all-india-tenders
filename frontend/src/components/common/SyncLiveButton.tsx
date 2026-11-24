import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Clock, ShieldAlert, Lock, Zap, CheckCircle2 } from "lucide-react";
import { UserQuotaInfo } from "../../types";
import {
  formatCooldownTime,
  formatQuotaCountdown,
  formatSyncTimestamp
} from "../../utils/syncTime";

export interface SyncLiveButtonProps {
  onClick: () => void;
  isSyncing: boolean;
  cooldownRemaining?: number;
  variant?: "header" | "drawer" | "section";
  className?: string;
  tooltipPlacement?: "bottom-right" | "top" | "bottom-left";
  isLocked?: boolean; // Auth lock: true when user is signed out
  onLockedClick?: () => void;
  quotaInfo?: UserQuotaInfo | null;
  isQuotaLoading?: boolean;
  userEmail?: string | null;
  userName?: string | null;
}

export const SyncLiveButton: React.FC<SyncLiveButtonProps> = ({
  onClick,
  isSyncing,
  cooldownRemaining = 0,
  variant = "header",
  className = "",
  tooltipPlacement,
  isLocked = false,
  onLockedClick,
  quotaInfo,
  isQuotaLoading = false,
  userEmail,
  userName,
}) => {
  const { t } = useTranslation();
  const isQuotaLocked = !isLocked && !!quotaInfo?.is_locked;
  const isAnyLocked = isLocked || isQuotaLocked;
  const isInCooldown = !isQuotaLocked && cooldownRemaining > 0;
  const isDisabled = !isLocked && (isSyncing || isInCooldown || isQuotaLocked || isQuotaLoading);

  const syncsRemaining = quotaInfo?.syncs_remaining ?? 2;
  const syncsUsed = quotaInfo?.syncs_used_24h ?? 0;
  const quotaSeconds = quotaInfo?.next_sync_available_seconds ?? 0;

  // Placement defaults based on variant
  const placement =
    tooltipPlacement || (variant === "drawer" ? "top" : "bottom-right");

  const formattedCooldown = useMemo(
    () => formatCooldownTime(cooldownRemaining),
    [cooldownRemaining],
  );

  const formattedQuotaCountdownStr = useMemo(
    () => formatQuotaCountdown(quotaSeconds),
    [quotaSeconds],
  );

  const formattedLastSync = useMemo(
    () => formatSyncTimestamp(quotaInfo?.last_sync_at),
    [quotaInfo?.last_sync_at],
  );

  // Native title attribute for accessibility
  const nativeTitle = useMemo(() => {
    if (isLocked) {
      return t('sync.nativeTitleLoggedOut');
    }
    if (isQuotaLocked) {
      return t('sync.nativeTitleLimitReached', {
        time: formattedQuotaCountdownStr
      });
    }
    if (isSyncing) {
      return t('sync.nativeTitleSyncing');
    }
    if (isInCooldown) {
      return t('sync.nativeTitleCooldown', {
        time: formattedCooldown,
        remaining: syncsRemaining,
        total: 2
      });
    }
    return t('sync.nativeTitleReady', {
      remaining: syncsRemaining,
      total: 2
    });
  }, [
    isLocked,
    isQuotaLocked,
    isSyncing,
    isInCooldown,
    formattedCooldown,
    formattedQuotaCountdownStr,
    syncsRemaining,
    t
  ]);

  const tooltipPositionClass = useMemo(() => {
    switch (placement) {
      case "top":
        return "bottom-full left-0 right-0 mb-2.5";
      case "bottom-left":
        return "top-full left-0 mt-2.5";
      case "bottom-right":
      default:
        return "top-full right-0 mt-2.5";
    }
  }, [placement]);

  // Button styling variants
  let buttonClasses = "";
  if (isLocked) {
    if (variant === "header") {
      buttonClasses =
        "px-2.5 sm:px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white border border-amber-500/40 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs";
    } else if (variant === "drawer") {
      buttonClasses =
        "w-full py-2.5 px-3 bg-slate-800/95 hover:bg-slate-750 active:bg-slate-700 text-slate-200 hover:text-white border border-amber-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs";
    } else if (variant === "section") {
      buttonClasses =
        "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 dark:bg-slate-800 text-slate-200 hover:text-white border border-amber-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs";
    }
  } else if (isQuotaLocked) {
    if (variant === "header") {
      buttonClasses =
        "px-2.5 sm:px-3.5 py-2 bg-slate-800/95 text-amber-300 border border-amber-500/50 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-not-allowed shadow-xs opacity-90";
    } else if (variant === "drawer") {
      buttonClasses =
        "w-full py-2.5 px-3 bg-slate-800/95 text-amber-300 border border-amber-500/50 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed shadow-xs opacity-90";
    } else if (variant === "section") {
      buttonClasses =
        "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 cursor-not-allowed shadow-2xs opacity-90";
    }
  } else if (variant === "header") {
    buttonClasses = isDisabled
      ? "px-3 sm:px-3.5 py-2 bg-slate-800 text-slate-400 border border-slate-700/80 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-90"
      : "px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer";
  } else if (variant === "drawer") {
    buttonClasses = isDisabled
      ? "w-full py-2.5 px-3 bg-slate-800 text-slate-400 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-85"
      : "w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm";
  } else if (variant === "section") {
    buttonClasses = isDisabled
      ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-not-allowed opacity-90"
      : "px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer";
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockedClick?.();
      return;
    }
    if (isDisabled) return;
    onClick();
  };

  return (
    <div
      className={`relative group inline-flex ${variant === "drawer" ? "w-full" : ""} ${className}`}
      title={nativeTitle}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={`${buttonClasses} ${isDisabled ? "pointer-events-none" : ""}`}
      >
        {isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
        ) : isQuotaLocked ? (
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        ) : isInCooldown ? (
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        ) : (
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
        )}

        {/* Header Button Label */}
        {variant === "header" && (
          <div className="flex items-center gap-1.5">
            <span className="hidden xs:inline">
              {isSyncing
                ? t('sync.syncing')
                : isQuotaLocked
                  ? t('sync.syncLimitReached')
                  : isInCooldown
                    ? `${t('sync.sync')} (${formattedCooldown})`
                    : t('sync.syncLive')}
            </span>
            <span className="xs:hidden">
              {isSyncing
                ? "..."
                : isQuotaLocked
                  ? t('sync.locked')
                  : isInCooldown
                    ? formattedCooldown
                    : t('sync.sync')}
            </span>
            {isAnyLocked && (
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
          </div>
        )}

        {/* Drawer Button Label */}
        {variant === "drawer" && (
          <div className="flex items-center gap-2 justify-center">
            <span>
              {isSyncing
                ? t('sync.syncRealPortals')
                : isQuotaLocked
                  ? t('sync.dailyLimitReached')
                  : isInCooldown
                    ? t('sync.syncAvailableIn', { time: formattedCooldown })
                    : t('sync.syncLiveNotices')}
            </span>
            {isAnyLocked && <Lock className="w-4 h-4 text-amber-400 shrink-0" />}
          </div>
        )}

        {/* Section Button Label */}
        {variant === "section" && (
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline">
              {isSyncing
                ? t('sync.scrapingLive')
                : isQuotaLocked
                  ? t('sync.syncLimitReached')
                  : isInCooldown
                    ? `${t('sync.sync')} (${formattedCooldown})`
                    : t('sync.syncLiveScraper')}
            </span>
            <span className="sm:hidden">
              {isSyncing
                ? "..."
                : isQuotaLocked
                  ? t('sync.locked')
                  : isInCooldown
                    ? formattedCooldown
                    : t('sync.sync')}
            </span>
            {isAnyLocked && (
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
          </div>
        )}
      </button>

      {/* 1. Floating Tooltip Hover Card: Unauthenticated (Logged Out) */}
      {isLocked && (
        <div
          role="tooltip"
          className={`absolute ${tooltipPositionClass} w-72 sm:w-80 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-amber-500/50 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50`}
        >
          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-xs text-amber-300">
              {t('sync.loginPromptTitle')}
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
            <p>
              {t('sync.loginPromptDesc1')}
            </p>
            <p className="text-slate-400">
              {t('sync.loginPromptDesc2')}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              {t('sync.clickToLogIn')}
            </span>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {t('sync.loginRequiredBadge')}
            </span>
          </div>
        </div>
      )}

      {/* 2. Floating Tooltip Hover Card: Authenticated but Quota Limit Reached (2/2 in 24h) */}
      {isQuotaLocked && (
        <div
          role="tooltip"
          className={`absolute ${tooltipPositionClass} w-80 sm:w-88 p-3.5 bg-slate-900/98 dark:bg-[#0c101a]/98 text-slate-100 rounded-xl shadow-2xl border border-amber-500/60 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50`}
        >
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-xs text-amber-300">
                {t('sync.limitReachedTitle')}
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-300 bg-amber-950/80 border border-amber-800/80 px-1.5 py-0.5 rounded">
              {t('sync.lockActiveBadge')}
            </span>
          </div>

          {(userEmail || userName) && (
            <div className="text-[10px] text-slate-300 bg-slate-800/60 rounded px-2 py-1 mb-2 border border-slate-700/50 flex items-center justify-between">
              <span className="text-slate-400">{t('sync.accountLabel')}</span>
              <span className="font-medium text-slate-200 truncate max-w-[190px]">
                {userEmail || userName}
              </span>
            </div>
          )}

          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
            <p>
              {t('sync.limitExplanation')}
            </p>
            <p className="text-slate-400">
              {t('sync.lockDurationExplanation')}
            </p>
          </div>

          <div className="mt-2.5 p-2 bg-amber-950/40 border border-amber-500/40 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                <span>{t('sync.nextSyncAvailableIn')}</span>
              </span>
              <span className="font-mono font-black text-amber-300 bg-slate-900 border border-amber-500/50 px-2 py-0.5 rounded text-[11px] tracking-wide">
                {formattedQuotaCountdownStr}
              </span>
            </div>
            {formattedLastSync && (
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-amber-900/40">
                <span>{t('sync.lastSyncRecorded')}</span>
                <span className="text-slate-300 font-mono">{formattedLastSync}</span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>{t('nav.automatedCronFooter')}</span>
            <span className="font-mono text-amber-400/90 font-semibold">
              {t('sync.usedCount', { used: syncsUsed, total: quotaInfo?.sync_limit ?? 2 })}
            </span>
          </div>
        </div>
      )}

      {/* 3. Floating Tooltip Hover Card: In-Progress or 5-Min Cooldown */}
      {!isAnyLocked && isDisabled && (
        <div
          role="tooltip"
          className={`absolute ${tooltipPositionClass} w-76 sm:w-80 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-slate-700/90 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50`}
        >
          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                <span className="font-bold text-xs text-emerald-300">
                  {t('sync.syncInProgressTitle')}
                </span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-xs text-amber-300">
                  {t('sync.cooldownTitle')}
                </span>
              </>
            )}
          </div>

          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
            <p>
              <strong className="text-white">{t('sync.whyDisabled')}</strong>{" "}
              {isSyncing
                ? t('sync.whyDisabledSyncing')
                : t('sync.whyDisabledCooldown')}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              {isSyncing ? (
                <>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
                    <span>{t('sync.syncStatusLabel')}</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded text-[11px]">
                    {t('sync.syncingActiveStatus')}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t('sync.availableAgain')}</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded text-[11px]">
                    {`In ${formattedCooldown}`}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>{t('sync.dailyQuotaLabel')}</span>
              <span className="text-emerald-400 font-medium">
                {t('sync.remainingWindow', { remaining: syncsRemaining, total: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Floating Tooltip Hover Card: Authenticated & Ready to Sync */}
      {!isAnyLocked && !isDisabled && (
        <div
          role="tooltip"
          className={`absolute ${tooltipPositionClass} w-76 sm:w-80 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-emerald-500/40 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-xs text-emerald-300">
                {t('sync.livePortalSyncTitle')}
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.5 rounded">
              {t('sync.readyBadge')}
            </span>
          </div>

          {(userEmail || userName) && (
            <div className="text-[10px] text-slate-300 bg-slate-800/60 rounded px-2 py-1 mb-2 border border-slate-700/50 flex items-center justify-between">
              <span className="text-slate-400">{t('sync.signedInLabel')}</span>
              <span className="font-medium text-slate-200 truncate max-w-[190px]">
                {userEmail || userName}
              </span>
            </div>
          )}

          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
            <p>
              {t('sync.whyDisabledSyncing')}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('sync.dailyQuotaLabel')}</span>
              </span>
              <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded text-[11px]">
                {t('sync.remainingCount', { remaining: syncsRemaining, total: 2 })}
              </span>
            </div>
            {formattedLastSync && (
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                <span>{t('sync.lastSyncLabel')}</span>
                <span className="text-slate-300 font-mono">{formattedLastSync}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
