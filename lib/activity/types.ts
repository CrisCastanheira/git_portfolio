export type ActivityQuality = "complete" | "partial" | "stale" | "unavailable";

export type ContributionDay = {
  date: string;
  count: number;
};

export type AccountActivity = {
  login: string;
  status: "available" | "unavailable";
  days: ContributionDay[];
  message?: string;
};

export type ActivityMetrics = {
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
};

export type PortfolioSnapshot = {
  generatedAt: string;
  from: string;
  to: string;
  quality: ActivityQuality;
  accounts: AccountActivity[];
  days: ContributionDay[];
  metrics: ActivityMetrics | null;
};

export type AggregatedActivity = {
  days: ContributionDay[];
  accounts: AccountActivity[];
  quality: ActivityQuality;
};
