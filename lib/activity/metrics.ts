import { addUtcDays, assertCalendarDate } from "@/lib/activity/dates";
import type { ActivityMetrics, ContributionDay } from "@/lib/activity/types";

export function calculateMetrics(days: ContributionDay[], asOf: string): ActivityMetrics {
  assertCalendarDate(asOf);
  const byDate = new Map<string, number>();
  for (const day of days) {
    assertCalendarDate(day.date);
    if (!Number.isInteger(day.count) || day.count < 0) throw new RangeError(`Contagem inválida para ${day.date}.`);
    byDate.set(day.date, day.count);
  }

  const sorted = [...byDate.keys()].sort();
  let longestStreak = 0;
  let currentRun = 0;
  let previous: string | undefined;
  for (const date of sorted) {
    if ((byDate.get(date) ?? 0) > 0) {
      currentRun = previous && addUtcDays(previous, 1) === date ? currentRun + 1 : 1;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 0;
    }
    previous = date;
  }

  let currentStreak = 0;
  let cursor = addUtcDays(asOf, -1);
  while (byDate.has(cursor) && (byDate.get(cursor) ?? 0) > 0) {
    currentStreak += 1;
    cursor = addUtcDays(cursor, -1);
  }

  return {
    total: [...byDate.values()].reduce((sum, count) => sum + count, 0),
    activeDays: [...byDate.values()].filter((count) => count > 0).length,
    currentStreak,
    longestStreak,
  };
}
