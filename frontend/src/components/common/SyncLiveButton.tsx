import React, { useMemo } from "react";
import { RefreshCw, Clock, ShieldAlert, Lock } from "lucide-react";

export interface SyncLiveButtonProps {
  onClick: () => void;
  isSyncing: boolean;
  cooldownRemaining?: number;
  variant?: "header" | "drawer" | "section";
  className?: string;
  tooltipPlacement?: "bottom-right" | "top" | "bottom-left";
  isLocked?: boolean;
  onLockedClick?: () => void;
}

export const formatCooldownTime = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "0s";
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }
  return `${secs}s`;
};

export const SyncLiveButton: React.FC<SyncLiveButtonProps> = ({
  onClick,
  isSyncing,
  cooldownRemaining = 0,
  variant = "header",
  className = "",
  tooltipPlacement,
  isLocked = false,
  onLockedClick,
}) => {
  const isInCooldown = cooldownRemaining > 0;
  const isDisabled = !isLocked && (isSyncing || isInCooldown);

  // Placement defaults based on variant
  const placement =
    tooltipPlacement || (variant === "drawer" ? "top" : "bottom-right");

  const formattedTime = useMemo(
    () => formatCooldownTime(cooldownRemaining),
    [cooldownRemaining],
  );

  // Native title attribute for universal accessibility & mobile tap-hold
  const nativeTitle = useMemo(() => {
    if (isLocked) {
      return "Please log in to use this feature (Sync Live Tenders)";
    }
    if (isSyncing) {
      return "Syncing live notices across 28+ government portals in progress (~2 seconds remaining).";
    }
    if (isInCooldown) {
      return `Sync disabled: 5-minute safety cooldown active to protect statutory portals (GeM, CPPP, IREPS) from rapid requests. Available again in ${formattedTime}.`;
    }
    return "Runs live scraper sync across all 28+ government portals (Automated daily at 4:00 AM IST)";
  }, [isLocked, isSyncing, isInCooldown, formattedTime]);

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
        ) : isInCooldown ? (
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        ) : (
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
        )}

        {/* Header Button Label with Lock Icon next to text */}
        {variant === "header" && (
          <div className="flex items-center gap-1.5">
            <span className="hidden xs:inline">
              {isSyncing
                ? "Syncing..."
                : isInCooldown
                  ? `Sync (${formattedTime})`
                  : "Sync Live"}
            </span>
            <span className="xs:hidden">
              {isSyncing ? "..." : isInCooldown ? formattedTime : "Sync"}
            </span>
            {isLocked && (
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
          </div>
        )}

        {/* Drawer Button Label with Lock Icon next to text */}
        {variant === "drawer" && (
          <div className="flex items-center gap-2 justify-center">
            <span>
              {isSyncing
                ? "Syncing Real Portals..."
                : isInCooldown
                  ? `Sync Available in ${formattedTime}`
                  : "Sync Live Notices"}
            </span>
            {isLocked && <Lock className="w-4 h-4 text-amber-400 shrink-0" />}
          </div>
        )}

        {/* Section Button Label with Lock Icon next to text */}
        {variant === "section" && (
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline">
              {isSyncing
                ? "Scraping Live..."
                : isInCooldown
                  ? `Sync Cooldown (${formattedTime})`
                  : "Sync Live Scraper"}
            </span>
            <span className="sm:hidden">
              {isSyncing ? "..." : isInCooldown ? formattedTime : "Sync"}
            </span>
            {isLocked && (
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
          </div>
        )}
      </button>

      {/* Floating Tooltip Hover Card: Explicitly tells the user to log in */}
      {isLocked && (
        <div
          role="tooltip"
          className={`absolute ${tooltipPositionClass} w-72 sm:w-80 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-amber-500/50 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50`}
        >
          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-xs text-amber-300">
              Please log in to use this feature
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
            <p>
              Live synchronization across all 28+ government procurement portals
              (GeM, CPPP, IREPS) requires user sign-in.
            </p>
            <p className="text-slate-400">
              Please log in or create an account before you can trigger a live
              synchronization.
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              Click to Log In →
            </span>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Login Required
            </span>
          </div>
        </div>
      )}

      {/* Floating Tooltip Hover Card: Explains WHY it's disabled and TILL HOW LONG (when not locked) */}
      {!isLocked && isDisabled && (
        <div
          role="tooltip"
          className={`absolute ${tooltipPositionClass} w-72 sm:w-80 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-xl shadow-2xl border border-slate-700/90 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50`}
        >
          {/* Header with icon and status title */}
          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                <span className="font-bold text-xs text-emerald-300">
                  Sync In Progress
                </span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-xs text-amber-300">
                  5-Minute Safety Cooldown
                </span>
              </>
            )}
          </div>

          {/* Explanation: Why it is disabled */}
          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
            <p>
              <strong className="text-white">Why is this disabled?</strong>{" "}
              {isSyncing
                ? "A live scrape is actively ingesting notices across 28+ statutory government portals (GeM, CPPP, IREPS)."
                : "To prevent rapid scraping requests or IP blocks from official government portals (GeM, CPPP, IREPS). All users share the same updated database."}
            </p>
          </div>

          {/* Countdown: Till how long */}
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Available again:</span>
            </span>
            <span className="font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded text-[11px]">
              {isSyncing ? "In ~2 seconds" : `In ${formattedTime}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
