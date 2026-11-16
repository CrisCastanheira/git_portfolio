import { addUtcDays } from "@/lib/activity/dates";
import { calculateMetrics } from "@/lib/activity/metrics";
import type { ActivityMetrics, ActivityQuality, ContributionDay, PortfolioSnapshot } from "@/lib/activity/types";

export type ActivityPeriod = 30 | 90 | 365;

export type SelectedActivity = {
  days: ContributionDay[];
  from: string;
  to: string;
  quality: ActivityQuality;
  metrics: ActivityMetrics | null;
};

export function selectActivity(
  snapshot: PortfolioSnapshot,
  filters: { account: string | "all"; periodDays: ActivityPeriod },
): SelectedActivity {
  const to = snapshot.to;
  const from = addUtcDays(to, -(filters.periodDays - 1));
  const accounts = filters.account === "all"
    ? snapshot.accounts
    : snapshot.accounts.filter((account) => account.login === filters.account);
  const available = accounts.some((account) => account.status === "available");
  const quality: ActivityQuality = !available
    ? "unavailable"
    : snapshot.quality === "stale" ? "stale"
      : filters.account === "all" ? snapshot.quality : "complete";
  const sourceDays = filters.account === "all"
    ? snapshot.days
    : accounts.find((account) => account.status === "available")?.days ?? [];
  const days = sourceDays.filter((day) => day.date >= from && day.date <= to);

  return {
    days,
    from,
    to,
    quality,
    metrics: quality === "unavailable" ? null : calculateMetrics(days, to),
  };
}
