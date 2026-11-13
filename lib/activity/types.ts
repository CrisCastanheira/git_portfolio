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

export type AggregatedActivity = {
  days: ContributionDay[];
  accounts: AccountActivity[];
  quality: ActivityQuality;
};
