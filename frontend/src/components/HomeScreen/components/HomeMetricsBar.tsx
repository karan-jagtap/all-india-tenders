import React from "react";
import { useTranslation } from "react-i18next";
import {
  Radio,
  TrendingDown,
  Award,
  Users,
  Globe,
  ChevronRight,
  Lock,
} from "lucide-react";
import { NavigableTab } from "../../../types";
import { useAuthContext } from "../../../context/AuthContext";

export interface HomeMetricsBarProps {
  activeTenders: number;
  totalValueCr: string;
  acceptedTenders: number;
  biddersCount: number;
  onNavigate: (tab: NavigableTab) => void;
  onScrollToSources: () => void;
}

export const HomeMetricsBar: React.FC<HomeMetricsBarProps> = ({
  activeTenders,
  totalValueCr,
  acceptedTenders,
  biddersCount,
  onNavigate,
  onScrollToSources,
}) => {
  const { t } = useTranslation();
  const { isSignedIn } = useAuthContext();

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* Metric 1: Live Notices */}
      <div
        onClick={() => onNavigate("current")}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("home.metrics.liveTenders")}
          </span>
          <Radio className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {activeTenders.toLocaleString()}
        </div>
        <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1 mt-0.5">
          <span>{t("home.metrics.inProgressUnfilled")}</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Metric 2: Pipeline Value */}
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("home.metrics.pipelineValue")}
          </span>
          <TrendingDown className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          ₹ {totalValueCr}{" "}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t("common.cr")}
          </span>
        </div>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          {t("home.metrics.estimatedCostTotal")}
        </span>
      </div>

      {/* Metric 3: Awarded Bids */}
      <div
        onClick={() => onNavigate("accepted")}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("home.metrics.awardedBids")}
          </span>
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {acceptedTenders.toLocaleString()}
        </div>
        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
          <span>{t("home.metrics.tenYrArchive")}</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Metric 4: Registered Contractors */}
      <div
        onClick={() => onNavigate("bidders")}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group"
        title={!isSignedIn ? t("nav.loginPromptBidders") : undefined}
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>{t("home.metrics.contractors")}</span>
            {!isSignedIn && (
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
            )}
          </span>
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {biddersCount}
        </div>
        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-0.5">
          <span>{t("home.metrics.epcProfiles")}</span>
          {!isSignedIn && (
            <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1 py-0.2 rounded font-mono font-bold">
              {t("home.metrics.loginBadge")}
            </span>
          )}
          {isSignedIn && <ChevronRight className="w-3 h-3" />}
        </span>
      </div>

      {/* Metric 5: Real Sourced Portals */}
      <div
        onClick={onScrollToSources}
        className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-md transition-all cursor-pointer group col-span-2 sm:col-span-1"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("home.metrics.realPortals")}
          </span>
          <Globe className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          28+
        </div>
        <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1 mt-0.5">
          <span>{t("home.metrics.statutoryCoverage")}</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </section>
  );
};
