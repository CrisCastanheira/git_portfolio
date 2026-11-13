import { describe, expect, it, vi } from "vitest";
import { syncPortfolio } from "@/lib/sync/sync-portfolio";
import type { PortfolioSnapshot } from "@/lib/activity/types";
import type { SnapshotStore } from "@/lib/storage/snapshot-store";

const oldSnapshot: PortfolioSnapshot = {
  generatedAt: "2026-11-12T07:00:00.000Z",
  from: "2025-11-13",
  to: "2026-11-12",
  quality: "complete",
  accounts: [{ login: "CrisCastanheira", status: "available", days: [{ date: "2026-11-12", count: 2 }] }],
  days: [{ date: "2026-11-12", count: 2 }],
  metrics: { total: 2, activeDays: 1, currentStreak: 0, longestStreak: 1 },
};

function storeWith(previous: PortfolioSnapshot | null = null): SnapshotStore {
  return {
    getLatest: vi.fn().mockResolvedValue(previous),
    putLatest: vi.fn().mockResolvedValue(undefined),
  };
}

describe("portfolio synchronization", () => {
  it("keeps one successful account visible and records partial coverage", async () => {
    const store = storeWith();
    const snapshot = await syncPortfolio({
      now: new Date("2026-11-13T12:00:00.000Z"),
      store,
      maxRetries: 0,
      fetcher: async ({ login }) => login === "CrisCastanheira"
        ? { login, status: "available", days: [{ date: "2026-11-12", count: 4 }] }
        : { login, status: "unavailable", days: [], message: "API indisponível" },
    });
    expect(snapshot.quality).toBe("partial");
    expect(snapshot.accounts.map((account) => account.status)).toEqual(["available", "unavailable"]);
    expect(snapshot.days).toEqual([{ date: "2026-11-12", count: 4 }]);
    expect(store.putLatest).toHaveBeenCalledOnce();
  });

  it("preserves the prior valid snapshot if every source is unavailable", async () => {
    const store = storeWith(oldSnapshot);
    const result = await syncPortfolio({
      now: new Date("2026-11-13T12:00:00.000Z"),
      store,
      maxRetries: 0,
      fetcher: async ({ login }) => ({ login, status: "unavailable", days: [], message: "Offline" }),
    });
    expect(result).toEqual({ ...oldSnapshot, quality: "stale" });
    expect(store.putLatest).not.toHaveBeenCalled();
  });

  it("retries an unavailable account once, then stores the recovered result", async () => {
    const store = storeWith();
    const attempts = new Map<string, number>();
    const fetcher = vi.fn(async ({ login }: { login: string }) => {
      const attempt = (attempts.get(login) ?? 0) + 1;
      attempts.set(login, attempt);
      if (login === "CrisCastanheira" && attempt === 1) {
        return { login, status: "unavailable" as const, days: [], message: "Timeout" };
      }
      return {
        login,
        status: "available" as const,
        days: login === "CrisCastanheira" ? [{ date: "2026-11-12", count: 1 }] : [],
      };
    });
    const result = await syncPortfolio({
      now: new Date("2026-11-13T12:00:00.000Z"),
      store,
      fetcher,
      retryDelayMs: 0,
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(result.quality).toBe("complete");
    expect(result.days).toEqual([{ date: "2026-11-12", count: 1 }]);
  });
});
