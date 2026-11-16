import { describe, expect, it } from "vitest";
import { selectActivity } from "@/lib/activity/select";
import type { PortfolioSnapshot } from "@/lib/activity/types";

const snapshot: PortfolioSnapshot = {
  generatedAt: "2026-11-13T07:00:00.000Z",
  from: "2025-11-14",
  to: "2026-11-13",
  quality: "partial",
  accounts: [
    {
      login: "CrisCastanheira", status: "available", days: [
        { date: "2026-10-01", count: 1 }, { date: "2026-10-15", count: 3 }, { date: "2026-11-12", count: 2 },
      ],
    },
    { login: "CristianoDazum", status: "unavailable", days: [], message: "Não consultada" },
  ],
  days: [{ date: "2026-10-01", count: 1 }, { date: "2026-10-15", count: 3 }, { date: "2026-11-12", count: 2 }],
  metrics: { total: 6, activeDays: 3, currentStreak: 1, longestStreak: 1 },
};

describe("activity selectors", () => {
  it("filters one account and an inclusive rolling period without changing source dates", () => {
    const result = selectActivity(snapshot, { account: "CrisCastanheira", periodDays: 30 });
    expect(result.quality).toBe("complete");
    expect(result.from).toBe("2026-10-15");
    expect(result.to).toBe("2026-11-13");
    expect(result.days).toEqual([
      { date: "2026-10-15", count: 3 },
      { date: "2026-11-12", count: 2 },
    ]);
    if (!result.metrics) throw new Error("A conta disponível deve incluir métricas calculadas.");
    expect(result.metrics.total).toBe(5);
  });

  it("keeps partial quality for the combined account selection and marks an unavailable account", () => {
    expect(selectActivity(snapshot, { account: "all", periodDays: 365 }).quality).toBe("partial");
    const unavailable = selectActivity(snapshot, { account: "CristianoDazum", periodDays: 365 });
    expect(unavailable.quality).toBe("unavailable");
    expect(unavailable.days).toEqual([]);
  });
});
