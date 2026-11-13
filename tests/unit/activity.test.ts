import { describe, expect, it } from "vitest";
import { enumerateDateRange } from "@/lib/activity/dates";
import { aggregateContributions } from "@/lib/activity/aggregate";
import { calculateMetrics } from "@/lib/activity/metrics";

describe("activity domain", () => {
  it("enumerates inclusive UTC dates across leap day", () => {
    expect(enumerateDateRange("2024-02-28", "2024-03-01")).toEqual([
      "2024-02-28",
      "2024-02-29",
      "2024-03-01",
    ]);
  });

  it("sums each account once per calendar date and makes partial coverage explicit", () => {
    const result = aggregateContributions([
      { login: "CrisCastanheira", status: "available", days: [{ date: "2026-11-10", count: 3 }] },
      { login: "CristianoDazum", status: "available", days: [{ date: "2026-11-10", count: 2 }, { date: "2026-11-11", count: 4 }] },
      { login: "missing-account", status: "unavailable", days: [], message: "Sem resposta" },
    ]);

    expect(result.days).toEqual([
      { date: "2026-11-10", count: 5 },
      { date: "2026-11-11", count: 4 },
    ]);
    expect(result.quality).toBe("partial");
    expect(result.accounts).toHaveLength(3);
  });

  it("reports unavailable rather than fabricating zero activity", () => {
    const result = aggregateContributions([
      { login: "CrisCastanheira", status: "unavailable", days: [] },
      { login: "CristianoDazum", status: "unavailable", days: [] },
    ]);
    expect(result.quality).toBe("unavailable");
    expect(result.days).toEqual([]);
  });

  it("calculates streaks through yesterday using UTC dates", () => {
    expect(calculateMetrics([
      { date: "2026-11-09", count: 1 },
      { date: "2026-11-10", count: 0 },
      { date: "2026-11-11", count: 2 },
      { date: "2026-11-12", count: 1 },
      { date: "2026-11-13", count: 8 },
    ], "2026-11-13")).toEqual({
      total: 12,
      activeDays: 4,
      currentStreak: 2,
      longestStreak: 3,
    });
  });
});
