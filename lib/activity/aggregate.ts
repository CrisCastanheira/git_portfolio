import type { AccountActivity, AggregatedActivity, ContributionDay } from "@/lib/activity/types";
import { assertCalendarDate } from "@/lib/activity/dates";

export function aggregateContributions(accounts: AccountActivity[]): AggregatedActivity {
  const totals = new Map<string, number>();
  const available = accounts.filter((account) => account.status === "available");

  for (const account of available) {
    const onePerDate = new Map<string, number>();
    for (const day of account.days) {
      assertCalendarDate(day.date);
      if (!Number.isInteger(day.count) || day.count < 0) {
        throw new RangeError(`Contagem de contribuições inválida para ${day.date}.`);
      }
      onePerDate.set(day.date, day.count);
    }
    for (const [date, count] of onePerDate) totals.set(date, (totals.get(date) ?? 0) + count);
  }

  const days: ContributionDay[] = [...totals]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, count]) => ({ date, count }));
  const quality = available.length === 0
    ? "unavailable"
    : available.length === accounts.length ? "complete" : "partial";

  return { days, accounts: structuredClone(accounts), quality };
}
