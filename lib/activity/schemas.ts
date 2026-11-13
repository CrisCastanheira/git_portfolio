import { z } from "zod";

const CalendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const ContributionDaySchema = z.object({
  date: CalendarDateSchema,
  count: z.number().int().nonnegative(),
});
const AccountActivitySchema = z.object({
  login: z.string().min(1),
  status: z.enum(["available", "unavailable"]),
  days: z.array(ContributionDaySchema),
  message: z.string().optional(),
});
const ActivityMetricsSchema = z.object({
  total: z.number().int().nonnegative(),
  activeDays: z.number().int().nonnegative(),
  currentStreak: z.number().int().nonnegative(),
  longestStreak: z.number().int().nonnegative(),
});

export const PortfolioSnapshotSchema = z.object({
  generatedAt: z.string().datetime({ offset: true }),
  from: CalendarDateSchema,
  to: CalendarDateSchema,
  quality: z.enum(["complete", "partial", "stale", "unavailable"]),
  accounts: z.array(AccountActivitySchema),
  days: z.array(ContributionDaySchema),
  metrics: ActivityMetricsSchema.nullable(),
});
