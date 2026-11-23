/**
 * Utility functions for formatting sync timers and timestamps in local time.
 */

export const formatCooldownTime = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "0s";
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }
  return `${secs}s`;
};

export const formatQuotaCountdown = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "0s";
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }
  return `${secs}s`;
};

export const formatSyncTimestamp = (isoStr?: string | null): string => {
  if (!isoStr) return "";
  try {
    let normalized = isoStr.trim();
    if (!normalized.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(normalized)) {
      normalized = normalized.replace(" ", "T") + "Z";
    }
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoStr;
  }
};
